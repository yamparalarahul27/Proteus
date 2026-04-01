import type { AssetOption, FormMode } from "./AnimatedSwapFlow.constants";

type NumericFormatter = {
  formatter: Intl.NumberFormat;
};

const usdFormatter: NumericFormatter = {
  formatter: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }),
};

export function sanitizeNumericInput(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [whole, ...fractionParts] = cleaned.split(".");
  const fraction = fractionParts.join("");

  if (fractionParts.length === 0) {
    return whole;
  }

  return `${whole}.${fraction}`;
}

export function toNumeric(value: string) {
  if (!value || value === ".") {
    return 0;
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

export function formatEditableAmount(value: number, decimals = 4) {
  if (!Number.isFinite(value) || value <= 0) {
    return "";
  }

  return value.toFixed(decimals).replace(/\.?0+$/, "");
}

export function formatLimitPrice(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "1.0000";
  }

  return value.toFixed(4);
}

export function formatUsd(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "$0.00";
  }

  return usdFormatter.formatter.format(value);
}

export function calculateReceiveFromPay({
  payValue,
  payAsset,
  receiveAsset,
  mode,
  limitPrice,
}: {
  payValue: number;
  payAsset: AssetOption;
  receiveAsset: AssetOption;
  mode: FormMode;
  limitPrice: number;
}) {
  if (mode === "market") {
    return payValue * (payAsset.usdPrice / receiveAsset.usdPrice);
  }

  const appliedLimitPrice =
    limitPrice > 0 ? limitPrice : payAsset.usdPrice / receiveAsset.usdPrice;

  return payValue / appliedLimitPrice;
}

export function calculatePayFromReceive({
  receiveValue,
  payAsset,
  receiveAsset,
  mode,
  limitPrice,
}: {
  receiveValue: number;
  payAsset: AssetOption;
  receiveAsset: AssetOption;
  mode: FormMode;
  limitPrice: number;
}) {
  if (mode === "market") {
    return receiveValue * (receiveAsset.usdPrice / payAsset.usdPrice);
  }

  const appliedLimitPrice =
    limitPrice > 0 ? limitPrice : payAsset.usdPrice / receiveAsset.usdPrice;

  return receiveValue * appliedLimitPrice;
}
