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

export function GearIcon() {
  return <Settings2 size={18} strokeWidth={2} />;
}

export function ChevronDownIcon() {
  return <ChevronDown size={16} strokeWidth={2.25} />;
}

export function SwapDirectionIcon() {
  return <ArrowUpDown size={18} strokeWidth={2.1} />;
}

export function BackArrowIcon() {
  return <ArrowLeft size={20} strokeWidth={2.2} />;
}

export function ForwardArrowIcon() {
  return <ChevronRight size={22} strokeWidth={2.25} />;
}

export function InfoIcon() {
  return <BadgeInfo size={14} strokeWidth={2} />;
}

export function CheckIcon() {
  return <Check color="#00b67a" size={42} strokeWidth={2.8} />;
}

export function TetherIcon({ compact = false }: { compact?: boolean }) {
  const size = compact ? 14 : 22;

  return (
    <svg fill="none" height={size} viewBox="0 0 32 32" width={size}>
      <circle cx="16" cy="16" fill="#32c48d" r="14" stroke="#23a16f" strokeWidth="1.6" />
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

export function PolygonIcon({
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
        r="14"
        stroke="#7047e6"
        strokeWidth="1.6"
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

export function EthereumIcon({
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
      <circle cx="16" cy="16" fill="url(#eth-gradient)" r="14" stroke="#6b82eb" strokeWidth="1.4" />
      <path
        d="m16 5.6 6 10.2-6-3.5-6 3.5L16 5.6Zm0 20.8-6-9 6 3.6 6-3.6-6 9Z"
        fill="white"
      />
    </svg>
  );
}

export function ProtocolIcon() {
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

export function SwapHorizontalIcon() {
  return <ArrowLeftRight size={16} strokeWidth={2.1} />;
}
