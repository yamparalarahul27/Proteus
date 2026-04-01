"use client";

import ComponentShell from "@/components/ComponentShell";

type MarketStat = { label: string; value: string };

const marketStats: MarketStat[] = [
  { label: "Crypto Coins", value: "21,497" },
  { label: "Need change", value: "521" },
  { label: "Market Cap", value: "$930,075,295,338" },
  { label: "24h Volume", value: "$44,125,521,243.91" },
];

const CODE_CONTENT = `https://github.com/anthropics/Proteus/blob/main/src/app/marketstatcard/page.tsx`;

const PROMPT_CONTENT = `Build a market stats card that displays key cryptocurrency market statistics. Show a vertical list of label-value pairs with labels in gray, separated by colons, and values in blue. Include stats for total crypto coins, exchanges, market cap, and 24h trading volume.`;

export default function MarketStatCardPage() {
  return (
    <ComponentShell title="Market Stats Card" codeContent={CODE_CONTENT} promptContent={PROMPT_CONTENT}>
      <div className="w-full max-w-lg">
        <div className="proteus-panel rounded-[10px] px-[18px] py-[15px]">
          <div className="space-y-[11px]">
            {marketStats.map((stat) => (
              <div
                className="flex items-center gap-3 text-[15.152px] leading-[22.728px]"
                key={stat.label}
              >
                <span className="w-[100px] text-[#6b7280]">
                  {stat.label}
                </span>
                <span className="text-[#6b7280]">:</span>
                <span className="text-[17.046px] font-medium text-[#1d7afc]">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ComponentShell>
  );
}
