"use client";

import Link from "next/link";
import { Undo2 } from "lucide-react";

type MarketStat = { label: string; value: string };

const marketStats: MarketStat[] = [
  { label: "Crypto Coins", value: "21,497" },
  { label: "Need change", value: "521" },
  { label: "Market Cap", value: "$930,075,295,338" },
  { label: "24h Volume", value: "$44,125,521,243.91" },
];

export default function MarketStatCardPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--background)] border-b border-gray-200/60 px-4 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Undo2 size={16} />
          <span>Back</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 gap-5">
        <h1 className="text-xl font-semibold text-gray-800">
          Market Stats Card
        </h1>

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
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 px-4 py-4" />
    </div>
  );
}
