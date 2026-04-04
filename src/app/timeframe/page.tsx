"use client";

import { useState } from "react";
import ComponentShell from "@/components/ComponentShell";
import TimeframeSelector, { type TimeframeValue } from "@/components/TimeframeSelector";

const CODE_CONTENT = `https://github.com/anthropics/Proteus/blob/main/src/app/timeframe/page.tsx`;

const PROMPT_CONTENT = `Create a segmented Timeframe selector with options 24H, 7D, 30D, 90D, and 1Y. Use a rounded gray pill container with an elevated white active segment and neutral medium-gray text, matching the provided visual reference exactly.`;

export default function TimeframePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeValue>("1Y");

  return (
    <ComponentShell
      title="Timeframe Selector"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="w-full max-w-[560px] rounded-[26px] bg-[#e9e9eb] p-7 sm:p-8">
        <TimeframeSelector
          label="Timeframe"
          value={selectedTimeframe}
          onChange={setSelectedTimeframe}
        />
      </div>
    </ComponentShell>
  );
}
