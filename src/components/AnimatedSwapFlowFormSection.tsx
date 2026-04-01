import type { ReactNode } from "react";
import {
  assetOptions,
  defaultSlippageOptions,
  timeInForceOptions,
  type AssetOption,
  type FormMode,
} from "./AnimatedSwapFlow.constants";
import {
  ChevronDownIcon,
  GearIcon,
  InfoIcon,
  PolygonIcon,
  SwapDirectionIcon,
  TetherIcon,
  EthereumIcon,
} from "./AnimatedSwapFlowIcons";
import styles from "./AnimatedSwapFlow.module.css";
import formStyles from "./AnimatedSwapFlowForm.module.css";

export type AssetTarget = "pay" | "receive";

export function AssetGlyph({ asset, compact = false }: { asset: AssetOption; compact?: boolean }) {
  if (asset.icon === "polygon") {
    return <PolygonIcon compact={compact} />;
  }

  if (asset.icon === "ethereum") {
    return <EthereumIcon compact={compact} />;
  }

  return <TetherIcon compact={compact} />;
}

function BadgeButton({
  icon,
  isOpen,
  label,
  onClick,
  tone,
}: {
  icon: ReactNode;
  isOpen: boolean;
  label: string;
  onClick: () => void;
  tone: "mint" | "lavender" | "slate";
}) {
  return (
    <button
      aria-expanded={isOpen}
      className={`${styles.tokenButton} ${
        tone === "mint"
          ? styles.tokenMint
          : tone === "lavender"
            ? styles.tokenLavender
            : styles.tokenSlate
      }`}
      onClick={onClick}
      type="button"
    >
      <span className={styles.tokenIconWrap}>{icon}</span>
      <span>{label}</span>
      <ChevronDownIcon />
    </button>
  );
}

function AssetMenu({
  isOpen,
  onSelect,
}: {
  isOpen: boolean;
  onSelect: (asset: AssetOption) => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={formStyles.assetMenu}>
      {assetOptions.map((asset) => (
        <button
          className={formStyles.assetOption}
          key={asset.symbol}
          onClick={() => onSelect(asset)}
          type="button"
        >
          <span className={formStyles.assetInfo}>
            <AssetGlyph asset={asset} compact />
            <span className={formStyles.assetLabel}>
              <strong>{asset.symbol}</strong>
              <span className={formStyles.assetName}>{asset.name}</span>
            </span>
          </span>
          <span className={styles.balanceText}>{asset.balance}</span>
        </button>
      ))}
    </div>
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
  amount,
  balance,
  children,
  label,
  menu,
  onAmountChange,
  pill,
  placeholder,
}: {
  amount: string;
  balance: string;
  children?: ReactNode;
  label: string;
  menu?: ReactNode;
  onAmountChange: (value: string) => void;
  pill: ReactNode;
  placeholder?: boolean;
}) {
  const measuredValue = amount || (placeholder ? "0.00" : "0");

  return (
    <div className={styles.formBlock}>
      <div className={styles.rowBetween}>
        <h3 className={styles.sectionLabel}>{label}</h3>
        <p className={styles.balanceText}>Balance: {balance}</p>
      </div>

      <div className={`${styles.rowBetween} ${formStyles.assetRow}`}>
        {pill}
        {children}
      </div>

      <div className={`${styles.amountRow} ${placeholder ? styles.placeholderAmount : ""}`}>
        <input
          className={formStyles.amountInput}
          inputMode="decimal"
          onChange={(event) => onAmountChange(event.target.value)}
          placeholder={placeholder ? "0.00" : "Enter amount"}
          size={Math.max(measuredValue.length, 1)}
          type="text"
          value={amount}
        />
      </div>

      {menu}
    </div>
  );
}

type FormSectionProps = {
  assetMenuTarget: AssetTarget | null;
  formMode: FormMode;
  isActive: boolean;
  limitPrice: string;
  mevProtection: boolean;
  payAsset: AssetOption;
  quoteReady: boolean;
  receiveAsset: AssetOption;
  receiveAmount: string;
  settingsOpen: boolean;
  slippage: (typeof defaultSlippageOptions)[number];
  timeInForce: (typeof timeInForceOptions)[number];
  timeInForceOpen: boolean;
  transactionType: string;
  transactionTypeOpen: boolean;
  transactionTypeOptions: readonly string[];
  typedAmount: string;
  onAssetMenuToggle: (target: AssetTarget) => void;
  onAssetSelect: (target: AssetTarget, asset: AssetOption) => void;
  onFillHalf: () => void;
  onFillMax: () => void;
  onFillQuarter: () => void;
  onFormModeChange: (mode: FormMode) => void;
  onLimitPriceChange: (value: string) => void;
  onMevProtectionToggle: () => void;
  onPayAmountChange: (value: string) => void;
  onReceiveAmountChange: (value: string) => void;
  onReview: () => void;
  onSettingsToggle: () => void;
  onSlippageChange: (option: (typeof defaultSlippageOptions)[number]) => void;
  onSwapDirection: () => void;
  onTimeInForceSelect: (option: (typeof timeInForceOptions)[number]) => void;
  onTimeInForceToggle: () => void;
  onTransactionTypeSelect: (option: string) => void;
  onTransactionTypeToggle: () => void;
  onUseMidPrice: () => void;
};

export function FormSection({
  assetMenuTarget,
  formMode,
  isActive,
  limitPrice,
  mevProtection,
  onAssetMenuToggle,
  onAssetSelect,
  onFillHalf,
  onFillMax,
  onFillQuarter,
  onFormModeChange,
  onLimitPriceChange,
  onMevProtectionToggle,
  onPayAmountChange,
  onReceiveAmountChange,
  onReview,
  onSettingsToggle,
  onSlippageChange,
  onSwapDirection,
  onTimeInForceSelect,
  onTimeInForceToggle,
  onTransactionTypeSelect,
  onTransactionTypeToggle,
  onUseMidPrice,
  payAsset,
  quoteReady,
  receiveAmount,
  receiveAsset,
  settingsOpen,
  slippage,
  timeInForce,
  timeInForceOpen,
  transactionType,
  transactionTypeOpen,
  transactionTypeOptions,
  typedAmount,
}: FormSectionProps) {
  return (
    <section
      aria-hidden={!isActive}
      data-scene="form"
      className={`${styles.scene} ${isActive ? styles.sceneActive : styles.sceneHidden}`}
    >
      <div className={styles.topBar}>
        <div className={styles.tabRow}>
          <button
            className={`${styles.tab} ${formMode === "market" ? styles.tabActive : ""}`}
            onClick={() => onFormModeChange("market")}
            type="button"
          >
            Market
          </button>
          <button
            className={`${styles.tab} ${formMode === "limit" ? styles.tabActive : ""}`}
            onClick={() => onFormModeChange("limit")}
            type="button"
          >
            Limit
          </button>
        </div>

        <div className={formStyles.settingsWrap}>
          <button
            aria-expanded={settingsOpen}
            aria-label="Settings"
            className={styles.iconButton}
            onClick={onSettingsToggle}
            type="button"
          >
            <GearIcon />
          </button>

          {settingsOpen ? (
            <div className={formStyles.settingsMenu}>
              <p className={formStyles.menuCaption}>Slippage tolerance</p>
              <div className={formStyles.menuValue}>
                {defaultSlippageOptions.map((option) => (
                  <button
                    className={`${formStyles.valueChip} ${
                      slippage === option ? formStyles.valueChipActive : ""
                    }`}
                    key={option}
                    onClick={() => onSlippageChange(option)}
                    type="button"
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className={formStyles.menuRow}>
                <span>MEV Protection</span>
                <button
                  aria-pressed={mevProtection}
                  className={`${formStyles.toggle} ${
                    mevProtection ? formStyles.toggleActive : ""
                  }`}
                  onClick={onMevProtectionToggle}
                  type="button"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.divider} />

      <FormLine
        amount={typedAmount}
        balance={payAsset.balance}
        label="Pay with"
        onAmountChange={onPayAmountChange}
        pill={
          <div className={formStyles.assetSelectWrap}>
            <BadgeButton
              icon={<AssetGlyph asset={payAsset} />}
              isOpen={assetMenuTarget === "pay"}
              label={payAsset.symbol}
              onClick={() => onAssetMenuToggle("pay")}
              tone={payAsset.tone}
            />
            <AssetMenu
              isOpen={assetMenuTarget === "pay"}
              onSelect={(asset) => onAssetSelect("pay", asset)}
            />
          </div>
        }
        placeholder={!quoteReady}
      >
        <div className={styles.quickPills}>
          {formMode === "market" ? (
            <>
              <Pill onClick={onFillMax}>MAX</Pill>
              <Pill onClick={onFillHalf}>50%</Pill>
              <Pill onClick={onFillQuarter}>25%</Pill>
            </>
          ) : (
            <Pill onClick={onUseMidPrice}>Use Mid Price</Pill>
          )}
        </div>
      </FormLine>

      <div className={styles.midSwapButton}>
        <button
          aria-label="Swap direction"
          className={styles.swapButton}
          onClick={onSwapDirection}
          type="button"
        >
          <SwapDirectionIcon />
        </button>
      </div>

      <div className={styles.divider} />

      <FormLine
        amount={receiveAmount}
        balance={receiveAsset.balance}
        label="You receive"
        onAmountChange={onReceiveAmountChange}
        pill={
          <div className={formStyles.assetSelectWrap}>
            <BadgeButton
              icon={<AssetGlyph asset={receiveAsset} />}
              isOpen={assetMenuTarget === "receive"}
              label={receiveAsset.symbol}
              onClick={() => onAssetMenuToggle("receive")}
              tone={receiveAsset.tone}
            />
            <AssetMenu
              isOpen={assetMenuTarget === "receive"}
              onSelect={(asset) => onAssetSelect("receive", asset)}
            />
          </div>
        }
        placeholder={!quoteReady}
      />

      <div className={`${styles.quoteMeta} ${quoteReady ? styles.quoteMetaVisible : ""}`}>
        <div className={styles.metaRow}>
          <span>Transaction type</span>
          <div className={formStyles.txTypeWrap}>
            <button
              className={`${styles.metaValue} ${formStyles.dropdownTrigger}`}
              onClick={onTransactionTypeToggle}
              type="button"
            >
              {transactionType}
              <ChevronDownIcon />
            </button>

            {transactionTypeOpen ? (
              <div className={formStyles.txTypeMenu}>
                {transactionTypeOptions.map((option) => (
                  <button
                    className={formStyles.menuOption}
                    key={option}
                    onClick={() => onTransactionTypeSelect(option)}
                    type="button"
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.metaRow}>
          <span className={styles.metaLabelWithIcon}>
            Fee (included)
            <InfoIcon />
          </span>
          <span className={styles.metaFeeValue}>
            <TetherIcon compact />
            {formMode === "market" ? "22.45 USDT ($22.43)" : "Limit maker fee 0.02%"}
          </span>
        </div>
      </div>

      {formMode === "limit" ? (
        <div className={formStyles.limitPanel}>
          <div className={styles.metaRow}>
            <span>Limit price</span>
            <span className={styles.metaValue}>
              <input
                className={formStyles.limitPriceInput}
                inputMode="decimal"
                onChange={(event) => onLimitPriceChange(event.target.value)}
                type="text"
                value={limitPrice}
              />
              <span>
                {payAsset.symbol} / {receiveAsset.symbol}
              </span>
            </span>
          </div>

          <div className={styles.metaRow}>
            <span>Time in force</span>
            <div className={formStyles.timeInForceWrap}>
              <button
                className={`${styles.metaValue} ${formStyles.dropdownTrigger}`}
                onClick={onTimeInForceToggle}
                type="button"
              >
                {timeInForce}
                <ChevronDownIcon />
              </button>

              {timeInForceOpen ? (
                <div className={formStyles.timeInForceMenu}>
                  {timeInForceOptions.map((option) => (
                    <button
                      className={formStyles.menuOption}
                      key={option}
                      onClick={() => onTimeInForceSelect(option)}
                      type="button"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className={styles.bottomCtaWrap}>
        <button
          className={`${styles.primaryCta} ${
            quoteReady ? styles.primaryCtaReady : styles.primaryCtaIdle
          }`}
          disabled={!quoteReady}
          onClick={onReview}
          type="button"
        >
          {formMode === "market" ? "Review order" : "Review limit order"}
        </button>
      </div>
    </section>
  );
}
