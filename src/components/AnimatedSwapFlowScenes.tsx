import type { CSSProperties } from "react";
import {
  confettiPieces,
  formatPending,
  timelineItems,
  type AssetOption,
  type FormMode,
} from "./AnimatedSwapFlow.constants";
import {
  BackArrowIcon,
  CheckIcon,
  ForwardArrowIcon,
  ProtocolIcon,
  SwapHorizontalIcon,
} from "./AnimatedSwapFlowIcons";
import { AssetGlyph } from "./AnimatedSwapFlowFormSection";
import { formatEditableAmount, formatUsd } from "./AnimatedSwapFlow.utils";
import styles from "./AnimatedSwapFlow.module.css";
import successStyles from "./AnimatedSwapFlowSuccess.module.css";

type ReviewSceneProps = {
  formMode: FormMode;
  isActive: boolean;
  payAmountNumeric: number;
  payAsset: AssetOption;
  quoteSeconds: number;
  receiveAmount: string;
  receiveAmountNumeric: number;
  receiveAsset: AssetOption;
  typedAmount: string;
  onBack: () => void;
  onPlaceOrder: () => void;
};

type PendingSceneProps = {
  isActive: boolean;
  pendingSeconds: number;
  strokeOffset: number;
};

type SuccessSceneProps = {
  isActive: boolean;
  payAsset: AssetOption;
  receiveAmount: string;
  receiveAsset: AssetOption;
  typedAmount: string;
  onNewTrade: () => void;
};

export function ReviewScene({
  formMode,
  isActive,
  onBack,
  onPlaceOrder,
  payAmountNumeric,
  payAsset,
  quoteSeconds,
  receiveAmount,
  receiveAmountNumeric,
  receiveAsset,
  typedAmount,
}: ReviewSceneProps) {
  return (
    <section
      aria-hidden={!isActive}
      data-scene="review"
      className={`${styles.scene} ${isActive ? styles.sceneActive : styles.sceneHidden}`}
    >
      <div className={styles.reviewHeader}>
        <button
          aria-label="Back"
          className={styles.iconButton}
          onClick={onBack}
          type="button"
        >
          <BackArrowIcon />
        </button>
        <p className={styles.reviewTitle}>Quote expires in {quoteSeconds}s</p>
        <span className={styles.iconSpacer} />
      </div>

      <div className={styles.quoteCardsWrap}>
        <div className={styles.reviewCard}>
          <AssetGlyph asset={payAsset} />
          <p className={styles.reviewAmount}>
            {typedAmount || "0"} {payAsset.symbol}
          </p>
          <p className={styles.reviewSubAmount}>
            {formatUsd(payAmountNumeric * payAsset.usdPrice)}
          </p>
        </div>
        <div className={styles.arrowBridge}>
          <ForwardArrowIcon />
        </div>
        <div className={styles.reviewCard}>
          <AssetGlyph asset={receiveAsset} />
          <p className={styles.reviewAmount}>
            {receiveAmount || "0"} {receiveAsset.symbol}
          </p>
          <p className={styles.reviewSubAmount}>
            {formatUsd(receiveAmountNumeric * receiveAsset.usdPrice)}
          </p>
        </div>
      </div>

      <div className={styles.timelineSection}>
        <div className={styles.timelineRail} />
        {timelineItems.map((item) => (
          <div className={styles.timelineRow} key={item.label}>
            <span
              className={`${styles.timelineDot} ${item.last ? styles.timelineDotSolid : ""}`}
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
            1 {payAsset.symbol} ={" "}
            {formatEditableAmount(
              receiveAmountNumeric / Math.max(payAmountNumeric, 1),
              4,
            ) || "0"}{" "}
            {receiveAsset.symbol}
          </span>
        </div>
        <div className={styles.infoRow}>
          <span>Price impact</span>
          <span>{formMode === "market" ? "-0.47%" : "0.00%"}</span>
        </div>
      </div>

      <div className={styles.bottomCtaWrap}>
        <button
          className={`${styles.primaryCta} ${styles.primaryCtaReady}`}
          onClick={onPlaceOrder}
          type="button"
        >
          Place Order
        </button>
      </div>
    </section>
  );
}

export function PendingScene({
  isActive,
  pendingSeconds,
  strokeOffset,
}: PendingSceneProps) {
  return (
    <section
      aria-hidden={!isActive}
      data-scene="pending"
      className={`${styles.scene} ${isActive ? styles.sceneActive : styles.sceneHidden}`}
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
  );
}

export function SuccessScene({
  isActive,
  onNewTrade,
  payAsset,
  receiveAmount,
  receiveAsset,
  typedAmount,
}: SuccessSceneProps) {
  return (
    <section
      aria-hidden={!isActive}
      data-scene="success"
      className={`${styles.scene} ${isActive ? styles.sceneActive : styles.sceneHidden}`}
    >
      <div className={successStyles.successScene}>
        <div className={successStyles.successGlow} />
        <div aria-hidden="true" className={successStyles.confettiField}>
          {confettiPieces.map((piece) => (
            <span
              className={`${successStyles.confettiPiece} ${
                isActive ? "" : successStyles.confettiPaused
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
              <AssetGlyph asset={payAsset} compact />
              {typedAmount || "0"} {payAsset.symbol}
            </span>
            <span className={successStyles.summaryConnector}>to</span>
            <span className={successStyles.summaryToken}>
              <AssetGlyph asset={receiveAsset} compact />
              {receiveAmount || "0"} {receiveAsset.symbol}
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
            onClick={onNewTrade}
            type="button"
          >
            New Trade
          </button>
        </div>
      </div>
    </section>
  );
}
