"use client";

import { useState } from "react";
import ComponentShell from "@/components/ComponentShell";
import TimeframeSelector, { type TimeframeValue } from "@/components/TimeframeSelector";

const CODE_CONTENT = `"use client";

import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const timeframeOptions = ["24H", "7D", "30D", "90D", "1Y"] as const;
type TimeframeValue = (typeof timeframeOptions)[number];

type TimeframeSelectorProps = {
  label?: string;
  value: TimeframeValue;
  onChange: (value: TimeframeValue) => void;
  className?: string;
};

function TimeframeSelector({
  label = "Timeframe",
  value,
  onChange,
  className,
}: TimeframeSelectorProps) {
  const activeIndex = Math.max(0, timeframeOptions.indexOf(value));

  return (
    <div className={cn("w-full max-w-[460px]", className)}>
      <p className="mb-4 text-[38px] font-medium leading-none text-[#66666B]">
        {label}
      </p>

      <div
        className="relative grid grid-cols-5 rounded-[36px] border border-[#c5c5cb] bg-[#e5e5ea] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]"
        role="tablist"
        aria-label={label}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1.5 left-1.5 top-1.5 w-[calc((100%-12px)/5)] rounded-[30px] border border-[#c4c4c8] bg-[#f4f4f5] shadow-[0_1px_2px_rgba(0,0,0,0.15),0_3px_8px_rgba(0,0,0,0.08)] transition-transform duration-200 ease-out"
          style={{ transform: \\\`translateX(\\\${activeIndex * 100}%)\\\` }}
        />

        {timeframeOptions.map((option) => {
          const isActive = option === value;

          return (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={\\\`Set timeframe to \\\${option}\\\`}
              onClick={() => onChange(option)}
              className={cn(
                "relative z-10 h-[64px] rounded-[30px] text-[40px] leading-none transition-colors duration-200",
                isActive ? "font-medium text-[#1f1f22]" : "font-normal text-[#4a4a50]",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function TimeframePage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeValue>("1Y");

  return (
    <div className="w-full max-w-[560px] rounded-[26px] bg-[#e9e9eb] p-7 sm:p-8">
      <TimeframeSelector
        label="Timeframe"
        value={selectedTimeframe}
        onChange={setSelectedTimeframe}
      />
    </div>
  );
}`;

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
