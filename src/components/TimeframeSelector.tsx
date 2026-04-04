"use client";

import { cn } from "@/lib/utils";

export const timeframeOptions = ["24H", "7D", "30D", "90D", "1Y"] as const;
export type TimeframeValue = (typeof timeframeOptions)[number];

type TimeframeSelectorProps = {
  label?: string;
  value: TimeframeValue;
  onChange: (value: TimeframeValue) => void;
  className?: string;
};

export default function TimeframeSelector({
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
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />

        {timeframeOptions.map((option) => {
          const isActive = option === value;

          return (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Set timeframe to ${option}`}
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
