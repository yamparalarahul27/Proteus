"use client";

import { useState } from "react";
import {
  TransactionToast,
  type TransactionToastStage,
} from "@/components/TransactionToast";
import { cn } from "@/lib/utils";

const stageOptions: { label: string; value: TransactionToastStage }[] = [
  { label: "Processing", value: "processing" },
  { label: "Failed", value: "failed" },
  { label: "Success Focus", value: "successFocus" },
  { label: "Success Settled", value: "successSettled" },
];

export default function TransactionsPage() {
  const [stage, setStage] = useState<TransactionToastStage>("processing");

  return (
    <main className="min-h-dvh bg-[#e5e7eb] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-5xl flex-col items-center justify-center gap-8 sm:min-h-[calc(100dvh-5rem)]">
        <TransactionToast stage={stage} />

        <div className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/90 bg-white px-2 py-2 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
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
      </div>
    </main>
  );
}
