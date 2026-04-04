/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import ComponentShell from "@/components/ComponentShell";

type Trend = "up" | "down";
type Chain = { icon: string; id: string; label: string };
type DefiCard = {
  chainId: string;
  change: string;
  highlight?: boolean;
  image: string;
  name: string;
  price: string;
  slug: string;
  symbol: string;
  trend: Trend;
  tvl: string;
};

const arrowIcon = {
  down: "/proteus/defi/arrow-down.svg",
  up: "/proteus/defi/arrow-up.svg",
};

const activeChain: Chain = {
  icon: "/proteus/header/chain-ethereum.svg",
  id: "ethereum",
  label: "Ethereum",
};

const defiCards: DefiCard[] = [
  {
    chainId: "ethereum",
    change: "0.25%",
    image: "/proteus/defi/uniswap.png",
    name: "Uniswap",
    price: "$6.13",
    slug: "uniswap",
    symbol: "UNI",
    trend: "up",
    tvl: "$323M",
  },
  {
    chainId: "ethereum",
    change: "1.96%",
    image: "/proteus/defi/lido.png",
    name: "LIDO",
    price: "$1.09",
    slug: "lido",
    symbol: "LDO",
    trend: "down",
    tvl: "$25.56B",
  },
  {
    chainId: "ethereum",
    change: "2.93%",
    image: "/proteus/defi/aave.png",
    name: "Aave V3",
    price: "$95.22",
    slug: "aave-v3",
    symbol: "AAVE",
    trend: "down",
    tvl: "$9.83B",
  },
];

const CODE_CONTENT = `/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";

type Trend = "up" | "down";
type Chain = { icon: string; id: string; label: string };
type DefiCard = {
  chainId: string;
  change: string;
  highlight?: boolean;
  image: string;
  name: string;
  price: string;
  slug: string;
  symbol: string;
  trend: Trend;
  tvl: string;
};

const arrowIcon = {
  down: "/proteus/defi/arrow-down.svg",
  up: "/proteus/defi/arrow-up.svg",
};

const activeChain: Chain = {
  icon: "/proteus/header/chain-ethereum.svg",
  id: "ethereum",
  label: "Ethereum",
};

const defiCards: DefiCard[] = [
  {
    chainId: "ethereum",
    change: "0.25%",
    image: "/proteus/defi/uniswap.png",
    name: "Uniswap",
    price: "\\$6.13",
    slug: "uniswap",
    symbol: "UNI",
    trend: "up",
    tvl: "\\$323M",
  },
  {
    chainId: "ethereum",
    change: "1.96%",
    image: "/proteus/defi/lido.png",
    name: "LIDO",
    price: "\\$1.09",
    slug: "lido",
    symbol: "LDO",
    trend: "down",
    tvl: "\\$25.56B",
  },
  {
    chainId: "ethereum",
    change: "2.93%",
    image: "/proteus/defi/aave.png",
    name: "Aave V3",
    price: "\\$95.22",
    slug: "aave-v3",
    symbol: "AAVE",
    trend: "down",
    tvl: "\\$9.83B",
  },
];

function TrendPill({ trend, value }: { trend: Trend; value: string }) {
  const positive = trend === "up";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-[21.5px] px-[6px] py-1 text-[14px] font-bold leading-none"
      style={{
        backgroundColor: positive ? "#DCFFF1" : "#FCE4EC",
        color: positive ? "#1F845A" : "#FF4842",
      }}
    >
      <img
        alt=""
        aria-hidden="true"
        className="h-4 w-4"
        src={positive ? arrowIcon.up : arrowIcon.down}
      />
      <span className="font-roboto">{value}</span>
    </span>
  );
}

function DefiCardItem({
  card,
  favorite,
  onToggleFavorite,
}: {
  card: DefiCard;
  favorite: boolean;
  onToggleFavorite: (slug: string) => void;
}) {
  return (
    <article
      className={
        favorite
          ? "flex w-[311px] min-w-[311px] flex-col gap-2 rounded-[8px] border border-[#ddd6fe] bg-white p-3 shadow-[0_8px_20px_rgba(109,40,217,0.12)]"
          : card.highlight
            ? "flex w-[311px] min-w-[311px] flex-col gap-2 rounded-[8px] border border-[#e5e7eb] bg-white p-3 shadow-[0_4px_6px_rgba(0,0,0,0.09)]"
            : "flex w-[311px] min-w-[311px] flex-col gap-2 rounded-[8px] border border-[#f3f4f6] bg-white p-3 shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
      }
    >
      <div className="flex items-start justify-between gap-6">
        <Link
          className="flex min-w-0 items-center gap-3"
          href={\\\`/swap-flow?protocol=\\\${card.slug}&chain=\\\${activeChain.id}\\\`}
        >
          <img
            alt={\\\`\\\${card.name} icon\\\`}
            className={
              card.name === "LIDO"
                ? "h-[79.548px] w-[79.548px] rounded-[12.08px] object-cover"
                : "h-20 w-20 rounded-[6px] object-cover"
            }
            src={card.image}
          />
          <div className="space-y-[6px]">
            <div className="flex items-center gap-2">
              <h3
                className={
                  favorite
                    ? "text-[20px] font-medium leading-7 text-[#2e1065]"
                    : "text-[18px] font-medium leading-6 text-[#374151]"
                }
              >
                {card.name}
              </h3>
              <span className="rounded-[4px] bg-[#f3f4f6] px-2 py-1 font-roboto text-[14px] font-semibold text-[#4b5563]">
                {card.symbol}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-semibold leading-4 text-[#6b7280]">
                Price
              </p>
              <div className="flex items-center gap-3">
                <p className="text-[24px] font-medium leading-10 text-[#374151]">
                  {card.price}
                </p>
                <TrendPill trend={card.trend} value={card.change} />
              </div>
            </div>
          </div>
        </Link>
        <button
          aria-label={favorite ? "Remove from favorites" : "Save to favorites"}
          className={\\\`flex h-[34px] w-[34px] items-center justify-center rounded-full \\\${favorite ? "bg-[#f3f0ff]" : "bg-transparent"}\\\`}
          onClick={() => onToggleFavorite(card.slug)}
          type="button"
        >
          <img
            alt=""
            aria-hidden="true"
            className={\\\`h-[26px] w-[26px] \\\${favorite ? "opacity-100" : "opacity-60"}\\\`}
            src="/proteus/defi/bookmark.svg"
          />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center text-[16px] leading-6 text-[#374151]">
          <span>TVL:</span>
          <span className="ml-0.5 font-medium">{card.tvl}</span>
        </div>
        <div
          className={
            favorite
              ? "flex flex-1 items-center justify-between rounded-[38px] border border-[#e9d5ff] bg-[#faf5ff] py-[6px] pl-[6px] pr-3"
              : "flex flex-1 items-center justify-between rounded-[38px] border border-[#f3f4f6] bg-white py-[6px] pl-[6px] pr-3"
          }
        >
          <div className="flex items-center gap-2">
            <img
              alt=""
              aria-hidden="true"
              className="h-[26px] w-[26px] rounded-full object-cover"
              src={activeChain.icon}
            />
            <span className="font-roboto text-[16px] leading-none text-[#374151]">
              {activeChain.label}
            </span>
          </div>
          <img
            alt=""
            aria-hidden="true"
            className="h-4 w-4 rotate-180"
            src="/proteus/defi/dropdown.svg"
          />
        </div>
      </div>
    </article>
  );
}

export default function DefiCardPage() {
  const [favoriteSlugs, setFavoriteSlugs] = useState<Set<string>>(new Set());

  const handleToggleFavorite = (slug: string) => {
    setFavoriteSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const filteredCards = defiCards.filter(
    (c) => c.chainId === activeChain.id,
  );

  return (
    <section className="w-full max-w-4xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-semibold leading-7 text-[#1f2937]">
            Popular Decentralised Finance
          </h2>
          <p className="text-[14px] text-[#6b7280]">
            {filteredCards.length} protocols on {activeChain.label}
          </p>
        </div>
        <button
          className="rounded-[8px] border border-[#e5e7eb] px-4 py-2 text-[14px] font-medium text-[#374151] hover:bg-[#f9fafb]"
          type="button"
        >
          View More
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {filteredCards.map((card) => (
          <DefiCardItem
            card={card}
            favorite={favoriteSlugs.has(card.slug)}
            key={card.slug}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}`;

const PROMPT_CONTENT = `Build a horizontal scrolling DeFi protocol card strip. Each card shows the protocol icon, name, ticker symbol, current price with a trend pill (green up / red down), TVL, a chain selector pill, and a bookmark/favorite toggle. Cards gain a purple border and glow when favorited. Display a heading with the protocol count and a "View More" button above the strip.`;

function TrendPill({ trend, value }: { trend: Trend; value: string }) {
  const positive = trend === "up";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-[21.5px] px-[6px] py-1 text-[14px] font-bold leading-none"
      style={{
        backgroundColor: positive ? "#DCFFF1" : "#FCE4EC",
        color: positive ? "#1F845A" : "#FF4842",
      }}
    >
      <img
        alt=""
        aria-hidden="true"
        className="h-4 w-4"
        src={positive ? arrowIcon.up : arrowIcon.down}
      />
      <span className="font-roboto">{value}</span>
    </span>
  );
}

function DefiCardItem({
  card,
  favorite,
  onToggleFavorite,
}: {
  card: DefiCard;
  favorite: boolean;
  onToggleFavorite: (slug: string) => void;
}) {
  return (
    <article
      className={
        favorite
          ? "flex w-[311px] min-w-[311px] flex-col gap-2 rounded-[8px] border border-[#ddd6fe] bg-white p-3 shadow-[0_8px_20px_rgba(109,40,217,0.12)]"
          : card.highlight
            ? "flex w-[311px] min-w-[311px] flex-col gap-2 rounded-[8px] border border-[#e5e7eb] bg-white p-3 shadow-[0_4px_6px_rgba(0,0,0,0.09)]"
            : "flex w-[311px] min-w-[311px] flex-col gap-2 rounded-[8px] border border-[#f3f4f6] bg-white p-3 shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
      }
    >
      <div className="flex items-start justify-between gap-6">
        <Link
          className="flex min-w-0 items-center gap-3"
          href={`/swap-flow?protocol=${card.slug}&chain=${activeChain.id}`}
        >
          <img
            alt={`${card.name} icon`}
            className={
              card.name === "LIDO"
                ? "h-[79.548px] w-[79.548px] rounded-[12.08px] object-cover"
                : "h-20 w-20 rounded-[6px] object-cover"
            }
            src={card.image}
          />
          <div className="space-y-[6px]">
            <div className="flex items-center gap-2">
              <h3
                className={
                  favorite
                    ? "text-[20px] font-medium leading-7 text-[#2e1065]"
                    : "text-[18px] font-medium leading-6 text-[#374151]"
                }
              >
                {card.name}
              </h3>
              <span className="rounded-[4px] bg-[#f3f4f6] px-2 py-1 font-roboto text-[14px] font-semibold text-[#4b5563]">
                {card.symbol}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-semibold leading-4 text-[#6b7280]">
                Price
              </p>
              <div className="flex items-center gap-3">
                <p className="text-[24px] font-medium leading-10 text-[#374151]">
                  {card.price}
                </p>
                <TrendPill trend={card.trend} value={card.change} />
              </div>
            </div>
          </div>
        </Link>
        <button
          aria-label={favorite ? "Remove from favorites" : "Save to favorites"}
          className={`flex h-[34px] w-[34px] items-center justify-center rounded-full ${favorite ? "bg-[#f3f0ff]" : "bg-transparent"}`}
          onClick={() => onToggleFavorite(card.slug)}
          type="button"
        >
          <img
            alt=""
            aria-hidden="true"
            className={`h-[26px] w-[26px] ${favorite ? "opacity-100" : "opacity-60"}`}
            src="/proteus/defi/bookmark.svg"
          />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center text-[16px] leading-6 text-[#374151]">
          <span>TVL:</span>
          <span className="ml-0.5 font-medium">{card.tvl}</span>
        </div>
        <div
          className={
            favorite
              ? "flex flex-1 items-center justify-between rounded-[38px] border border-[#e9d5ff] bg-[#faf5ff] py-[6px] pl-[6px] pr-3"
              : "flex flex-1 items-center justify-between rounded-[38px] border border-[#f3f4f6] bg-white py-[6px] pl-[6px] pr-3"
          }
        >
          <div className="flex items-center gap-2">
            <img
              alt=""
              aria-hidden="true"
              className="h-[26px] w-[26px] rounded-full object-cover"
              src={activeChain.icon}
            />
            <span className="font-roboto text-[16px] leading-none text-[#374151]">
              {activeChain.label}
            </span>
          </div>
          <img
            alt=""
            aria-hidden="true"
            className="h-4 w-4 rotate-180"
            src="/proteus/defi/dropdown.svg"
          />
        </div>
      </div>
    </article>
  );
}

export default function DefiCardPage() {
  const [favoriteSlugs, setFavoriteSlugs] = useState<Set<string>>(new Set());

  const handleToggleFavorite = (slug: string) => {
    setFavoriteSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const filteredCards = defiCards.filter(
    (c) => c.chainId === activeChain.id,
  );

  return (
    <ComponentShell title="DeFi Card Component" codeContent={CODE_CONTENT} promptContent={PROMPT_CONTENT}>
      <section className="w-full max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-semibold leading-7 text-[#1f2937]">
              Popular Decentralised Finance
            </h2>
            <p className="text-[14px] text-[#6b7280]">
              {filteredCards.length} protocols on {activeChain.label}
            </p>
          </div>
          <button
            className="rounded-[8px] border border-[#e5e7eb] px-4 py-2 text-[14px] font-medium text-[#374151] hover:bg-[#f9fafb]"
            type="button"
          >
            View More
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {filteredCards.map((card) => (
            <DefiCardItem
              card={card}
              favorite={favoriteSlugs.has(card.slug)}
              key={card.slug}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </section>
    </ComponentShell>
  );
}
