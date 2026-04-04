"use client";

import { useState } from "react";
import ComponentShell from "@/components/ComponentShell";
import {
  AgentSystemToast,
  type AgentSystemToastVariant,
} from "@/components/AgentSystemToast";
import { cn } from "@/lib/utils";

const CODE_CONTENT = `https://github.com/anthropics/Proteus/blob/main/src/app/agenttoasts/page.tsx`;

const PROMPT_CONTENT = `Build four large system toasts with exact visual style: RUN COMPLETE (green), OVERRIDE RECOMMENDATION? (amber with two actions), AGENT PAUSED (blue with single resume action), and DELETE AGENT? (red with confirmation input + delete action). Use a pixel-style heading/button font and rounded light gray containers.`;

const variants: { label: string; value: AgentSystemToastVariant }[] = [
  { label: "Run Complete", value: "runComplete" },
  { label: "Override", value: "overrideRecommendation" },
  { label: "Agent Paused", value: "agentPaused" },
  { label: "Delete Agent", value: "deleteAgent" },
];

export default function AgentToastsPage() {
  const [activeVariant, setActiveVariant] =
    useState<AgentSystemToastVariant>("runComplete");

  return (
    <ComponentShell
      title="Agent System Toasts"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="w-full max-w-6xl space-y-4">
        <div className="mb-5 flex flex-wrap items-center justify-center gap-2 sm:mb-7 sm:gap-3">
          {variants.map((variant) => (
            <button
              key={variant.value}
              type="button"
              onClick={() => setActiveVariant(variant.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-[13px] font-medium transition-colors sm:px-4.5 sm:text-[14px]",
                activeVariant === variant.value
                  ? "border-[#111827] bg-[#111827] text-white"
                  : "border-[#d2d6de] bg-white text-[#374151] hover:bg-[#f8fafc]",
              )}
            >
              {variant.label}
            </button>
          ))}
        </div>

        <AgentSystemToast variant={activeVariant} />
        <p className="text-center text-xs text-[#6b7280] sm:text-sm">
          Credit:{" "}
          <a
            href="https://30kstrategy.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#374151]"
          >
            Alex (30kstrategy)
          </a>
        </p>
      </div>
    </ComponentShell>
  );
}
