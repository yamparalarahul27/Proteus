import { Check, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

export type TransactionToastStage =
  | "processing"
  | "failed"
  | "successFocus"
  | "successSettled";

type TransactionToastProps = {
  className?: string;
  stage?: TransactionToastStage;
};

type StageConfig = {
  ariaLive: "assertive" | "polite";
  body: string;
  compact?: boolean;
  role: "alert" | "status";
  showSuccessAccent?: boolean;
  title: string;
  tone: "neutral" | "success";
};

const stageMap: Record<TransactionToastStage, StageConfig> = {
  failed: {
    ariaLive: "assertive",
    body: "A deposit of 30.10 POL hasn't completed. Your funds are still safe.",
    role: "alert",
    title: "Deposit didn't complete",
    tone: "neutral",
  },
  processing: {
    ariaLive: "polite",
    body: "A deposit of 30.10 POL has been registered and is awaiting confirmation.",
    role: "status",
    title: "Deposit processing...",
    tone: "neutral",
  },
  successFocus: {
    ariaLive: "polite",
    body: "A deposit of 30.10 POL has landed in your account.",
    role: "status",
    showSuccessAccent: true,
    title: "Deposit completed",
    tone: "success",
  },
  successSettled: {
    ariaLive: "polite",
    body: "A deposit of 30.10 POL has been credited to your account.",
    compact: true,
    role: "status",
    title: "Deposit completed",
    tone: "success",
  },
};

function DepositCoinIcon({ compact = false }: { compact?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-[#2f80df] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_5px_10px_rgba(47,128,223,0.2)]",
        compact ? "size-[30px]" : "size-9",
      )}
    >
      <svg
        aria-hidden="true"
        className={compact ? "size-5" : "size-6"}
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
        "relative inline-flex w-full max-w-[516px] pr-3 pt-3",
        config.compact && "max-w-[432px] pr-2.5 pt-2.5",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-[0_0_12px_26px] rounded-[23px] border border-[#e9ecf1] bg-white/70 shadow-[0_16px_26px_rgba(15,23,42,0.04),0_4px_10px_rgba(15,23,42,0.04)]",
          config.compact && "inset-[0_0_10px_20px] rounded-[20px]",
        )}
      />

      <section
        aria-live={config.ariaLive}
        className={cn(
          "relative z-10 flex w-full items-start gap-4 overflow-hidden rounded-[23px] border border-[#e8ebf0] bg-white px-[18px] py-[18px] shadow-[0_20px_30px_rgba(15,23,42,0.07),0_6px_14px_rgba(15,23,42,0.05)]",
          config.compact && "gap-3.5 rounded-[20px] px-[18px] py-4",
        )}
        role={config.role}
      >
        {config.showSuccessAccent ? (
          <div
            aria-hidden="true"
            className="absolute inset-y-[10px] left-[10px] w-32 rounded-[18px] bg-[#ddf5b3]/80 sm:w-32"
          />
        ) : null}

        <div
          className={cn(
            "relative z-10 inline-flex size-11 shrink-0 items-center justify-center",
            config.compact && "size-9",
          )}
        >
          <DepositCoinIcon compact={config.compact} />
          <span
            aria-hidden="true"
            className={cn(
              "absolute bottom-[-1px] right-[-2px] inline-flex size-[19px] items-center justify-center rounded-full border-2 border-white bg-[#5f6368] text-white shadow-[0_4px_10px_rgba(15,23,42,0.16)]",
              config.compact && "size-[17px]",
              config.tone === "success" && "bg-[#76d01a]",
            )}
          >
            {config.tone === "success" ? (
              <Check size={11} strokeWidth={3} />
            ) : (
              <Clock3 size={10} strokeWidth={2.4} />
            )}
          </span>
        </div>

        <div className="relative z-10 min-w-0 flex-1">
          <p
            className={cn(
              "m-0 text-[15px] leading-[1.25] font-semibold text-[#1d2432]",
              config.compact && "text-xs leading-[1.2]",
            )}
          >
            {config.title}
          </p>
          <p
            className={cn(
              "mt-1.5 max-w-[28ch] text-sm leading-[1.33] text-[#6f7684] text-pretty",
              config.compact && "mt-1 max-w-[31ch] text-xs leading-[1.28]",
            )}
          >
            {config.body}
          </p>
        </div>
      </section>
    </div>
  );
}
