"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowUpDown,
  BadgeInfo,
  Check,
  ChevronDown,
  ChevronRight,
  Settings2,
} from "lucide-react";
import styles from "./AnimatedSwapFlow.module.css";

type Scene = "form" | "review" | "pending" | "success";

type TimelineItem = {
  label: string;
  value: string;
  accent?: "green";
  last?: boolean;
};

type ConfettiPiece = {
  color: string;
  delay: string;
  duration: string;
  left: string;
  rotate: string;
  size: string;
  shape: string;
};

const FORM_AMOUNT = 253;
const RECEIVE_AMOUNT = 456.26;
const PENDING_SECONDS = 4;
const REVIEW_SECONDS = 20;
const PROGRESS_CIRCUMFERENCE = 678.58;

const timelineItems: TimelineItem[] = [
  { label: "Network fee", value: "Free", accent: "green" },
  { label: "Gas reimbursement", value: "20.45 USDT ($20.43)" },
  { label: "Matcha fee 0.1%", value: "2.45 USDT ($2.43)" },
  { label: "Amount we convert", value: "236 USDT" },
  { label: "You will receive exactly", value: "236 MATIC", last: true },
];

const confettiPieces: ConfettiPiece[] = [
  {
    color: "#ffcab0",
    delay: "0.05s",
    duration: "4.6s",
    left: "6%",
    rotate: "-8deg",
    size: "10px",
    shape: "50%",
  },
  {
    color: "#f6d582",
    delay: "0.3s",
    duration: "3.8s",
    left: "15%",
    rotate: "22deg",
    size: "8px",
    shape: "2px",
  },
  {
    color: "#b8d8ff",
    delay: "0.55s",
    duration: "4.9s",
    left: "24%",
    rotate: "-12deg",
    size: "11px",
    shape: "50%",
  },
  {
    color: "#ffd3de",
    delay: "0.15s",
    duration: "4.2s",
    left: "32%",
    rotate: "18deg",
    size: "10px",
    shape: "2px",
  },
  {
    color: "#d6f2ce",
    delay: "0.9s",
    duration: "3.6s",
    left: "40%",
    rotate: "9deg",
    size: "9px",
    shape: "50%",
  },
  {
    color: "#ffddb0",
    delay: "0.45s",
    duration: "4.5s",
    left: "48%",
    rotate: "-18deg",
    size: "14px",
    shape: "2px",
  },
  {
    color: "#c7dbff",
    delay: "0.1s",
    duration: "5.2s",
    left: "58%",
    rotate: "15deg",
    size: "8px",
    shape: "50%",
  },
  {
    color: "#ffe2a7",
    delay: "0.8s",
    duration: "4.3s",
    left: "66%",
    rotate: "-7deg",
    size: "12px",
    shape: "2px",
  },
  {
    color: "#ffd1d1",
    delay: "0.25s",
    duration: "3.9s",
    left: "76%",
    rotate: "28deg",
    size: "9px",
    shape: "50%",
  },
  {
    color: "#bdeaf4",
    delay: "0.65s",
    duration: "4.7s",
    left: "86%",
    rotate: "-25deg",
    size: "7px",
    shape: "2px",
  },
  {
    color: "#f9ce98",
    delay: "1.1s",
    duration: "4.1s",
    left: "93%",
    rotate: "14deg",
    size: "15px",
    shape: "2px",
  },
];

function formatPending(seconds: number) {
  return `00:0${seconds}`;
}

function easeOutExpo(progress: number) {
  return progress === 1 ? 1 : 1 - 2 ** (-10 * progress);
}

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
        <span className={styles.cursor} aria-hidden="true" />
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

  useEffect(() => {
    return clearScheduledWork;
  }, []);

  const strokeOffset = PROGRESS_CIRCUMFERENCE * (1 - pendingProgress);

  return (
    <div className={styles.shell}>
      <div className={styles.frame}>
        <section
          className={`${styles.scene} ${
            scene === "form" ? styles.sceneActive : styles.sceneHidden
          }`}
          aria-hidden={scene !== "form"}
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
            label="Pay with"
            balance="1.464"
            amount={typedAmount}
            placeholder={!quoteReady}
            pill={<BadgeButton icon={<TetherIcon />} label="USDT" tone="mint" />}
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
            label="You receive"
            balance="42.4"
            amount={receiveAmount}
            placeholder={!quoteReady}
            pill={<BadgeButton icon={<PolygonIcon />} label="MATIC" tone="lavender" />}
          />

          <div
            className={`${styles.quoteMeta} ${
              quoteReady ? styles.quoteMetaVisible : ""
            }`}
          >
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
          className={`${styles.scene} ${
            scene === "review" ? styles.sceneActive : styles.sceneHidden
          }`}
          aria-hidden={scene !== "review"}
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
          className={`${styles.scene} ${
            scene === "pending" ? styles.sceneActive : styles.sceneHidden
          }`}
          aria-hidden={scene !== "pending"}
        >
          <div className={styles.pendingStage}>
            <div className={styles.timerWrap}>
              <svg className={styles.timerSvg} viewBox="0 0 240 240" aria-hidden="true">
                <circle
                  className={styles.timerTrack}
                  cx="120"
                  cy="120"
                  r="108"
                />
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
          className={`${styles.scene} ${
            scene === "success" ? styles.sceneActive : styles.sceneHidden
          }`}
          aria-hidden={scene !== "success"}
        >
          <div className={styles.successScene}>
            <div className={styles.successGlow} />
            <div className={styles.confettiField} aria-hidden="true">
              {confettiPieces.map((piece) => (
                <span
                  className={styles.confettiPiece}
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

            <div className={styles.successBadge}>
              <CheckIcon />
            </div>

            <div className={styles.successText}>
              <h3>Transaction completed!</h3>
              <p className={styles.swapSummary}>
                <span className={styles.summaryToken}>
                  <PolygonIcon compact />
                  12,321 MATIC
                </span>
                <span className={styles.summaryConnector}>to</span>
                <span className={styles.summaryToken}>
                  <EthereumIcon compact />
                  15,424 ETH
                </span>
              </p>
              <p className={styles.providerCaption}>Swapped Via 0x Protocol</p>
            </div>

            <div className={styles.successActions}>
              <button className={`${styles.secondaryCta}`} type="button">
                See Details
              </button>
              <button
                className={`${styles.primaryCta} ${styles.primaryCtaReady} ${styles.successPrimary}`}
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

function GearIcon() {
  return <Settings2 size={18} strokeWidth={2} />;
}

function ChevronDownIcon() {
  return <ChevronDown size={16} strokeWidth={2.25} />;
}

function SwapDirectionIcon() {
  return <ArrowUpDown size={18} strokeWidth={2.1} />;
}

function BackArrowIcon() {
  return <ArrowLeft size={20} strokeWidth={2.2} />;
}

function ForwardArrowIcon() {
  return <ChevronRight size={22} strokeWidth={2.25} />;
}

function InfoIcon() {
  return <BadgeInfo size={14} strokeWidth={2} />;
}

function CheckIcon() {
  return <Check color="#00b67a" size={42} strokeWidth={2.8} />;
}

function TetherIcon({ compact = false }: { compact?: boolean }) {
  const size = compact ? 14 : 22;

  return (
    <svg
      fill="none"
      height={size}
      viewBox="0 0 32 32"
      width={size}
    >
      <circle cx="16" cy="16" fill="#32c48d" stroke="#23a16f" strokeWidth="1.6" r="14" />
      <path
        d="M8.5 10.4h15M16 10.4v12.2M11.5 14.7c2.6 1 6.4 1 9 0"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function PolygonIcon({
  big = false,
  compact = false,
}: {
  big?: boolean;
  compact?: boolean;
}) {
  const size = big ? 48 : compact ? 14 : 22;

  return (
    <svg fill="none" height={size} viewBox="0 0 32 32" width={size}>
      <defs>
        <linearGradient id="polygon-gradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#7b5cff" />
          <stop offset="100%" stopColor="#9d4ff0" />
        </linearGradient>
      </defs>
      <circle
        cx="16"
        cy="16"
        fill="url(#polygon-gradient)"
        stroke="#7047e6"
        strokeWidth="1.6"
        r="14"
      />
      <path
        d="m12 11.1-4 2.3v5.2l4 2.3 3.9-2.3v-4.8l4.1-2.3 3.9 2.3v5.2l-3.9 2.3-4.1-2.3"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}

function EthereumIcon({
  big = false,
  compact = false,
}: {
  big?: boolean;
  compact?: boolean;
}) {
  const size = big ? 48 : compact ? 14 : 22;

  return (
    <svg fill="none" height={size} viewBox="0 0 32 32" width={size}>
      <defs>
        <linearGradient id="eth-gradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#89a5ff" />
          <stop offset="100%" stopColor="#4b70f0" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" fill="url(#eth-gradient)" stroke="#6b82eb" strokeWidth="1.4" r="14" />
      <path
        d="m16 5.6 6 10.2-6-3.5-6 3.5L16 5.6Zm0 20.8-6-9 6 3.6 6-3.6-6 9Z"
        fill="white"
      />
    </svg>
  );
}

function ProtocolIcon() {
  return (
    <svg fill="none" height="20" viewBox="0 0 28 28" width="20">
      <rect fill="#12131a" height="28" rx="14" width="28" />
      <path
        d="M14 7.2 18.8 10v8L14 20.8 9.2 18v-8L14 7.2Zm0 0v13.6M9.2 10 18.8 18M18.8 10 9.2 18"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function SwapHorizontalIcon() {
  return <ArrowLeftRight size={16} strokeWidth={2.1} />;
}
