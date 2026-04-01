/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Undo2 } from "lucide-react";

type DominanceBar = {
  background: string;
  icon: string;
  label: string;
  textColor: string;
  value: string;
  width: number;
};

const dominanceBars: DominanceBar[] = [
  {
    background: "#F8E6A0",
    icon: "/proteus/overview/btc.png",
    label: "BTC",
    textColor: "#1F2937",
    value: "39.8%",
    width: 244,
  },
  {
    background: "#CCE0FF",
    icon: "/proteus/overview/eth.png",
    label: "ETH",
    textColor: "#374151",
    value: "17.7%",
    width: 187,
  },
];

export default function DominanceBarCardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white px-6 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <Undo2 className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col items-center px-6 py-12">
        <h1 className="mb-8 text-2xl font-semibold text-gray-900">
          Dominance Bar Card
        </h1>

        <section className="w-full max-w-lg">
          <div className="proteus-panel rounded-[10px] px-[18px] py-[15px]">
            <h3 className="text-[18px] font-medium leading-6 text-[#1f2937]">
              Market Dominance
            </h3>
            <div className="mt-[11px] space-y-[11px]">
              {dominanceBars.map((bar) => (
                <div
                  className="flex items-center gap-[6px]"
                  key={bar.label}
                >
                  <div
                    className="flex items-center gap-2 rounded-[4px] p-1"
                    style={{
                      backgroundColor: bar.background,
                      width: `${bar.width}px`,
                    }}
                  >
                    <img
                      alt=""
                      aria-hidden="true"
                      className="h-8 w-8 rounded-full object-cover"
                      src={bar.icon}
                    />
                    <span
                      className="text-[16px] font-medium leading-6"
                      style={{ color: bar.textColor }}
                    >
                      {bar.label}
                    </span>
                  </div>
                  <span className="text-[16px] font-medium leading-6 text-[#1f2937]">
                    {bar.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white px-6 py-4">
        <p className="text-center text-sm text-gray-500">
          Dominance Bar Card Component Demo
        </p>
      </footer>
    </div>
  );
}
