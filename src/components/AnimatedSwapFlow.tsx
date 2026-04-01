"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  confettiPieces,
  easeOutExpo,
  FORM_AMOUNT,
  formatPending,
  PENDING_SECONDS,
  PROGRESS_CIRCUMFERENCE,
  RECEIVE_AMOUNT,
  REVIEW_SECONDS,
  timelineItems,
  type Scene,
} from "./AnimatedSwapFlow.constants";
import {
  BackArrowIcon,
  CheckIcon,
  ChevronDownIcon,
  EthereumIcon,
  ForwardArrowIcon,
  GearIcon,
  InfoIcon,
  PolygonIcon,
  ProtocolIcon,
  SwapDirectionIcon,
  SwapHorizontalIcon,
  TetherIcon,
} from "./AnimatedSwapFlowIcons";
import styles from "./AnimatedSwapFlow.module.css";
import successStyles from "./AnimatedSwapFlowSuccess.module.css";

function BadgeButton({
  icon,
  label,
  tone,
}: {
  icon: ReactNode;
  label: string;
  tone: "mint" | "lavender";
}) {
  return (
    <button
      className={`${styles.tokenButton} ${
        tone === "mint" ? styles.tokenMint : styles.tokenLavender
      }`}
      type="button"
    >
      <span className={styles.tokenIconWrap}>{icon}</span>
      <span>{label}</span>
      <ChevronDownIcon />
    </button>
  );
}

function Pill({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button className={styles.neutralPill} onClick={onClick} type="button">
      {children}
    </button>
  );
}

function FormLine({
  label,
  balance,
  pill,
  amount,
  placeholder,
  children,
}: {
  label: string;
  balance: string;
  pill: ReactNode;
  amount: string;
  placeholder?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={styles.formBlock}>
      <div className={styles.rowBetween}>
        <h3 className={styles.sectionLabel}>{label}</h3>
        <p className={styles.balanceText}>Balance: {balance}</p>
      </div>

      <div className={styles.rowBetween}>
        {pill}
        {children}
      </div>

      <div className={`${styles.amountRow} ${placeholder ? styles.placeholderAmount : ""}`}>
        <span>{amount}</span>
        <span aria-hidden="true" className={styles.cursor} />
      </div>
    </div>
  );
}

export function AnimatedSwapFlow() {
  const [scene, setScene] = useState<Scene>("form");
  const [typedAmount, setTypedAmount] = useState("0.00");
  const [receiveAmount, setReceiveAmount] = useState("0.00");
  const [quoteReady, setQuoteReady] = useState(false);
  const [quoteSeconds, setQuoteSeconds] = useState(REVIEW_SECONDS);
  const [pendingSeconds, setPendingSeconds] = useState(PENDING_SECONDS);
  const [pendingProgress, setPendingProgress] = useState(1);

  const timeoutsRef = useRef<number[]>([]);
  const rafsRef = useRef<number[]>([]);

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
    from,
    to,
    duration,
    setter,
    format,
  }: {
    from: number;
    to: number;
    duration: number;
    setter: (value: string) => void;
    format: (value: number) => string;
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

  function formatAmount(value: number) {
    return value % 1 === 0 ? `${value}` : `${Number(value.toFixed(2))}`;
  }

  function populateQuote(payAmount: number, receiveQuote: number) {
    clearScheduledWork();
    setQuoteReady(false);
    setTypedAmount("0.00");
    setReceiveAmount("0.00");

    schedule(80, () => {
      animateValue({
        from: 0,
        to: payAmount,
        duration: 820,
        setter: setTypedAmount,
        format: formatAmount,
      });

      animateValue({
        from: 0,
        to: receiveQuote,
        duration: 900,
        setter: setReceiveAmount,
        format: (value) => value.toFixed(2),
      });
    });

    schedule(860, () => {
      setQuoteReady(true);
    });
  }

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

  return (
    <div className={styles.shell}>
      <div className={styles.frame}>
        <section
          aria-hidden={scene !== "form"}
          className={`${styles.scene} ${
            scene === "form" ? styles.sceneActive : styles.sceneHidden
          }`}
        >
          <div className={styles.topBar}>
            <div className={styles.tabRow}>
              <button className={`${styles.tab} ${styles.tabActive}`} type="button">
                Market
              </button>
              <button className={styles.tab} type="button">
                Limit
              </button>
            </div>
            <button aria-label="Settings" className={styles.iconButton} type="button">
              <GearIcon />
            </button>
          </div>

          <div className={styles.divider} />

          <FormLine
            amount={typedAmount}
            balance="1.464"
            label="Pay with"
            pill={<BadgeButton icon={<TetherIcon />} label="USDT" tone="mint" />}
            placeholder={!quoteReady}
          >
            <div className={styles.quickPills}>
              <Pill onClick={() => populateQuote(FORM_AMOUNT, RECEIVE_AMOUNT)}>MAX</Pill>
              <Pill onClick={() => populateQuote(FORM_AMOUNT * 0.5, RECEIVE_AMOUNT * 0.5)}>
                50%
              </Pill>
              <Pill onClick={() => populateQuote(FORM_AMOUNT * 0.25, RECEIVE_AMOUNT * 0.25)}>
                25%
              </Pill>
            </div>
          </FormLine>

          <div className={styles.midSwapButton}>
            <button aria-label="Swap direction" className={styles.swapButton} type="button">
              <SwapDirectionIcon />
            </button>
          </div>

          <div className={styles.divider} />

          <FormLine
            amount={receiveAmount}
            balance="42.4"
            label="You receive"
            pill={<BadgeButton icon={<PolygonIcon />} label="MATIC" tone="lavender" />}
            placeholder={!quoteReady}
          />

          <div className={`${styles.quoteMeta} ${quoteReady ? styles.quoteMetaVisible : ""}`}>
            <div className={styles.metaRow}>
              <span>Transaction type</span>
              <span className={styles.metaValue}>
                Matcha Auto
                <ChevronDownIcon />
              </span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabelWithIcon}>
                Fee (included)
                <InfoIcon />
              </span>
              <span className={styles.metaFeeValue}>
                <TetherIcon compact />
                22.45 USDT ($22.43)
              </span>
            </div>
          </div>

          <div className={styles.bottomCtaWrap}>
            <button
              className={`${styles.primaryCta} ${
                quoteReady ? styles.primaryCtaReady : styles.primaryCtaIdle
              }`}
              onClick={() => {
                if (quoteReady) {
                  setQuoteSeconds(REVIEW_SECONDS);
                  setScene("review");
                }
              }}
              type="button"
            >
              Review order
            </button>
          </div>
        </section>

        <section
          aria-hidden={scene !== "review"}
          className={`${styles.scene} ${
            scene === "review" ? styles.sceneActive : styles.sceneHidden
          }`}
        >
          <div className={styles.reviewHeader}>
            <button
              aria-label="Back"
              className={styles.iconButton}
              onClick={() => setScene("form")}
              type="button"
            >
              <BackArrowIcon />
            </button>
            <p className={styles.reviewTitle}>Quote expires in {quoteSeconds}s</p>
            <span className={styles.iconSpacer} />
          </div>

          <div className={styles.quoteCardsWrap}>
            <div className={styles.reviewCard}>
              <EthereumIcon big />
              <p className={styles.reviewAmount}>253.63 ETH</p>
              <p className={styles.reviewSubAmount}>$270,005.44</p>
            </div>
            <div className={styles.arrowBridge}>
              <ForwardArrowIcon />
            </div>
            <div className={styles.reviewCard}>
              <PolygonIcon big />
              <p className={styles.reviewAmount}>284254.26 MATIC</p>
              <p className={styles.reviewSubAmount}>$270,005.44</p>
            </div>
          </div>

          <div className={styles.timelineSection}>
            <div className={styles.timelineRail} />
            {timelineItems.map((item) => (
              <div className={styles.timelineRow} key={item.label}>
                <span
                  className={`${styles.timelineDot} ${
                    item.last ? styles.timelineDotSolid : ""
                  }`}
                />
                <span className={styles.timelineLabel}>{item.label}</span>
                <span
                  className={`${styles.timelineValue} ${
                    item.accent === "green" ? styles.timelineValueGreen : ""
                  }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoRow}>
              <span>Liquidity provider</span>
              <span className={styles.providerValue}>
                <ProtocolIcon />
                0x Protocol
              </span>
            </div>
            <div className={styles.infoRow}>
              <span>Rate</span>
              <span className={styles.rateValue}>
                <SwapHorizontalIcon />
                1 ETH = 1562.76 MATIC ($12.64)
              </span>
            </div>
            <div className={styles.infoRow}>
              <span>Price impact</span>
              <span>-0.47%</span>
            </div>
          </div>

          <div className={styles.bottomCtaWrap}>
            <button
              className={`${styles.primaryCta} ${styles.primaryCtaReady}`}
              onClick={() => {
                setPendingSeconds(PENDING_SECONDS);
                setPendingProgress(1);
                setScene("pending");
              }}
              type="button"
            >
              Place Order
            </button>
          </div>
        </section>

        <section
          aria-hidden={scene !== "pending"}
          className={`${styles.scene} ${
            scene === "pending" ? styles.sceneActive : styles.sceneHidden
          }`}
        >
          <div className={styles.pendingStage}>
            <div className={styles.timerWrap}>
              <svg aria-hidden="true" className={styles.timerSvg} viewBox="0 0 240 240">
                <circle className={styles.timerTrack} cx="120" cy="120" r="108" />
                <circle
                  className={styles.timerProgress}
                  cx="120"
                  cy="120"
                  r="108"
                  style={{ strokeDashoffset: strokeOffset } as CSSProperties}
                />
              </svg>
              <div className={styles.timerCopy}>
                <p>Time left</p>
                <strong>{formatPending(pendingSeconds)}</strong>
              </div>
            </div>

            <div className={styles.pendingCopy}>
              <h3>Transaction pending...</h3>
            </div>
          </div>

          <div className={styles.bottomCtaWrap}>
            <button className={`${styles.primaryCta} ${styles.primaryCtaIdle}`} type="button">
              See Details
            </button>
          </div>
        </section>

        <section
          aria-hidden={scene !== "success"}
          className={`${styles.scene} ${
            scene === "success" ? styles.sceneActive : styles.sceneHidden
          }`}
        >
          <div className={successStyles.successScene}>
            <div className={successStyles.successGlow} />
            <div aria-hidden="true" className={successStyles.confettiField}>
              {confettiPieces.map((piece) => (
                <span
                  className={`${successStyles.confettiPiece} ${
                    scene === "success" ? "" : successStyles.confettiPaused
                  }`}
                  key={`${piece.left}-${piece.delay}`}
                  style={
                    {
                      background: piece.color,
                      animationDelay: piece.delay,
                      animationDuration: piece.duration,
                      borderRadius: piece.shape,
                      height: piece.size,
                      left: piece.left,
                      transform: `rotate(${piece.rotate})`,
                      width: piece.size,
                    } as CSSProperties
                  }
                />
              ))}
            </div>

            <div className={successStyles.successBadge}>
              <CheckIcon />
            </div>

            <div className={successStyles.successText}>
              <h3>Transaction completed!</h3>
              <p className={successStyles.swapSummary}>
                <span className={successStyles.summaryToken}>
                  <PolygonIcon compact />
                  12,321 MATIC
                </span>
                <span className={successStyles.summaryConnector}>to</span>
                <span className={successStyles.summaryToken}>
                  <EthereumIcon compact />
                  15,424 ETH
                </span>
              </p>
              <p className={successStyles.providerCaption}>Swapped Via 0x Protocol</p>
            </div>

            <div className={successStyles.successActions}>
              <button className={styles.secondaryCta} type="button">
                See Details
              </button>
              <button
                className={`${styles.primaryCta} ${styles.primaryCtaReady} ${successStyles.successPrimary}`}
                onClick={() => {
                  setTypedAmount("0.00");
                  setReceiveAmount("0.00");
                  setQuoteReady(false);
                  setQuoteSeconds(REVIEW_SECONDS);
                  setPendingSeconds(PENDING_SECONDS);
                  setPendingProgress(1);
                  setScene("form");
                }}
                type="button"
              >
                New Trade
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
