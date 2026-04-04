"use client";

import { BarChart3, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Token = {
  id: string;
  name: string;
  symbol: string;
  price: string;
  volume: string;
  change: string;
  direction: "up" | "down";
};

const tokens: Token[] = [
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: "$80.21",
    volume: "$15.34B",
    change: "+0.24%",
    direction: "up",
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: "$67,148.58",
    volume: "$28.09M",
    change: "+0.21%",
    direction: "up",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: "$2,049.43",
    volume: "$14.10M",
    change: "-0.61%",
    direction: "down",
  },
  {
    id: "hyperliquid",
    name: "Hyperliquid",
    symbol: "HYPE",
    price: "$35.77",
    volume: "$3.50M",
    change: "-0.44%",
    direction: "down",
  },
  {
    id: "zcash",
    name: "Zcash",
    symbol: "ZEC",
    price: "$245.25",
    volume: "$1.11M",
    change: "+2.85%",
    direction: "up",
  },
  {
    id: "tron",
    name: "TRON",
    symbol: "TRX",
    price: "$0.316534",
    volume: "$788.80K",
    change: "+0.91%",
    direction: "up",
  },
];

function TokenIcon({ tokenId }: { tokenId: Token["id"] }) {
  if (tokenId === "solana") {
    return (
      <div className="relative h-12 w-12 overflow-hidden rounded-full bg-black">
        <div className="absolute left-2 top-[10px] h-[7px] w-8 -skew-x-[22deg] rounded-full bg-gradient-to-r from-[#86f9ff] via-[#8e67ff] to-[#60f5c0]" />
        <div className="absolute left-2 top-[21px] h-[7px] w-8 -skew-x-[22deg] rounded-full bg-gradient-to-r from-[#60f5c0] via-[#8e67ff] to-[#86f9ff]" />
        <div className="absolute left-2 top-[32px] h-[7px] w-8 -skew-x-[22deg] rounded-full bg-gradient-to-r from-[#86f9ff] via-[#8e67ff] to-[#60f5c0]" />
      </div>
    );
  }

  if (tokenId === "bitcoin") {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f39b35] text-[30px] font-bold leading-none text-white">
        ₿
      </div>
    );
  }

  if (tokenId === "ethereum") {
    return (
      <div className="relative h-12 w-12 rounded-full bg-[#dadbdd]">
        <svg
          viewBox="0 0 24 24"
          className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <path d="M12 2L6.5 11.2L12 8.4L17.5 11.2L12 2Z" fill="#5F6369" />
          <path d="M12 8.9L6.5 11.7L12 14.9L17.5 11.7L12 8.9Z" fill="#8B8F95" />
          <path d="M12 22L6.5 12.9L12 16.1L17.5 12.9L12 22Z" fill="#4B4F55" />
        </svg>
      </div>
    );
  }

  if (tokenId === "hyperliquid") {
    return (
      <div className="relative h-12 w-12 rounded-full bg-[#062a2a]">
        <div className="absolute left-[8px] top-[13px] h-[13px] w-[8px] rounded-full bg-[#8cf4d7]" />
        <div className="absolute left-[16px] top-[17px] h-[8px] w-[18px] rounded-full bg-[#8cf4d7]" />
        <div className="absolute right-[8px] top-[13px] h-[13px] w-[8px] rounded-full bg-[#8cf4d7]" />
      </div>
    );
  }

  if (tokenId === "zcash") {
    return (
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black bg-[#f0b248]">
        <span className="text-[28px] font-bold leading-none text-black">Z</span>
      </div>
    );
  }

  return (
    <div className="relative h-12 w-12 rounded-full bg-[#cc4738]">
      <svg
        viewBox="0 0 24 24"
        className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <path
          d="M3.4 5.2L20.4 8.2L12 20.2L3.4 5.2ZM6.9 7.3L12 16.1L17.1 9L6.9 7.3Z"
          fill="none"
          stroke="#fff"
          strokeWidth="1.25"
        />
      </svg>
    </div>
  );
}

function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-8 min-w-11 items-center justify-center rounded-[7px] border border-[#c8c8cc] bg-[#e7e7ea] px-2 text-[29px] font-medium leading-none text-[#707177] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
      {children}
    </span>
  );
}

export default function TokenSelectorModal({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "w-full max-w-[740px] overflow-hidden rounded-[32px] border border-[#ceced3] bg-[#f2f2f4] shadow-[0_16px_36px_rgba(0,0,0,0.18)]",
        className,
      )}
      aria-label="Token selector modal"
    >
      <div className="border-b border-[#d2d2d7] px-6 py-6 sm:px-7 sm:py-7">
        <div className="flex items-center gap-3 text-[#8a8b8f]">
          <Search size={33} strokeWidth={2} />
          <p className="text-[38px] font-medium leading-none">Search tokens...</p>
        </div>
      </div>

      <div className="px-6 pb-3 pt-4 sm:px-7">
        <div className="mb-3 flex items-center gap-2 text-[#7e7f84]">
          <BarChart3 size={18} strokeWidth={2} />
          <p className="text-[36px] font-medium leading-none">Top by volume</p>
        </div>

        <ul className="space-y-2">
          {tokens.map((token, index) => (
            <li
              key={token.id}
              className={cn(
                "flex items-center justify-between rounded-[22px] px-3 py-3",
                index === 0 ? "bg-[#e7e7ea]" : "bg-transparent",
              )}
            >
              <div className="flex min-w-0 items-center gap-4">
                <TokenIcon tokenId={token.id} />
                <div className="min-w-0">
                  <p className="flex items-baseline gap-2 text-[40px] leading-none">
                    <span className="truncate font-medium text-[#252629]">{token.name}</span>
                    <span className="truncate text-[#7c7d82]">{token.symbol}</span>
                  </p>
                  <p className="mt-1 text-[35px] leading-none text-[#8a8b90]">
                    {token.price}
                    <span className="ml-3">Vol: {token.volume}</span>
                  </p>
                </div>
              </div>

              <p
                className={cn(
                  "ml-4 shrink-0 text-[36px] font-medium leading-none",
                  token.direction === "up" ? "text-[#3ca55c]" : "text-[#f0453a]",
                )}
              >
                {token.change}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-[#d2d2d7] px-6 py-4 sm:px-7">
        <div className="flex flex-wrap items-center justify-center gap-7 text-[36px] text-[#3d3e42]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <KeyCap>↑</KeyCap>
              <KeyCap>↓</KeyCap>
            </div>
            <span>List</span>
          </div>

          <div className="flex items-center gap-3">
            <KeyCap>Enter</KeyCap>
            <span>Select</span>
          </div>

          <div className="flex items-center gap-3">
            <KeyCap>Esc</KeyCap>
            <span>Close</span>
          </div>
        </div>
      </div>
    </section>
  );
}
