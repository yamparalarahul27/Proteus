"use client";

import ComponentShell from "@/components/ComponentShell";
import TabPatternsShowcase from "@/components/TabPatternsShowcase";

const CODE_CONTENT = `https://github.com/anthropics/Proteus/blob/main/src/app/tabpatterns/page.tsx`;

const PROMPT_CONTENT = `Create a set of tab components matching these patterns: mode/persona pill tabs, segmented tabs with warning badges, primary underline tabs with icons, and small filter segmented tabs. Keep the style neutral light-gray with pixel-like uppercase labels.`;

export default function TabPatternsPage() {
  return (
    <ComponentShell
      title="Tab Patterns"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="w-full max-w-[560px] space-y-4">
        <TabPatternsShowcase />
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
