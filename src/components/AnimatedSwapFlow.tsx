"use client";

import { useEffect, useRef, useState } from "react";
import {
  assetOptions,
  defaultSlippageOptions,
  easeOutExpo,
  FORM_AMOUNT,
  limitTransactionTypes,
  marketTransactionTypes,
  PENDING_SECONDS,
  PROGRESS_CIRCUMFERENCE,
  RECEIVE_AMOUNT,
  REVIEW_SECONDS,
  timeInForceOptions,
  type AssetOption,
  type FormMode,
  type Scene,
} from "./AnimatedSwapFlow.constants";
import { FormSection, type AssetTarget } from "./AnimatedSwapFlowFormSection";
import {
  PendingScene,
  ReviewScene,
  SuccessScene,
} from "./AnimatedSwapFlowScenes";
import {
  calculatePayFromReceive,
  calculateReceiveFromPay,
  formatEditableAmount,
  formatLimitPrice,
  sanitizeNumericInput,
  toNumeric,
} from "./AnimatedSwapFlow.utils";
import styles from "./AnimatedSwapFlow.module.css";

export function AnimatedSwapFlow() {
  const [scene, setScene] = useState<Scene>("form");
  const [formMode, setFormMode] = useState<FormMode>("market");

  const [payAsset, setPayAsset] = useState<AssetOption>(assetOptions[0]);
  const [receiveAsset, setReceiveAsset] = useState<AssetOption>(assetOptions[1]);

  const [typedAmount, setTypedAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [quoteReady, setQuoteReady] = useState(false);

  const [quoteSeconds, setQuoteSeconds] = useState(REVIEW_SECONDS);
  const [pendingSeconds, setPendingSeconds] = useState(PENDING_SECONDS);
  const [pendingProgress, setPendingProgress] = useState(1);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [slippage, setSlippage] =
    useState<(typeof defaultSlippageOptions)[number]>(defaultSlippageOptions[0]);
  const [mevProtection, setMevProtection] = useState(true);

  const [assetMenuTarget, setAssetMenuTarget] = useState<AssetTarget | null>(null);

  const [transactionType, setTransactionType] =
    useState<(typeof marketTransactionTypes)[number] | (typeof limitTransactionTypes)[number]>(
      marketTransactionTypes[0],
    );
  const [transactionTypeOpen, setTransactionTypeOpen] = useState(false);

  const [limitPrice, setLimitPrice] =
    useState(formatLimitPrice(payAsset.usdPrice / receiveAsset.usdPrice));
  const [timeInForce, setTimeInForce] =
    useState<(typeof timeInForceOptions)[number]>(timeInForceOptions[0]);
  const [timeInForceOpen, setTimeInForceOpen] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const rafsRef = useRef<number[]>([]);

  const transactionTypeOptions =
    formMode === "market" ? marketTransactionTypes : limitTransactionTypes;

  function closeMenus() {
    setSettingsOpen(false);
    setAssetMenuTarget(null);
    setTransactionTypeOpen(false);
    setTimeInForceOpen(false);
  }

  function clearScheduledWork() {
    for (const timeout of timeoutsRef.current) {
      window.clearTimeout(timeout);
    }

    for (const raf of rafsRef.current) {
      window.cancelAnimationFrame(raf);
    }

    timeoutsRef.current = [];
    rafsRef.current = [];
  }

  function schedule(delay: number, callback: () => void) {
    const timeout = window.setTimeout(callback, delay);
    timeoutsRef.current.push(timeout);
  }

  function animateValue({
    duration,
    format,
    from,
    setter,
    to,
  }: {
    duration: number;
    format: (value: number) => string;
    from: number;
    setter: (value: string) => void;
    to: number;
  }) {
    const startedAt = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = easeOutExpo(progress);
      const currentValue = from + (to - from) * eased;

      setter(format(currentValue));

      if (progress < 1) {
        const raf = window.requestAnimationFrame(tick);
        rafsRef.current.push(raf);
      }
    }

    const raf = window.requestAnimationFrame(tick);
    rafsRef.current.push(raf);
  }

  function updateQuoteFromPay({
    nextLimitPrice,
    nextMode,
    nextPayAmount,
    nextPayAsset,
    nextReceiveAsset,
  }: {
    nextLimitPrice: number;
    nextMode: FormMode;
    nextPayAmount: string;
    nextPayAsset: AssetOption;
    nextReceiveAsset: AssetOption;
  }) {
    const numericPayAmount = toNumeric(nextPayAmount);
    if (numericPayAmount <= 0) {
      setReceiveAmount("");
      setQuoteReady(false);
      return;
    }

    const nextReceiveValue = calculateReceiveFromPay({
      payValue: numericPayAmount,
      payAsset: nextPayAsset,
      receiveAsset: nextReceiveAsset,
      mode: nextMode,
      limitPrice: nextLimitPrice,
    });

    const formattedReceive = formatEditableAmount(nextReceiveValue);
    setReceiveAmount(formattedReceive);
    setQuoteReady(Boolean(formattedReceive));
  }

  function updateQuoteFromReceive({
    nextLimitPrice,
    nextMode,
    nextPayAsset,
    nextReceiveAmount,
    nextReceiveAsset,
  }: {
    nextLimitPrice: number;
    nextMode: FormMode;
    nextPayAsset: AssetOption;
    nextReceiveAmount: string;
    nextReceiveAsset: AssetOption;
  }) {
    const numericReceiveAmount = toNumeric(nextReceiveAmount);
    if (numericReceiveAmount <= 0) {
      setTypedAmount("");
      setQuoteReady(false);
      return;
    }

    const nextPayValue = calculatePayFromReceive({
      receiveValue: numericReceiveAmount,
      payAsset: nextPayAsset,
      receiveAsset: nextReceiveAsset,
      mode: nextMode,
      limitPrice: nextLimitPrice,
    });

    const formattedPay = formatEditableAmount(nextPayValue);
    setTypedAmount(formattedPay);
    setQuoteReady(Boolean(formattedPay));
  }

  function populateQuote(payAmount: number, receiveQuote: number) {
    clearScheduledWork();
    setQuoteReady(false);
    setTypedAmount("");
    setReceiveAmount("");

    schedule(80, () => {
      animateValue({
        from: 0,
        to: payAmount,
        duration: 820,
        setter: setTypedAmount,
        format: (value) => formatEditableAmount(value, 2),
      });

      animateValue({
        from: 0,
        to: receiveQuote,
        duration: 900,
        setter: setReceiveAmount,
        format: (value) => formatEditableAmount(value, 2),
      });
    });

    schedule(860, () => {
      setQuoteReady(true);
    });
  }

  function handlePayInputChange(value: string) {
    const nextPayInput = sanitizeNumericInput(value);
    setTypedAmount(nextPayInput);

    updateQuoteFromPay({
      nextPayAmount: nextPayInput,
      nextPayAsset: payAsset,
      nextReceiveAsset: receiveAsset,
      nextMode: formMode,
      nextLimitPrice: toNumeric(limitPrice),
    });
  }

  function handleReceiveInputChange(value: string) {
    const nextReceiveInput = sanitizeNumericInput(value);
    setReceiveAmount(nextReceiveInput);

    updateQuoteFromReceive({
      nextReceiveAmount: nextReceiveInput,
      nextPayAsset: payAsset,
      nextReceiveAsset: receiveAsset,
      nextMode: formMode,
      nextLimitPrice: toNumeric(limitPrice),
    });
  }

  function handleFormModeChange(nextMode: FormMode) {
    if (nextMode === formMode) {
      return;
    }

    closeMenus();
    setFormMode(nextMode);
    setTransactionType(
      nextMode === "market" ? marketTransactionTypes[0] : limitTransactionTypes[0],
    );

    const marketReferencePrice = payAsset.usdPrice / receiveAsset.usdPrice;
    if (nextMode === "limit") {
      setLimitPrice(formatLimitPrice(marketReferencePrice));
    }

    if (typedAmount) {
      updateQuoteFromPay({
        nextPayAmount: typedAmount,
        nextPayAsset: payAsset,
        nextReceiveAsset: receiveAsset,
        nextMode,
        nextLimitPrice: nextMode === "limit" ? marketReferencePrice : toNumeric(limitPrice),
      });
    }
  }

  function handleSwapDirection() {
    closeMenus();

    const previousPayAsset = payAsset;
    const previousReceiveAsset = receiveAsset;
    const previousPayAmount = typedAmount;
    const previousReceiveAmount = receiveAmount;

    setPayAsset(previousReceiveAsset);
    setReceiveAsset(previousPayAsset);
    setTypedAmount(previousReceiveAmount);
    setReceiveAmount(previousPayAmount);

    if (formMode === "limit") {
      const currentLimit = toNumeric(limitPrice);
      if (currentLimit > 0) {
        setLimitPrice(formatLimitPrice(1 / currentLimit));
      }
    }

    setQuoteReady(toNumeric(previousReceiveAmount) > 0 && toNumeric(previousPayAmount) > 0);
  }

  function handleAssetSelect(target: AssetTarget, selectedAsset: AssetOption) {
    let nextPayAsset = payAsset;
    let nextReceiveAsset = receiveAsset;

    if (target === "pay") {
      nextPayAsset = selectedAsset;
      if (selectedAsset.symbol === receiveAsset.symbol) {
        nextReceiveAsset = payAsset;
      }
    } else {
      nextReceiveAsset = selectedAsset;
      if (selectedAsset.symbol === payAsset.symbol) {
        nextPayAsset = receiveAsset;
      }
    }

    setPayAsset(nextPayAsset);
    setReceiveAsset(nextReceiveAsset);
    setAssetMenuTarget(null);

    const nextLimitPriceValue =
      formMode === "limit"
        ? nextPayAsset.usdPrice / nextReceiveAsset.usdPrice
        : toNumeric(limitPrice);

    if (formMode === "limit") {
      setLimitPrice(formatLimitPrice(nextLimitPriceValue));
    }

    if (typedAmount) {
      updateQuoteFromPay({
        nextPayAmount: typedAmount,
        nextPayAsset,
        nextReceiveAsset,
        nextMode: formMode,
        nextLimitPrice: nextLimitPriceValue,
      });
      return;
    }

    if (receiveAmount) {
      updateQuoteFromReceive({
        nextReceiveAmount: receiveAmount,
        nextPayAsset,
        nextReceiveAsset,
        nextMode: formMode,
        nextLimitPrice: nextLimitPriceValue,
      });
    }
  }

  function handleLimitPriceChange(value: string) {
    const nextLimitInput = sanitizeNumericInput(value);
    setLimitPrice(nextLimitInput);

    const nextLimitNumeric = toNumeric(nextLimitInput);
    if (!typedAmount) {
      return;
    }

    updateQuoteFromPay({
      nextPayAmount: typedAmount,
      nextPayAsset: payAsset,
      nextReceiveAsset: receiveAsset,
      nextMode: "limit",
      nextLimitPrice: nextLimitNumeric,
    });
  }

  function handleUseMidPrice() {
    const nextMidPrice = payAsset.usdPrice / receiveAsset.usdPrice;
    setLimitPrice(formatLimitPrice(nextMidPrice));

    if (!typedAmount) {
      return;
    }

    updateQuoteFromPay({
      nextPayAmount: typedAmount,
      nextPayAsset: payAsset,
      nextReceiveAsset: receiveAsset,
      nextMode: "limit",
      nextLimitPrice: nextMidPrice,
    });
  }

  function handleToggleSettings() {
    setSettingsOpen((previous) => !previous);
    setAssetMenuTarget(null);
    setTransactionTypeOpen(false);
    setTimeInForceOpen(false);
  }

  function handleToggleAssetMenu(target: AssetTarget) {
    setAssetMenuTarget((previous) => (previous === target ? null : target));
    setSettingsOpen(false);
    setTransactionTypeOpen(false);
    setTimeInForceOpen(false);
  }

  function handleToggleTransactionType() {
    setTransactionTypeOpen((previous) => !previous);
    setSettingsOpen(false);
    setTimeInForceOpen(false);
  }

  function handleToggleTimeInForce() {
    setTimeInForceOpen((previous) => !previous);
    setSettingsOpen(false);
    setTransactionTypeOpen(false);
  }

  function handleReview() {
    if (!quoteReady) {
      return;
    }

    setQuoteSeconds(REVIEW_SECONDS);
    setScene("review");
  }

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!frameRef.current?.contains(event.target as Node)) {
        closeMenus();
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    const activeScene = frameRef.current?.querySelector<HTMLElement>(`[data-scene="${scene}"]`);
    if (activeScene) {
      activeScene.scrollTop = 0;
    }
  }, [scene]);

  useEffect(() => {
    clearScheduledWork();

    if (scene === "review") {
      for (let seconds = REVIEW_SECONDS - 1; seconds >= 0; seconds -= 1) {
        schedule((REVIEW_SECONDS - seconds) * 1000, () => {
          setQuoteSeconds(seconds);
        });
      }
    }

    if (scene === "pending") {
      const startedAt = performance.now();

      function progressTick(now: number) {
        const elapsed = Math.min((now - startedAt) / 4000, 1);
        setPendingProgress(1 - elapsed);

        if (elapsed < 1) {
          const raf = window.requestAnimationFrame(progressTick);
          rafsRef.current.push(raf);
        }
      }

      const raf = window.requestAnimationFrame(progressTick);
      rafsRef.current.push(raf);

      schedule(1000, () => setPendingSeconds(3));
      schedule(2000, () => setPendingSeconds(2));
      schedule(3000, () => setPendingSeconds(1));
      schedule(4000, () => setPendingSeconds(0));
      schedule(4300, () => {
        setScene("success");
      });
    }

    return clearScheduledWork;
  }, [scene]);

  useEffect(() => clearScheduledWork, []);

  const strokeOffset = PROGRESS_CIRCUMFERENCE * (1 - pendingProgress);
  const payAmountNumeric = toNumeric(typedAmount);
  const receiveAmountNumeric = toNumeric(receiveAmount);

  return (
    <div className={styles.shell}>
      <div className={styles.frame} ref={frameRef}>
        <FormSection
          assetMenuTarget={assetMenuTarget}
          formMode={formMode}
          isActive={scene === "form"}
          limitPrice={limitPrice}
          mevProtection={mevProtection}
          onAssetMenuToggle={handleToggleAssetMenu}
          onAssetSelect={handleAssetSelect}
          onFillHalf={() => populateQuote(FORM_AMOUNT * 0.5, RECEIVE_AMOUNT * 0.5)}
          onFillMax={() => populateQuote(FORM_AMOUNT, RECEIVE_AMOUNT)}
          onFillQuarter={() => populateQuote(FORM_AMOUNT * 0.25, RECEIVE_AMOUNT * 0.25)}
          onFormModeChange={handleFormModeChange}
          onLimitPriceChange={handleLimitPriceChange}
          onMevProtectionToggle={() => setMevProtection((previous) => !previous)}
          onPayAmountChange={handlePayInputChange}
          onReceiveAmountChange={handleReceiveInputChange}
          onReview={handleReview}
          onSettingsToggle={handleToggleSettings}
          onSlippageChange={setSlippage}
          onSwapDirection={handleSwapDirection}
          onTimeInForceSelect={(option) => {
            setTimeInForce(option);
            setTimeInForceOpen(false);
          }}
          onTimeInForceToggle={handleToggleTimeInForce}
          onTransactionTypeSelect={(option) => {
            setTransactionType(
              option as (typeof marketTransactionTypes)[number] | (typeof limitTransactionTypes)[number],
            );
            setTransactionTypeOpen(false);
          }}
          onTransactionTypeToggle={handleToggleTransactionType}
          onUseMidPrice={handleUseMidPrice}
          payAsset={payAsset}
          quoteReady={quoteReady}
          receiveAmount={receiveAmount}
          receiveAsset={receiveAsset}
          settingsOpen={settingsOpen}
          slippage={slippage}
          timeInForce={timeInForce}
          timeInForceOpen={timeInForceOpen}
          transactionType={transactionType}
          transactionTypeOpen={transactionTypeOpen}
          transactionTypeOptions={transactionTypeOptions}
          typedAmount={typedAmount}
        />

        <ReviewScene
          formMode={formMode}
          isActive={scene === "review"}
          onBack={() => setScene("form")}
          onPlaceOrder={() => {
            setPendingSeconds(PENDING_SECONDS);
            setPendingProgress(1);
            setScene("pending");
          }}
          payAmountNumeric={payAmountNumeric}
          payAsset={payAsset}
          quoteSeconds={quoteSeconds}
          receiveAmount={receiveAmount}
          receiveAmountNumeric={receiveAmountNumeric}
          receiveAsset={receiveAsset}
          typedAmount={typedAmount}
        />

        <PendingScene
          isActive={scene === "pending"}
          pendingSeconds={pendingSeconds}
          strokeOffset={strokeOffset}
        />

        <SuccessScene
          isActive={scene === "success"}
          onNewTrade={() => {
            setTypedAmount("");
            setReceiveAmount("");
            setQuoteReady(false);
            setQuoteSeconds(REVIEW_SECONDS);
            setPendingSeconds(PENDING_SECONDS);
            setPendingProgress(1);
            setScene("form");
          }}
          payAsset={payAsset}
          receiveAmount={receiveAmount}
          receiveAsset={receiveAsset}
          typedAmount={typedAmount}
        />
      </div>
    </div>
  );
}
