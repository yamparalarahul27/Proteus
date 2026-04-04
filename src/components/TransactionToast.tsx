import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type TransactionToastStage =
  | "processing"
  | "successFocus"
  | "successSettled";

type TransactionToastProps = {
  className?: string;
  stage?: TransactionToastStage;
};

type StageConfig = {
  ariaLive: "polite";
  body: string;
  role: "status";
  showSuccessAccent: boolean;
  title: string;
  tone: "processing" | "success";
};

const stageMap: Record<TransactionToastStage, StageConfig> = {
  processing: {
    ariaLive: "polite",
    body: "A deposit of 30.10 USDC has been registered and is awaiting confirmation.",
    role: "status",
    showSuccessAccent: false,
    title: "Deposit processing...",
    tone: "processing",
  },
  successFocus: {
    ariaLive: "polite",
    body: "A deposit of 30.10 USDC has been credited to your account.",
    role: "status",
    showSuccessAccent: true,
    title: "Deposit completed",
    tone: "success",
  },
  successSettled: {
    ariaLive: "polite",
    body: "A deposit of 30.10 USDC has been credited to your account.",
    role: "status",
    showSuccessAccent: false,
    title: "Deposit completed",
    tone: "success",
  },
};

function DepositCoinIcon() {
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex size-[48px] items-center justify-center rounded-full bg-[#3990e5] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_10px_18px_rgba(57,144,229,0.26)]"
    >
      <svg
        aria-hidden="true"
        className="size-[32px]"
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          fill="none"
          r="6.4"
          stroke="rgba(255,255,255,0.92)"
          strokeWidth="1.5"
        />
        <path
          d="M8.75 9.2C9.1 7.95 10.33 7 11.82 7c1.5 0 2.71.76 3.16 1.95"
          fill="none"
          stroke="rgba(255,255,255,0.92)"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          d="M15.22 14.78C14.8 16.03 13.54 17 12.04 17c-1.47 0-2.68-.76-3.16-1.95"
          fill="none"
          stroke="rgba(255,255,255,0.92)"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          d="M12.02 8.6v6.8"
          fill="none"
          stroke="rgba(255,255,255,0.94)"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
        <path
          d="M13.95 10.2c-.23-.58-.88-.97-1.63-.97-.97 0-1.75.56-1.75 1.27 0 .63.5.97 1.88 1.25 1.42.3 2.03.75 2.03 1.58 0 .87-.85 1.47-2 1.47-.96 0-1.77-.43-2.07-1.11"
          fill="none"
          stroke="rgba(255,255,255,0.94)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.35"
        />
      </svg>
    </span>
  );
}

export function TransactionToast({
  className,
  stage = "processing",
}: TransactionToastProps) {
  const config = stageMap[stage];

  return (
    <div
      className={cn(
        "relative w-full max-w-[400px] transition-all duration-300 ease-out",
        className,
      )}
    >
      <section
        aria-live={config.ariaLive}
        className="relative z-10 flex w-full items-start gap-3.5 overflow-hidden rounded-[20px] border border-[#d9dde4] bg-[linear-gradient(145deg,rgba(255,255,255,0.97),rgba(249,250,252,0.95))] px-4 py-4 shadow-[0_20px_48px_rgba(15,23,42,0.15)] backdrop-blur-xl sm:gap-4 sm:px-5 sm:py-4.5"
        role={config.role}
      >
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -left-6 top-1/2 h-[150px] w-[150px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(134,239,172,0.45)_0%,_rgba(134,239,172,0.16)_44%,_rgba(134,239,172,0)_78%)] blur-xl transition-opacity duration-500",
            config.showSuccessAccent ? "opacity-100" : "opacity-0",
          )}
        />

        <div className="relative z-10 inline-flex size-[52px] shrink-0 items-center justify-center">
          <DepositCoinIcon />
          <span
            aria-hidden="true"
            className={cn(
              "absolute bottom-[1px] right-[1px] inline-flex size-[27px] items-center justify-center rounded-full border-[2.5px] border-white shadow-[0_6px_14px_rgba(15,23,42,0.18)]",
              config.tone === "success"
                ? "bg-[#7ad70f] text-white"
                : "bg-[#eef0f2] text-[#7a7f87]",
            )}
          >
            {config.tone === "success" ? (
              <Check size={14} strokeWidth={3.2} />
            ) : (
              <span className="size-[13px] animate-spin rounded-full border-[2.1px] border-[#7a7f87] border-r-transparent border-b-transparent" />
            )}
          </span>
        </div>

        <div className="relative z-10 min-w-0 flex-1">
          <p className="m-0 text-[17px] font-semibold leading-[1.2] tracking-[-0.01em] text-[#1f2937] sm:text-[18px]">
            {config.title}
          </p>
          <p className="mt-1 w-full text-[14px] leading-[1.35] text-[#6b7280] sm:mt-1.5 sm:text-[15px]">
            {config.body}
          </p>
        </div>
      </section>
    </div>
  );
}
