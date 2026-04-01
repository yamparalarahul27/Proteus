"use client";

import { useState } from "react";
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
    </ComponentShell>
  );
}
