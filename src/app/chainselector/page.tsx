"use client";

import { useState } from "react";
import ComponentShell from "@/components/ComponentShell";

type Chain = {
  icon: string;
  id: string;
  label: string;
};

const chains: Chain[] = [
  { icon: "/proteus/header/chain-ethereum.svg", id: "ethereum", label: "Ethereum" },
  { icon: "/proteus/header/chain-solana.svg", id: "solana", label: "Solana" },
  { icon: "/proteus/header/chain-bitcoin.svg", id: "bitcoin", label: "Bitcoin" },
  { icon: "/proteus/header/chain-4.svg", id: "chain-4", label: "Chain 4" },
  { icon: "/proteus/header/chain-5.svg", id: "chain-5", label: "Chain 5" },
  { icon: "/proteus/header/chain-6.svg", id: "chain-6", label: "Chain 6" },
  { icon: "/proteus/header/chain-7.svg", id: "chain-7", label: "Chain 7" },
  { icon: "/proteus/header/chain-8.svg", id: "chain-8", label: "Chain 8" },
];

const CODE_CONTENT = `https://github.com/anthropics/Proteus/blob/main/src/app/chainselector/page.tsx`;

const PROMPT_CONTENT = `Build a horizontal chain-selector pill bar. Display a row of blockchain icons inside a rounded container. The active chain shows its label next to the icon with a purple underline; inactive chains show only the icon. Clicking an icon selects that chain.`;

export default function ChainSelectorPage() {
  const [selectedChainId, setSelectedChainId] = useState("ethereum");
  const selectedChain = chains.find((c) => c.id === selectedChainId) ?? chains[0];

  return (
    <ComponentShell title="Chain Selector Component" codeContent={CODE_CONTENT} promptContent={PROMPT_CONTENT}>
      <div className="flex w-full max-w-[610px] items-center gap-6 overflow-x-auto rounded-[100px] bg-white px-4 py-1 shadow-[0_2px_4px_rgba(0,0,0,0.04)] hide-scrollbar">
        <span className="shrink-0 text-[14px] text-[#1f2937]">Chains:</span>
        <div className="flex min-w-[456px] flex-1 items-center justify-between gap-4">
          {chains.map((chain) => {
            const active = selectedChain.id === chain.id;
            return (
              <button
                className={
                  active
                    ? "flex items-center gap-1 border-b-2 border-[#8162ff] p-[6px]"
                    : "flex items-center gap-1 p-[6px]"
                }
                key={chain.id}
                onClick={() => setSelectedChainId(chain.id)}
                type="button"
              >
                <img alt={chain.label} className="h-5 w-5 shrink-0" src={chain.icon} />
                {active ? (
                  <span className="text-[12px] font-medium text-[#1f2937]">{chain.label}</span>
                ) : null}
              </button>
            );
          })}
        </div>
        <img
          alt=""
          aria-hidden="true"
          className="ml-auto h-6 w-6 shrink-0 rotate-180"
          src="/proteus/header/chevron-up.svg"
        />
      </div>
    </ComponentShell>
  );
}
