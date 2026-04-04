"use client";

import { useEffect, useRef, useState } from "react";
import {
  type TransactionToastStage,
  TransactionToast,
} from "@/components/TransactionToast";
import ComponentShell from "@/components/ComponentShell";
import { Copy, Info } from "lucide-react";

const CODE_CONTENT = `https://github.com/anthropics/Proteus/blob/main/src/app/transactions/page.tsx`;

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
