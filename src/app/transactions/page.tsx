"use client";

import { useEffect, useRef, useState } from "react";
import {
  type TransactionToastStage,
  TransactionToast,
} from "@/components/TransactionToast";
import ComponentShell from "@/components/ComponentShell";
import { Copy, Info } from "lucide-react";

const CODE_CONTENT = `"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Info } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TransactionToastStage =
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

function TransactionToast({
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

export default function TransactionsPage() {
  const [stage, setStage] = useState<TransactionToastStage>("processing");
  const [toastVisible, setToastVisible] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  function runDepositFlow() {
    clearTimers();
    setStage("processing");
    setToastVisible(true);
    setIsRunning(true);

    const focusTimer = window.setTimeout(() => {
      setStage("successFocus");
    }, 2000);

    const settledTimer = window.setTimeout(() => {
      setStage("successSettled");
    }, 3000);

    const dismissTimer = window.setTimeout(() => {
      setToastVisible(false);
      setIsRunning(false);
      setStage("processing");
    }, 4300);

    timersRef.current = [focusTimer, settledTimer, dismissTimer];
  }

  function resetFlow() {
    clearTimers();
    setIsRunning(false);
    setToastVisible(false);
    setStage("processing");
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl items-center justify-center">
      <section className="relative w-full overflow-hidden rounded-[26px] border border-[#e6e9ef] bg-[#f8fafd] p-5 shadow-[0_26px_60px_rgba(15,23,42,0.16)] sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
              Deposit Modal
            </p>
            <h1 className="mt-1 text-[20px] font-semibold text-[#111827] sm:text-[22px]">
              Deposit Status Animation
            </h1>
          </div>

          <button
            className="rounded-full border border-[#d7dbe3] bg-white px-3 py-1.5 text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]"
            onClick={resetFlow}
            type="button"
          >
            Reset
          </button>
        </div>

        <div className="rounded-[18px] border border-[#dbe1ea] bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:p-5">
          <div className="flex items-center gap-2 text-[22px] font-medium text-[#374151] sm:text-[24px]">
            <span>Your deposit address</span>
            <Info className="size-5 text-[#9ca3af]" />
          </div>

          <div className="mt-3 rounded-[14px] border border-[#e5e7eb] bg-[#fbfcfe] p-4 sm:p-5">
            <p className="truncate text-[14px] text-[#94a3b8] sm:text-[15px]">
              0x5b88F50aE124Db20b3d72bC5CEaFBdB08D09Ae98
            </p>
            <button
              className="mt-3 inline-flex items-center gap-2 rounded-[10px] border border-[#dce2eb] bg-white px-3 py-2 text-[13px] font-medium text-[#4b5563]"
              type="button"
            >
              <Copy className="size-4" />
              Copy address
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[14px] text-[#6b7280] sm:text-[15px]">Amount: 30.10 USDC</p>
            <button
              className="rounded-full bg-[#111827] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#0b1220] disabled:cursor-not-allowed disabled:opacity-55"
              disabled={isRunning}
              onClick={runDepositFlow}
              type="button"
            >
              {isRunning ? "Depositing..." : "Deposit"}
            </button>
          </div>
        </div>

        {toastVisible ? (
          <div className="pointer-events-none fixed left-1/2 top-3 z-50 w-[calc(100vw-1.5rem)] max-w-[400px] -translate-x-1/2 sm:left-4 sm:top-4 sm:w-[400px] sm:translate-x-0">
            <TransactionToast stage={stage} />
          </div>
        ) : null}
      </section>
    </div>
  );
}`;

const PROMPT_CONTENT = `Create a light-theme deposit toast flow:

- User clicks Deposit.
- Toast appears in "Deposit processing..." state with a circular loading indicator.
- Then transition to "Deposit completed" with a short green success splash.
- Then settle to final completed state where splash fades but green check remains.`;

export default function TransactionsPage() {
  const [stage, setStage] = useState<TransactionToastStage>("processing");
  const [toastVisible, setToastVisible] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  function runDepositFlow() {
    clearTimers();
    setStage("processing");
    setToastVisible(true);
    setIsRunning(true);

    const focusTimer = window.setTimeout(() => {
      setStage("successFocus");
    }, 2000);

    const settledTimer = window.setTimeout(() => {
      setStage("successSettled");
    }, 3000);

    const dismissTimer = window.setTimeout(() => {
      setToastVisible(false);
      setIsRunning(false);
      setStage("processing");
    }, 4300);

    timersRef.current = [focusTimer, settledTimer, dismissTimer];
  }

  function resetFlow() {
    clearTimers();
    setIsRunning(false);
    setToastVisible(false);
    setStage("processing");
  }

  return (
    <ComponentShell
      title="Transaction Toast"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="mx-auto flex w-full max-w-3xl items-center justify-center">
        <section className="relative w-full overflow-hidden rounded-[26px] border border-[#e6e9ef] bg-[#f8fafd] p-5 shadow-[0_26px_60px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-3 sm:mb-6">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#6b7280]">
                Deposit Modal
              </p>
              <h1 className="mt-1 text-[20px] font-semibold text-[#111827] sm:text-[22px]">
                Deposit Status Animation
              </h1>
            </div>

            <button
              className="rounded-full border border-[#d7dbe3] bg-white px-3 py-1.5 text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]"
              onClick={resetFlow}
              type="button"
            >
              Reset
            </button>
          </div>

          <div className="rounded-[18px] border border-[#dbe1ea] bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:p-5">
            <div className="flex items-center gap-2 text-[22px] font-medium text-[#374151] sm:text-[24px]">
              <span>Your deposit address</span>
              <Info className="size-5 text-[#9ca3af]" />
            </div>

            <div className="mt-3 rounded-[14px] border border-[#e5e7eb] bg-[#fbfcfe] p-4 sm:p-5">
              <p className="truncate text-[14px] text-[#94a3b8] sm:text-[15px]">
                0x5b88F50aE124Db20b3d72bC5CEaFBdB08D09Ae98
              </p>
              <button
                className="mt-3 inline-flex items-center gap-2 rounded-[10px] border border-[#dce2eb] bg-white px-3 py-2 text-[13px] font-medium text-[#4b5563]"
                type="button"
              >
                <Copy className="size-4" />
                Copy address
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[14px] text-[#6b7280] sm:text-[15px]">Amount: 30.10 USDC</p>
              <button
                className="rounded-full bg-[#111827] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#0b1220] disabled:cursor-not-allowed disabled:opacity-55"
                disabled={isRunning}
                onClick={runDepositFlow}
                type="button"
              >
                {isRunning ? "Depositing..." : "Deposit"}
              </button>
            </div>
          </div>

          {toastVisible ? (
            <div className="pointer-events-none fixed left-1/2 top-3 z-50 w-[calc(100vw-1.5rem)] max-w-[400px] -translate-x-1/2 sm:left-4 sm:top-4 sm:w-[400px] sm:translate-x-0">
              <TransactionToast stage={stage} />
            </div>
          ) : null}
        </section>
      </div>
    </ComponentShell>
  );
}
