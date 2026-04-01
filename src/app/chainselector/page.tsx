"use client";

import { useState } from "react";
import Link from "next/link";
import { Undo2 } from "lucide-react";

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

export default function ChainSelectorPage() {
  const [selectedChainId, setSelectedChainId] = useState("ethereum");
  const selectedChain = chains.find((c) => c.id === selectedChainId) ?? chains[0];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <Undo2 className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col items-center px-6 py-12">
        <h1 className="mb-8 text-2xl font-semibold text-gray-900">Chain Selector Component</h1>

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
      </main>

      {/* Footer */}
      <footer className="border-t px-6 py-4" />
    </div>
  );
}
