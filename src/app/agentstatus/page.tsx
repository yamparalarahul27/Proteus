"use client";

import ComponentShell from "@/components/ComponentShell";
import {
  AgentControlCardsPanel,
  AgentThinkingStagesPanel,
} from "@/components/AgentStatusPanels";

const CODE_CONTENT = `https://github.com/anthropics/Proteus/blob/main/src/app/agentstatus/page.tsx`;

const PROMPT_CONTENT = `Create two coordinated status components in a minimal grayscale system UI style: (1) a horizontal agent-thinking stage list with dotted progress bars and right-aligned percentages, and (2) compact control cards for vesting, volume, and agent temperature with pixel-style labels and soft rounded gray surfaces.`;

export default function AgentStatusPage() {
  return (
    <ComponentShell
      title="Agent Status Components"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="w-full max-w-6xl space-y-6 sm:space-y-7">
        <AgentThinkingStagesPanel />
        <div className="flex justify-start">
          <AgentControlCardsPanel />
        </div>
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
