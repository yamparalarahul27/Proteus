/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Undo2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Trend = "up" | "down";
type SortDirection = "asc" | "desc";
type SortKey = "volume" | "dayChange" | "floorPrice" | "owners" | "supply";

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

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const nftCollections: NftCollection[] = [
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
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parseMetricValue(value: string) {
  const cleaned = value.replace(/[$,%]/g, "").trim();
  const suffix = cleaned.slice(-1).toUpperCase();
  const baseValue = Number.parseFloat(cleaned);
  if (Number.isNaN(baseValue)) return 0;
  if (suffix === "K") return baseValue * 1_000;
  if (suffix === "M") return baseValue * 1_000_000;
  if (suffix === "B") return baseValue * 1_000_000_000;
  return baseValue;
}

// ---------------------------------------------------------------------------
// ColumnHeader
// ---------------------------------------------------------------------------
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
      <span className="text-[12px] font-medium tracking-[0.24px]">
        {label}
      </span>
      <img
        alt=""
        aria-hidden="true"
        className={`h-6 w-6 transition-transform ${active && direction === "asc" ? "rotate-180" : ""}`}
        src="/proteus/nft/column-chevron.svg"
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// NftTableSection
// ---------------------------------------------------------------------------
function NftTableSection() {
  const [sortKey, setSortKey] = useState<SortKey>("volume");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  }

  const sortedCollections = [...nftCollections].sort((a, b) => {
    const valueMap: Record<SortKey, [string, string]> = {
      volume: [a.volume, b.volume],
      dayChange: [a.dayChange, b.dayChange],
      floorPrice: [a.floorPrice, b.floorPrice],
      owners: [a.owners, b.owners],
      supply: [a.supply, b.supply],
    };
    const [aVal, bVal] = valueMap[sortKey];
    const diff = parseMetricValue(aVal) - parseMetricValue(bVal);
    return sortDirection === "asc" ? diff : -diff;
  });

  return (
    <section className="w-full max-w-3xl rounded-2xl bg-[#f3f4f6] p-5">
      <h2 className="mb-4 text-sm font-semibold text-[#1f2937]">
        Popular NFT Collection
      </h2>

      {/* Table header */}
      <div className="flex items-center gap-2 border-b border-gray-300 pb-2">
        <span className="w-[160px] text-[12px] font-medium tracking-[0.24px] text-[#6b7280]">
          Collection
        </span>
        <ColumnHeader
          active={sortKey === "volume"}
          direction={sortDirection}
          label="24h Volume"
          onSort={() => handleSort("volume")}
          width="w-[100px]"
        />
        <ColumnHeader
          active={sortKey === "dayChange"}
          direction={sortDirection}
          label="1 Day %"
          onSort={() => handleSort("dayChange")}
          width="w-[90px]"
        />
        <ColumnHeader
          active={sortKey === "floorPrice"}
          direction={sortDirection}
          label="Floor Price"
          onSort={() => handleSort("floorPrice")}
          width="w-[100px]"
        />
        <ColumnHeader
          active={sortKey === "owners"}
          direction={sortDirection}
          label="Owners"
          onSort={() => handleSort("owners")}
          width="w-[80px]"
        />
        <ColumnHeader
          active={sortKey === "supply"}
          direction={sortDirection}
          label="Supply"
          onSort={() => handleSort("supply")}
          width="w-[80px]"
        />
      </div>

      {/* Table rows */}
      <div className="mt-1">
        {sortedCollections.map((collection) => (
          <div
            key={collection.slug}
            className="flex items-center gap-2 py-3 border-b border-gray-200 last:border-b-0"
          >
            {/* Collection name + image */}
            <div className="flex w-[160px] items-center gap-2">
              <img
                alt={collection.name}
                className="h-8 w-8 rounded-full object-cover"
                src={collection.image}
              />
              <Link
                href={`/nft/${collection.slug}`}
                className="truncate text-[13px] font-medium text-[#1f2937] hover:underline"
              >
                {collection.name}
              </Link>
            </div>

            {/* Volume */}
            <span
              className={`w-[100px] text-[13px] text-[#1f2937] ${collection.useRoboto ? "font-mono" : ""}`}
            >
              {collection.volume}
            </span>

            {/* Day change */}
            <span
              className={`w-[90px] text-[13px] font-medium ${
                collection.trend === "up"
                  ? "text-[#16a34a]"
                  : "text-[#dc2626]"
              }`}
            >
              {collection.dayChange}
            </span>

            {/* Floor price */}
            <span
              className={`w-[100px] text-[13px] text-[#1f2937] ${collection.useRoboto ? "font-mono" : ""}`}
            >
              {collection.floorPrice}
            </span>

            {/* Owners */}
            <span className="w-[80px] text-[13px] text-[#1f2937]">
              {collection.owners}
            </span>

            {/* Supply */}
            <span className="w-[80px] text-[13px] text-[#1f2937]">
              {collection.supply}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function NftTablePage() {
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
          NFT Collections Table
        </h1>
        <NftTableSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 px-4 py-4" />
    </div>
  );
}
