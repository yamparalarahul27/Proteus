"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TransactionToast,
  type TransactionToastStage,
} from "@/components/TransactionToast";
import { cn } from "@/lib/utils";
import ComponentShell from "@/components/ComponentShell";

const CODE_CONTENT = `// TransactionToast component with stage selector
// See @/components/TransactionToast for full implementation`;

const PROMPT_CONTENT = `Create a transaction toast notification component that animates between different stages: processing, failed, success focus, and success settled. Include a pill-shaped stage selector bar to toggle between states.`;

const stageOptions: { label: string; value: TransactionToastStage }[] = [
  { label: "Processing", value: "processing" },
  { label: "Failed", value: "failed" },
  { label: "Success Focus", value: "successFocus" },
  { label: "Success Settled", value: "successSettled" },
];

export default function TransactionsPage() {
  const [stage, setStage] = useState<TransactionToastStage>("processing");

  return (
    <ComponentShell title="Transaction Toast" codeContent={CODE_CONTENT} promptContent={PROMPT_CONTENT}>
      <div className="mx-auto flex w-full max-w-2xl items-center justify-center">
        <section className="w-full rounded-[24px] border border-white/70 bg-white/90 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold tracking-[0.16em] text-[#6b7280] uppercase">
                Deposit Modal
              </p>
              <h1 className="mt-1 text-[20px] font-semibold text-[#111827] sm:text-[22px]">
                Deposit Status Animation
              </h1>
            </div>
            <Link
              className="rounded-full border border-[#e5e7eb] bg-white px-3 py-1.5 text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#f9fafb]"
              href="/"
            >
              Close
            </Link>
          </div>

          <div className="flex justify-center">
            <TransactionToast stage={stage} />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/90 bg-white px-2 py-2 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
            {stageOptions.map((option) => {
              const active = option.value === stage;

              return (
                <button
                  aria-pressed={active}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-[#20242d] text-white"
                      : "bg-transparent text-[#5f6673] hover:bg-[#f3f4f6]",
                  )}
                  key={option.value}
                  onClick={() => setStage(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </ComponentShell>
  );
}
