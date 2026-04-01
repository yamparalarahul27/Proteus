/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useEffect, useState } from "react";

type Trend = "up" | "down";
type SortDirection = "asc" | "desc";
type SortKey = "volume" | "dayChange" | "floorPrice" | "owners" | "supply";

type NavItem = {
  href: string;
  icon?: string;
  kind?: "defi" | "nft";
  label: string;
};

type Chain = {
  icon: string;
  id: string;
  label: string;
};

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

type NftCollection = {
  chainId: string;
  dayChange: string;
  floorPrice: string;
  image: string;
  name: string;
  owners: string;
  slug: string;
  supply: string;
  trend: Trend;
  useRoboto?: boolean;
  volume: string;
};

type GasMode = {
  id: string;
  image: string;
  imageClassName: string;
  label: string;
  priceLabel: string;
  speed: string;
  textColor: string;
  tone: string;
};

type MarketStat = {
  label: string;
  value: string;
};

type DominanceBar = {
  background: string;
  icon: string;
  label: string;
  textColor: string;
  value: string;
  width: number;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: "/proteus/header/nav-home.svg" },
  { href: "/assets", label: "Assets", icon: "/proteus/header/nav-assets.svg" },
  { href: "/defi", label: "DeFi", kind: "defi" },
  { href: "/nft", label: "NFT", kind: "nft" },
  {
    href: "/transactions",
    label: "Transactions",
    icon: "/proteus/header/nav-transactions.svg",
  },
];

const chains: Chain[] = [
  {
    icon: "/proteus/header/chain-ethereum.svg",
    id: "ethereum",
    label: "Ethereum",
  },
  { icon: "/proteus/header/chain-solana.svg", id: "solana", label: "Solana" },
  { icon: "/proteus/header/chain-bitcoin.svg", id: "bitcoin", label: "Bitcoin" },
  { icon: "/proteus/header/chain-4.svg", id: "chain-4", label: "Chain 4" },
  { icon: "/proteus/header/chain-5.svg", id: "chain-5", label: "Chain 5" },
  { icon: "/proteus/header/chain-6.svg", id: "chain-6", label: "Chain 6" },
  { icon: "/proteus/header/chain-7.svg", id: "chain-7", label: "Chain 7" },
  { icon: "/proteus/header/chain-8.svg", id: "chain-8", label: "Chain 8" },
];

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
  {
    chainId: "solana",
    change: "1.13%",
    image: "/proteus/defi/curve.png",
    name: "Curve",
    price: "$0.25",
    slug: "curve",
    symbol: "CRV",
    trend: "up",
    tvl: "$1.5B",
  },
  {
    chainId: "chain-7",
    change: "0.25%",
    highlight: true,
    image: "/proteus/defi/fifth-card.png",
    name: "Uniswap",
    price: "$6.13",
    slug: "uniswap-pro",
    symbol: "UNI",
    trend: "up",
    tvl: "$97.6M",
  },
];

const nftCollections: NftCollection[] = [
  {
    chainId: "solana",
    dayChange: "+29.89%",
    floorPrice: "0.027",
    image: "/proteus/nft/frogana.png",
    name: "Frogana",
    owners: "5.3K",
    slug: "frogana",
    supply: "10.0K",
    trend: "up",
    volume: "397",
  },
  {
    chainId: "ethereum",
    dayChange: "-9.09%",
    floorPrice: "0.047",
    image: "/proteus/nft/leaguefast.png",
    name: "LeagueFast",
    owners: "6.1K",
    slug: "leaguefast",
    supply: "26.0K",
    trend: "down",
    useRoboto: true,
    volume: "124",
  },
  {
    chainId: "ethereum",
    dayChange: "+13.11%",
    floorPrice: "0.025",
    image: "/proteus/nft/otherdeed.png",
    name: "Otherdeed for Otherside",
    owners: "9.8K",
    slug: "otherdeed-for-otherside",
    supply: "14.0K",
    trend: "up",
    useRoboto: true,
    volume: "567",
  },
  {
    chainId: "ethereum",
    dayChange: "+10.66%",
    floorPrice: "0.039",
    image: "/proteus/nft/azuki.png",
    name: "Azuki",
    owners: "2.1K",
    slug: "azuki",
    supply: "45.0K",
    trend: "up",
    useRoboto: true,
    volume: "123",
  },
  {
    chainId: "chain-5",
    dayChange: "-03.83%",
    floorPrice: "0.021",
    image: "/proteus/nft/infamous.png",
    name: "Infamous - Clearance Passes",
    owners: "4.6K",
    slug: "infamous-clearance-passes",
    supply: "14.0K",
    trend: "down",
    useRoboto: true,
    volume: "256",
  },
  {
    chainId: "bitcoin",
    dayChange: "+30.69%",
    floorPrice: "0.089",
    image: "/proteus/nft/cryptopunks.png",
    name: "CryptoPunks",
    owners: "6.3K",
    slug: "cryptopunks",
    supply: "34.0K",
    trend: "up",
    useRoboto: true,
    volume: "645",
  },
  {
    chainId: "chain-7",
    dayChange: "-02.19%",
    floorPrice: "0.017",
    image: "/proteus/nft/bored-ape-kennel.png",
    name: "Bored Ape Kennel",
    owners: "1.4K",
    slug: "bored-ape-kennel",
    supply: "16.0K",
    trend: "down",
    useRoboto: true,
    volume: "86",
  },
];

const gasModes: GasMode[] = [
  {
    id: "walking",
    image: "/proteus/overview/walker.png",
    imageClassName: "h-[40px] w-[23px] object-contain",
    label: "Walking",
    priceLabel: "$1.05 | ~ 30 secs",
    speed: "Low Speed",
    textColor: "#E56910",
    tone: "#FFF3EB",
  },
  {
    id: "speed-bike",
    image: "/proteus/overview/bike.png",
    imageClassName: "h-[38px] w-[87px] object-contain",
    label: "Speed Bike",
    priceLabel: "$1.05 | ~ 30 secs",
    speed: "Average Speed",
    textColor: "#22A06B",
    tone: "#DCFFF1",
  },
  {
    id: "future-car",
    image: "/proteus/overview/car.png",
    imageClassName: "h-[50px] w-[101px] object-contain -mt-2",
    label: "Future Car",
    priceLabel: "$1.05 | ~ 30 secs",
    speed: "High Speed",
    textColor: "#1D7AFC",
    tone: "#E9F2FF",
  },
];

const gasProfiles: Record<string, { base: number; values: Record<string, number> }> = {
  bitcoin: {
    base: 12,
    values: { "future-car": 17, "speed-bike": 15, walking: 13 },
  },
  "chain-4": {
    base: 22,
    values: { "future-car": 28, "speed-bike": 25, walking: 23 },
  },
  "chain-5": {
    base: 24,
    values: { "future-car": 30, "speed-bike": 27, walking: 25 },
  },
  "chain-6": {
    base: 16,
    values: { "future-car": 21, "speed-bike": 19, walking: 17 },
  },
  "chain-7": {
    base: 20,
    values: { "future-car": 26, "speed-bike": 23, walking: 21 },
  },
  "chain-8": {
    base: 14,
    values: { "future-car": 19, "speed-bike": 17, walking: 15 },
  },
  ethereum: {
    base: 30,
    values: { "future-car": 34, "speed-bike": 32, walking: 31 },
  },
  solana: {
    base: 18,
    values: { "future-car": 23, "speed-bike": 21, walking: 19 },
  },
};

const marketStats: MarketStat[] = [
  { label: "Crypto Coins", value: "21,497" },
  { label: "Need change", value: "521" },
  { label: "Market Cap", value: "$930,075,295,338" },
  { label: "24h Volume", value: "$44,125,521,243.91" },
];

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

const arrowIcon = {
  down: "/proteus/defi/arrow-down.svg",
  up: "/proteus/defi/arrow-up.svg",
};

function matchesQuery(values: string[], query: string) {
  if (!query) {
    return true;
  }

  return values.some((value) => value.toLowerCase().includes(query));
}

function parseMetricValue(value: string) {
  const cleaned = value.replace(/[$,%]/g, "").trim();
  const suffix = cleaned.slice(-1).toUpperCase();
  const baseValue = Number.parseFloat(cleaned);

  if (Number.isNaN(baseValue)) {
    return 0;
  }

  if (suffix === "K") {
    return baseValue * 1_000;
  }

  if (suffix === "M") {
    return baseValue * 1_000_000;
  }

  if (suffix === "B") {
    return baseValue * 1_000_000_000;
  }

  return baseValue;
}

function AppLogo() {
  return (
    <Link className="flex items-center gap-[10px]" href="/">
      <div className="relative flex h-[31.794px] w-[31.794px] items-center justify-center rounded-[7.337px] bg-gradient-to-b from-[#8162ff] to-[#5d3ae9]">
        <span className="font-brand text-[24.914px] leading-[1.3] tracking-[0.7474px] text-white">
          Pr
        </span>
      </div>
      <span className="text-[17.046px] font-semibold tracking-[0.5114px] text-[#1f2937]">
        Proteus
      </span>
    </Link>
  );
}

function DefiIcon() {
  return (
    <div className="relative h-[22px] w-[22px]">
      <span className="absolute left-[3.79px] top-[5.06px] h-[6.603px] w-[6.603px] border border-[#6b7280]" />
      <span className="absolute left-[12.68px] top-[3.79px] h-[6.603px] w-[6.603px] border border-[#1f2937]" />
      <span className="absolute left-[3.79px] top-[12.34px] h-[6.603px] w-[6.603px] border border-[#6b7280]" />
      <span className="absolute left-[11.41px] top-[12.34px] h-[6.603px] w-[6.603px] border border-[#6b7280]" />
    </div>
  );
}

function NftIcon() {
  return (
    <div className="relative h-[22px] w-[22px]">
      <span className="absolute left-[3.79px] top-[7.69px] h-[7.353px] w-[4.281px] rounded-[0.613px] border-[0.663px] border-[#6b7280]" />
      <span className="absolute left-[7.76px] top-[5.68px] h-[11.364px] w-[6.616px] rounded-[0.947px] border-[0.663px] border-[#6b7280]" />
      <span className="absolute left-[13.71px] top-[7.69px] h-[7.353px] w-[4.281px] rounded-[0.613px] border-[0.663px] border-[#6b7280]" />
    </div>
  );
}

function NavIcon({ item }: { item: NavItem }) {
  if (item.kind === "defi") {
    return <DefiIcon />;
  }

  if (item.kind === "nft") {
    return <NftIcon />;
  }

  return (
    <img
      alt=""
      aria-hidden="true"
      className="h-[22px] w-[22px]"
      src={item.icon}
    />
  );
}

function EmptyState({
  actionLabel,
  description,
  onAction,
  title,
}: {
  actionLabel: string;
  description: string;
  onAction: () => void;
  title: string;
}) {
  return (
    <div className="rounded-[8px] border border-dashed border-[#d1d5db] bg-white px-5 py-8 text-center shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
      <h3 className="text-[18px] font-medium text-[#1f2937]">{title}</h3>
      <p className="mt-2 text-[14px] leading-6 text-[#6b7280]">{description}</p>
      <button
        className="mt-4 rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-4 py-2 text-[14px] font-medium text-[#1f2937]"
        onClick={onAction}
        type="button"
      >
        {actionLabel}
      </button>
    </div>
  );
}

function HeaderSection({
  onSearchChange,
  onSelectChain,
  searchTerm,
  selectedChain,
  userMenuOpen,
  onToggleUserMenu,
}: {
  onSearchChange: (value: string) => void;
  onSelectChain: (chainId: string) => void;
  searchTerm: string;
  selectedChain: Chain;
  userMenuOpen: boolean;
  onToggleUserMenu: () => void;
}) {
  return (
    <header className="flex flex-col items-center gap-[6px]">
      <div className="w-full rounded-[9.47px] bg-white px-4 py-2 shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="shrink-0">
            <AppLogo />
          </div>

          <div className="flex flex-1 flex-wrap items-center justify-center gap-x-10 gap-y-4 rounded-[94.7px] px-5 py-2">
            {navItems.map((item) => {
              const active = item.href === "/";

              return (
                <Link
                  className="flex items-center gap-[6px] text-[14px] leading-none"
                  href={item.href}
                  key={item.label}
                >
                  <NavIcon item={item} />
                  <span
                    className={
                      active
                        ? "bg-gradient-to-b from-[#8162ff] to-[#5d3ae9] bg-clip-text font-semibold text-transparent"
                        : "font-normal text-[#1f2937]"
                    }
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}

            <label className="flex h-8 w-full max-w-[280px] items-center justify-between rounded-[4px] border border-black/6 bg-[#f9fafb] px-3 py-[6px]">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <img
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5"
                  src="/proteus/header/search.svg"
                />
                <input
                  className="min-w-0 flex-1 bg-transparent text-[14px] leading-5 text-[#1f2937] outline-none placeholder:text-[#4b5563]"
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search protocols or collections"
                  value={searchTerm}
                />
              </div>
              <span className="text-[14px] leading-5 text-[#4b5563]">/</span>
            </label>
          </div>

          <div className="relative self-end xl:self-auto">
            <button
              className="flex items-center gap-3 rounded-full px-2 py-1 hover:bg-[#f9fafb]"
              onClick={onToggleUserMenu}
              type="button"
            >
              <div className="flex h-[34.092px] w-[34.092px] items-center justify-center rounded-full bg-[#f3f0ff]">
                <span className="bg-gradient-to-b from-[#8162ff] to-[#5d3ae9] bg-clip-text text-[13.258px] font-semibold tracking-[-0.4735px] text-transparent">
                  YR
                </span>
              </div>
              <div className="text-left leading-none">
                <p className="text-[12px] font-semibold text-[#1f2937]">
                  Yamparala Rahul
                </p>
                <p className="mt-1 text-[10px] tracking-[0.3px] text-[#6b7280]">
                  0xe02eD2A6a8a12...
                </p>
              </div>
              <img
                alt=""
                aria-hidden="true"
                className={`h-6 w-6 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                src="/proteus/header/chevron-down.svg"
              />
            </button>

            {userMenuOpen ? (
              <div className="absolute right-0 top-[calc(100%+10px)] z-10 w-[220px] rounded-[12px] border border-[#e5e7eb] bg-white p-2 shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
                <Link
                  className="block rounded-[10px] px-3 py-2 text-[14px] text-[#1f2937] hover:bg-[#f9fafb]"
                  href="/assets"
                >
                  Wallet overview
                </Link>
                <Link
                  className="block rounded-[10px] px-3 py-2 text-[14px] text-[#1f2937] hover:bg-[#f9fafb]"
                  href="/transactions"
                >
                  Recent transactions
                </Link>
                <Link
                  className="block rounded-[10px] px-3 py-2 text-[14px] text-[#1f2937] hover:bg-[#f9fafb]"
                  href="/swap-flow"
                >
                  Open swap flow
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>

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
                onClick={() => onSelectChain(chain.id)}
                type="button"
              >
                <img
                  alt={chain.label}
                  className="h-5 w-5 shrink-0"
                  src={chain.icon}
                />
                {active ? (
                  <span className="text-[12px] font-medium text-[#1f2937]">
                    {chain.label}
                  </span>
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
    </header>
  );
}

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

function DefiCard({
  activeChain,
  card,
  favorite,
  onToggleFavorite,
}: {
  activeChain: Chain;
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
            : "proteus-panel flex w-[311px] min-w-[311px] flex-col gap-2 rounded-[8px] p-3"
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
                    : card.highlight
                      ? "text-[20px] font-medium leading-7 text-[#374151]"
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
          aria-pressed={favorite}
          className={`flex h-[34px] w-[34px] items-center justify-center rounded-full ${
            favorite ? "bg-[#f3f0ff]" : "bg-transparent"
          }`}
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
              : card.highlight
                ? "flex flex-1 items-center justify-between rounded-[4px] border border-[#f3f4f6] bg-white py-[6px] pl-[6px] pr-3"
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

function DefiStripSection({
  activeChain,
  cards,
  favorites,
  onReset,
  onToggleFavorite,
  query,
}: {
  activeChain: Chain;
  cards: DefiCard[];
  favorites: Set<string>;
  onReset: () => void;
  onToggleFavorite: (slug: string) => void;
  query: string;
}) {
  return (
    <section className="rounded-[8px] bg-white px-4 py-3 shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[20px] font-medium leading-6 text-[#374151]">
            Popular Decentralised Finance
          </h2>
          <p className="mt-1 text-[13px] leading-5 text-[#6b7280]">
            {cards.length} protocol{cards.length === 1 ? "" : "s"} on {activeChain.label}
            {query ? ` matching "${query}"` : ""}
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-[40px] border border-[#e5e7eb] bg-white px-3 py-[6px] text-[14px] font-medium leading-5 text-[#1f2937]"
          href="/defi"
        >
          View More
        </Link>
      </div>

      {cards.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            actionLabel="Reset Filters"
            description={`No protocols match the current search and chain selection. Switch back to Ethereum or clear the search to see more.`}
            onAction={onReset}
            title="No DeFi protocols found"
          />
        </div>
      ) : (
        <div className="mt-3 overflow-x-auto py-3 hide-scrollbar">
          <div className="flex min-w-max gap-3">
            {cards.map((card) => (
              <DefiCard
                activeChain={activeChain}
                card={card}
                favorite={favorites.has(card.slug)}
                key={card.slug}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function ColumnHeader({
  active,
  direction,
  label,
  onSort,
  width,
}: {
  active: boolean;
  direction: SortDirection;
  label: string;
  onSort: () => void;
  width: string;
}) {
  return (
    <button
      className={`flex items-center ${width} ${active ? "text-[#1f2937]" : "text-[#6b7280]"}`}
      onClick={onSort}
      type="button"
    >
      <span className="text-[12px] font-medium tracking-[0.24px]">{label}</span>
      <img
        alt=""
        aria-hidden="true"
        className={`h-6 w-6 transition-transform ${active && direction === "asc" ? "rotate-180" : ""}`}
        src="/proteus/nft/column-chevron.svg"
      />
    </button>
  );
}

function NftTableSection({
  collections,
  direction,
  onReset,
  onSort,
  query,
  sortKey,
}: {
  collections: NftCollection[];
  direction: SortDirection;
  onReset: () => void;
  onSort: (key: SortKey) => void;
  query: string;
  sortKey: SortKey;
}) {
  return (
    <section className="rounded-[8px] bg-[#f3f4f6] px-4 py-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-[20px] font-medium leading-[22.728px] text-[#1f2937]">
          Popular NFT Collection
        </h2>
        <p className="text-[13px] leading-5 text-[#6b7280]">
          Sorted by {sortKey === "dayChange" ? "1 Day %" : sortKey} ({direction})
          {query ? ` • filtered by "${query}"` : ""}
        </p>
      </div>

      {collections.length === 0 ? (
        <div className="mt-3">
          <EmptyState
            actionLabel="Reset Filters"
            description="No NFT collections match the current filters. Clear the search or switch chains to restore the collection list."
            onAction={onReset}
            title="No NFT collections found"
          />
        </div>
      ) : (
        <div className="mt-3 rounded-[4px] border border-[#e5e7eb] bg-white px-3 pb-3 pt-[6px]">
          <div className="overflow-x-auto hide-scrollbar">
            <div className="min-w-[676px]">
              <div className="flex items-center justify-between border-b border-[#e5e7eb] p-1">
                <div className="w-[197px] text-[12px] font-medium tracking-[0.24px] text-[#6b7280]">
                  Collection
                </div>
                <ColumnHeader
                  active={sortKey === "volume"}
                  direction={direction}
                  label="24h Volume"
                  onSort={() => onSort("volume")}
                  width="w-[95px]"
                />
                <ColumnHeader
                  active={sortKey === "dayChange"}
                  direction={direction}
                  label="1 Day %"
                  onSort={() => onSort("dayChange")}
                  width="w-[70px]"
                />
                <ColumnHeader
                  active={sortKey === "floorPrice"}
                  direction={direction}
                  label="Floor Price"
                  onSort={() => onSort("floorPrice")}
                  width="w-[88px]"
                />
                <ColumnHeader
                  active={sortKey === "owners"}
                  direction={direction}
                  label="Owners"
                  onSort={() => onSort("owners")}
                  width="w-[70px]"
                />
                <ColumnHeader
                  active={sortKey === "supply"}
                  direction={direction}
                  label="Supply"
                  onSort={() => onSort("supply")}
                  width="w-[65px]"
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                {collections.map((collection) => (
                  <div
                    className="flex items-center justify-between border-b border-[#e5e7eb] py-[6px]"
                    key={collection.slug}
                  >
                    <div className="flex w-[200px] items-center gap-2 px-1">
                      <img
                        alt={`${collection.name} collection artwork`}
                        className="h-[28.41px] w-[28.41px] rounded-[1.894px] object-cover"
                        src={collection.image}
                      />
                      <Link
                        className={`${collection.useRoboto ? "font-roboto text-[13.258px]" : "text-[14px]"} max-w-[143px] font-medium text-[#374151] hover:text-[#5d3ae9] ${
                          collection.name.length > 20 ? "leading-[16px]" : "leading-[22px]"
                        }`}
                        href={`/nft?collection=${collection.slug}`}
                      >
                        {collection.name}
                      </Link>
                    </div>
                    <span className="w-[95px] text-[14px] font-medium leading-[22px] text-[#374151]">
                      {collection.volume}
                    </span>
                    <span
                      className={`w-[70px] text-[14px] font-semibold leading-[22px] ${
                        collection.trend === "up" ? "text-[#1f845a]" : "text-[#e2483d]"
                      }`}
                    >
                      {collection.dayChange}
                    </span>
                    <span className="w-[88px] text-[14px] font-medium leading-[22px] text-[#374151]">
                      {collection.floorPrice}
                    </span>
                    <span className="w-[70px] text-[14px] font-medium leading-[22px] text-[#374151]">
                      {collection.owners}
                    </span>
                    <span className="w-[65px] text-[14px] font-medium leading-[22px] text-[#374151]">
                      {collection.supply}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function GasFeeModeCard({
  active,
  gwei,
  mode,
  onSelect,
}: {
  active: boolean;
  gwei: number;
  mode: GasMode;
  onSelect: (modeId: string) => void;
}) {
  const speedParts = mode.speed.split(" ");

  return (
    <button
      className={`flex items-center gap-4 rounded-[16px] px-3 py-2 text-left transition-colors ${
        active ? "bg-white shadow-[0_8px_18px_rgba(0,0,0,0.08)]" : "hover:bg-white/70"
      }`}
      onClick={() => onSelect(mode.id)}
      type="button"
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <img
          alt=""
          aria-hidden="true"
          className={mode.imageClassName}
          src={mode.image}
        />

        <div className="flex flex-col items-center gap-[2px]">
          <p className="text-[16px] font-medium leading-6 text-[#374151]">
            {mode.label}
          </p>
          <div className="flex items-center gap-1 text-[12px] font-medium tracking-[0.24px]">
            <span style={{ color: mode.textColor }}>{speedParts[0]}</span>
            <span className="text-[#374151]">{speedParts.slice(1).join(" ")}</span>
          </div>
          <p className="text-[10px] font-semibold leading-4 text-[#6b7280]">
            {mode.priceLabel}
          </p>
        </div>
      </div>

      <div
        className="flex h-20 w-20 flex-col items-center justify-center rounded-full pb-1"
        style={{ backgroundColor: mode.tone, color: mode.textColor }}
      >
        <span className="text-[36px] font-medium leading-[44px]">{gwei}</span>
        <span className="text-[12px] font-medium leading-4 tracking-[0.24px]">
          gwei
        </span>
      </div>
    </button>
  );
}

function OverviewSection({
  activeChain,
  countdown,
  displayedGasValues,
  onSelectGasMode,
  selectedGasMode,
}: {
  activeChain: Chain;
  countdown: number;
  displayedGasValues: Record<string, number>;
  onSelectGasMode: (modeId: string) => void;
  selectedGasMode: string;
}) {
  const activeGasProfile = gasProfiles[activeChain.id] ?? gasProfiles.ethereum;
  const gasHeading = activeChain.id === "ethereum" ? "ETH Gas Fees" : `${activeChain.label} Fees`;

  return (
    <section className="rounded-[8px] bg-[#f3f4f6] py-3 pl-3 pr-0 sm:pr-3">
      <h2 className="text-[20px] font-medium leading-[22.728px] text-[#1f2937]">
        Overview of Crypto Market
      </h2>

      <div className="mt-6 flex flex-col gap-6">
        <div className="proteus-panel rounded-[8px] px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <img
                  alt=""
                  aria-hidden="true"
                  className="h-6 w-6"
                  src="/proteus/overview/fuel.svg"
                />
                <h3 className="text-[18px] font-medium leading-6 text-[#1f2937]">
                  {gasHeading}
                </h3>
                <img
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5"
                  src="/proteus/overview/info.svg"
                />
              </div>

              <p className="mt-2 text-[12px] font-medium tracking-[0.24px] text-[#4b5563]">
                Base: {activeGasProfile.base} &nbsp; | &nbsp; Next update in {countdown}s
              </p>
            </div>

            <p className="text-[13px] font-medium text-[#6b7280]">
              Selected mode: {gasModes.find((mode) => mode.id === selectedGasMode)?.label}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            {gasModes.map((mode) => (
              <GasFeeModeCard
                active={selectedGasMode === mode.id}
                gwei={displayedGasValues[mode.id]}
                key={mode.id}
                mode={mode}
                onSelect={onSelectGasMode}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="proteus-panel rounded-[10px] px-[18px] py-[15px]">
            <div className="space-y-[11px]">
              {marketStats.map((stat) => (
                <div
                  className="flex items-center gap-3 text-[15.152px] leading-[22.728px]"
                  key={stat.label}
                >
                  <span className="w-[100px] text-[#6b7280]">{stat.label}</span>
                  <span className="text-[#6b7280]">:</span>
                  <span className="text-[17.046px] font-medium text-[#1d7afc]">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="proteus-panel rounded-[10px] px-[18px] py-[15px]">
            <h3 className="text-[18px] font-medium leading-6 text-[#1f2937]">
              Market Dominance
            </h3>
            <div className="mt-[11px] space-y-[11px]">
              {dominanceBars.map((bar) => (
                <div className="flex items-center gap-[6px]" key={bar.label}>
                  <div
                    className="flex items-center gap-2 rounded-[4px] p-1"
                    style={{ backgroundColor: bar.background, width: `${bar.width}px` }}
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
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [selectedChainId, setSelectedChainId] = useState("ethereum");
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [favoriteSlugs, setFavoriteSlugs] = useState(
    () => new Set(defiCards.filter((card) => card.highlight).map((card) => card.slug)),
  );
  const [sortKey, setSortKey] = useState<SortKey>("volume");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedGasMode, setSelectedGasMode] = useState("speed-bike");
  const [countdown, setCountdown] = useState(3);
  const [gasRefreshIndex, setGasRefreshIndex] = useState(0);

  const activeChain = chains.find((chain) => chain.id === selectedChainId) ?? chains[0];
  const visibleQuery = deferredSearchTerm.trim();
  const normalizedQuery = visibleQuery.toLowerCase();
  const activeGasProfile = gasProfiles[selectedChainId] ?? gasProfiles.ethereum;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown((current) => {
        if (current === 1) {
          setGasRefreshIndex((value) => value + 1);
          return 3;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const filteredDefiCards = defiCards.filter((card) => {
    return (
      card.chainId === selectedChainId &&
      matchesQuery([card.name, card.symbol, card.tvl], normalizedQuery)
    );
  });

  const visibleDefiCards = [...filteredDefiCards].sort((left, right) => {
    const favoriteDifference =
      Number(favoriteSlugs.has(right.slug)) - Number(favoriteSlugs.has(left.slug));

    if (favoriteDifference !== 0) {
      return favoriteDifference;
    }

    return left.name.localeCompare(right.name);
  });

  const filteredCollections = nftCollections.filter((collection) => {
    return (
      collection.chainId === selectedChainId &&
      matchesQuery([collection.name, collection.owners, collection.volume], normalizedQuery)
    );
  });

  const visibleCollections = [...filteredCollections].sort((left, right) => {
    const leftValue =
      sortKey === "dayChange"
        ? parseMetricValue(left.dayChange)
        : parseMetricValue(left[sortKey]);
    const rightValue =
      sortKey === "dayChange"
        ? parseMetricValue(right.dayChange)
        : parseMetricValue(right[sortKey]);

    return sortDirection === "asc" ? leftValue - rightValue : rightValue - leftValue;
  });

  const gasDrift = (gasRefreshIndex % 3) - 1;
  const displayedGasValues = gasModes.reduce<Record<string, number>>((carry, mode) => {
    const selectedModeBoost = selectedGasMode === mode.id ? 1 : 0;
    carry[mode.id] = activeGasProfile.values[mode.id] + gasDrift + selectedModeBoost;
    return carry;
  }, {});

  function handleChainSelect(chainId: string) {
    startTransition(() => {
      setSelectedChainId(chainId);
      setUserMenuOpen(false);
    });
  }

  function handleSort(nextKey: SortKey) {
    if (nextKey === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextKey);
    setSortDirection(nextKey === "dayChange" ? "desc" : "asc");
  }

  function handleResetFilters() {
    setSelectedChainId("ethereum");
    setSearchTerm("");
  }

  function handleFavoriteToggle(slug: string) {
    setFavoriteSlugs((current) => {
      const next = new Set(current);

      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }

      return next;
    });
  }

  return (
    <main className="min-h-dvh bg-[#f3f4f6] px-4 py-4 text-[#1f2937] sm:px-6 sm:py-6">
      <div className="mx-auto flex w-full max-w-[1512px] flex-col gap-6">
        <HeaderSection
          onSearchChange={setSearchTerm}
          onSelectChain={handleChainSelect}
          onToggleUserMenu={() => setUserMenuOpen((current) => !current)}
          searchTerm={searchTerm}
          selectedChain={activeChain}
          userMenuOpen={userMenuOpen}
        />

        <DefiStripSection
          activeChain={activeChain}
          cards={visibleDefiCards}
          favorites={favoriteSlugs}
          onReset={handleResetFilters}
          onToggleFavorite={handleFavoriteToggle}
          query={visibleQuery}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <NftTableSection
          collections={visibleCollections}
          direction={sortDirection}
          onReset={handleResetFilters}
          onSort={handleSort}
          query={visibleQuery}
          sortKey={sortKey}
        />
          <OverviewSection
            activeChain={activeChain}
            countdown={countdown}
            displayedGasValues={displayedGasValues}
            onSelectGasMode={setSelectedGasMode}
            selectedGasMode={selectedGasMode}
          />
        </div>
      </div>
    </main>
  );
}
