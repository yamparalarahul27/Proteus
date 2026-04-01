/* eslint-disable @next/next/no-img-element */
"use client";

import ComponentShell from "@/components/ComponentShell";

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

const CODE_CONTENT = `https://github.com/anthropics/Proteus/blob/main/src/app/dominancebarcard/page.tsx`;

const PROMPT_CONTENT = `Build a market dominance bar card showing cryptocurrency dominance percentages. Display horizontal colored bars for each cryptocurrency (BTC, ETH) with their icon, label, and percentage value. Each bar has a distinct background color and width proportional to its dominance share.`;

export default function DominanceBarCardPage() {
  return (
    <ComponentShell title="Dominance Bar Card" codeContent={CODE_CONTENT} promptContent={PROMPT_CONTENT}>
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
    </ComponentShell>
  );
}
