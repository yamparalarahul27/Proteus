/* eslint-disable @next/next/no-img-element */
"use client";

import { Bell, Feather, Moon, Newspaper, Star, Sun } from "lucide-react";
import { useRef, useState } from "react";
import ComponentShell from "@/components/ComponentShell";
import { cn } from "@/lib/utils";

type Trend = "up" | "down";
type SortDirection = "asc" | "desc";
type SortKey = "price" | "changePct" | "volume" | "marketCap" | "volScore";
type SwipeAction = "news" | "trade" | "alerts";

type NftCollection = {
  changePct: string;
  image: string;
  marketCap: string;
  name: string;
  price: string;
  slug: string;
  trend: Trend;
  volScore: string;
  volume: string;
};

const nftCollections: NftCollection[] = [
  {
    changePct: "+5.92%",
    image: "/proteus/nft/leaguefast.png",
    marketCap: "$94.3B",
    name: "LeagueFast",
    price: "$100.80",
    slug: "leaguefast",
    trend: "up",
    volScore: "5.01%",
    volume: "11.20B",
  },
  {
    changePct: "+5.92%",
    image: "/proteus/nft/otherdeed.png",
    marketCap: "$283T",
    name: "Otherdeed",
    price: "$0.99",
    slug: "otherdeed-for-otherside",
    trend: "up",
    volScore: "0.01%",
    volume: "121.20B",
  },
  {
    changePct: "-3.21%",
    image: "/proteus/nft/azuki.png",
    marketCap: "$94.3B",
    name: "Azuki",
    price: "$10.80",
    slug: "azuki",
    trend: "down",
    volScore: "—",
    volume: "11.20B",
  },
];

const CODE_CONTENT = `/* eslint-disable @next/next/no-img-element */
"use client";

import { Bell, Feather, Moon, Newspaper, Star, Sun } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Trend = "up" | "down";
type SortDirection = "asc" | "desc";
type SortKey = "price" | "changePct" | "volume" | "marketCap" | "volScore";
type SwipeAction = "news" | "trade" | "alerts";

type NftCollection = {
  changePct: string;
  image: string;
  marketCap: string;
  name: string;
  price: string;
  slug: string;
  trend: Trend;
  volScore: string;
  volume: string;
};

const nftCollections: NftCollection[] = [
  {
    changePct: "+5.92%",
    image: "/proteus/nft/leaguefast.png",
    marketCap: "\$94.3B",
    name: "LeagueFast",
    price: "\$100.80",
    slug: "leaguefast",
    trend: "up",
    volScore: "5.01%",
    volume: "11.20B",
  },
  {
    changePct: "+5.92%",
    image: "/proteus/nft/otherdeed.png",
    marketCap: "\$283T",
    name: "Otherdeed",
    price: "\$0.99",
    slug: "otherdeed-for-otherside",
    trend: "up",
    volScore: "0.01%",
    volume: "121.20B",
  },
  // ... more collections
];

const ACTION_REVEAL_WIDTH = 186;
const BOOKMARK_REVEAL_WIDTH = 84;

function parseMetricValue(value: string) {
  const cleaned = value.replace(/[\$,%]/g, "").trim();
  const suffix = cleaned.slice(-1).toUpperCase();
  const baseValue = Number.parseFloat(cleaned);
  if (Number.isNaN(baseValue)) return 0;
  if (suffix === "K") return baseValue * 1_000;
  if (suffix === "M") return baseValue * 1_000_000;
  if (suffix === "B") return baseValue * 1_000_000_000;
  if (suffix === "T") return baseValue * 1_000_000_000_000;
  return baseValue;
}

function ColumnHeader({
  active, direction, isDark, label, onSort,
}: {
  active: boolean; direction: SortDirection; isDark: boolean; label: string; onSort: () => void;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-1 text-left text-[12px] font-medium tracking-[0.2px] transition-colors",
        active ? (isDark ? "text-[#d5d7dc]" : "text-[#1f2937]") : (isDark ? "text-[#73767d]" : "text-[#6b7280]"),
      )}
      onClick={onSort}
      type="button"
    >
      <span>{label}</span>
      <span className={cn("text-[10px] transition-transform", isDark ? "text-[#61656d]" : "text-[#9ca3af]", active && direction === "asc" ? "rotate-180" : "")}>
        ▾
      </span>
    </button>
  );
}

function SwipeableRow({ collection, isDark }: { collection: NftCollection; isDark: boolean }) {
  const [offsetX, setOffsetX] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const movedRef = useRef(false);

  const bookmarkPreview = offsetX <= -40 || bookmarked;

  function snapOffset(rawOffset: number) {
    if (rawOffset >= 74) return ACTION_REVEAL_WIDTH;
    if (rawOffset <= -44) return -BOOKMARK_REVEAL_WIDTH;
    return 0;
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerIdRef.current = event.pointerId;
    startXRef.current = event.clientX;
    startOffsetRef.current = offsetX;
    movedRef.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) return;
    const delta = event.clientX - startXRef.current;
    if (Math.abs(delta) > 4) movedRef.current = true;
    const next = Math.max(-BOOKMARK_REVEAL_WIDTH, Math.min(ACTION_REVEAL_WIDTH, startOffsetRef.current + delta));
    setOffsetX(next);
  }

  function finalizeDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    pointerIdRef.current = null;
    setIsDragging(false);
    const snapped = snapOffset(offsetX);
    setOffsetX(snapped);
    if (snapped === -BOOKMARK_REVEAL_WIDTH) setBookmarked(true);
  }

  function handleActionClick(action: SwipeAction) {
    if (action === "alerts") setBookmarked(true);
    setOffsetX(0);
  }

  function toggleBookmark() {
    setBookmarked((prev) => !prev);
    setOffsetX(0);
  }

  return (
    <div className="relative h-[74px] overflow-hidden rounded-[14px]">
      {/* Left actions (revealed on right drag) */}
      <div className="absolute inset-y-0 left-0 flex w-[186px] overflow-hidden rounded-l-[14px]">
        <button className="font-pixel flex w-1/3 flex-col items-center justify-center gap-1 bg-[#8D78EE] text-[13px] text-white" onClick={() => handleActionClick("news")} type="button">
          <Newspaper size={14} /><span>News</span>
        </button>
        <button className="font-pixel flex w-1/3 flex-col items-center justify-center gap-1 bg-[#CBEF47] text-[13px] font-medium text-[#111316]" onClick={() => handleActionClick("trade")} type="button">
          <Feather size={14} /><span>Trade</span>
        </button>
        <button className="font-pixel flex w-1/3 flex-col items-center justify-center gap-1 bg-[#141519] text-[13px] text-[#e4e7ec]" onClick={() => handleActionClick("alerts")} type="button">
          <Bell size={14} /><span>Alerts</span>
        </button>
      </div>

      {/* Right bookmark action (revealed on left drag) */}
      <button
        className={cn("absolute inset-y-0 right-0 flex w-[84px] items-center justify-center rounded-r-[14px]", isDark ? "bg-[#131418]" : "bg-[#e9edf4]")}
        onClick={toggleBookmark}
        type="button"
      >
        <Star className={cn("text-[#ffdb58] transition-all duration-200", bookmarkPreview ? "scale-110" : "scale-95")} fill={bookmarkPreview ? "currentColor" : "none"} size={26} strokeWidth={2.1} />
      </button>

      {/* Swipeable row content */}
      <div
        className={cn(
          "absolute inset-0 grid cursor-grab grid-cols-[minmax(190px,1.2fr)_110px_120px_120px_130px_96px] items-center rounded-[14px] px-4 transition-transform duration-200",
          isDark ? "border border-transparent bg-[#050608] text-[#dbdde2]" : "border border-[#e5e8ee] bg-white text-[#1f2937]",
          isDragging ? "cursor-grabbing transition-none" : "",
        )}
        onPointerCancel={finalizeDrag}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finalizeDrag}
        style={{ transform: \`translateX(\${offsetX}px)\`, touchAction: "pan-y" }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <img alt={collection.name} className="h-10 w-10 rounded-full object-cover" draggable={false} src={collection.image} />
          <span className={cn("truncate text-[15px] font-medium", isDark ? "text-[#e6e8eb]" : "text-[#111827]")}>{collection.name}</span>
        </div>
        <span className={cn("text-[13px] font-semibold", isDark ? "text-[#d8dbe0]" : "text-[#1f2937]")}>{collection.price}</span>
        <span className={cn("inline-flex w-fit rounded-full px-2.5 py-1 text-[13px] font-semibold",
          collection.trend === "up" ? (isDark ? "bg-[#0b2a1d] text-[#49d48a]" : "bg-[#e8f8ef] text-[#16995d]") : (isDark ? "bg-[#321418] text-[#e15d6e]" : "bg-[#fdecee] text-[#dc4b5f]"),
        )}>{collection.changePct}</span>
        <span className={cn("text-[13px] font-semibold", isDark ? "text-[#d8dbe0]" : "text-[#1f2937]")}>{collection.volume}</span>
        <span className={cn("text-[13px] font-semibold", isDark ? "text-[#d8dbe0]" : "text-[#1f2937]")}>{collection.marketCap}</span>
        <span className={cn("text-[13px] font-semibold", isDark ? "text-[#d8dbe0]" : "text-[#1f2937]")}>{collection.volScore}</span>
      </div>
    </div>
  );
}

function NftTableSection() {
  const [sortKey, setSortKey] = useState<SortKey>("volume");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [isDark, setIsDark] = useState(false);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDirection("desc"); }
  }

  const sortedCollections = [...nftCollections].sort((a, b) => {
    const valueMap: Record<SortKey, [string, string]> = {
      price: [a.price, b.price], changePct: [a.changePct, b.changePct],
      volume: [a.volume, b.volume], marketCap: [a.marketCap, b.marketCap], volScore: [a.volScore, b.volScore],
    };
    const [aVal, bVal] = valueMap[sortKey];
    const diff = parseMetricValue(aVal) - parseMetricValue(bVal);
    return sortDirection === "asc" ? diff : -diff;
  });

  return (
    <section className={cn("w-full max-w-6xl rounded-[22px] border p-4 sm:p-6",
      isDark ? "border-[#181a1f] bg-[#020306] shadow-[0_20px_55px_rgba(0,0,0,0.36)]" : "border-[#e3e7ee] bg-[#f8f9fc] shadow-[0_16px_35px_rgba(15,23,42,0.08)]",
    )}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className={cn("text-sm font-semibold", isDark ? "text-[#d7dae0]" : "text-[#111827]")}>NFT Collection Table</h2>
          <button type="button" onClick={() => setIsDark((prev) => !prev)} className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
            isDark ? "border-[#2b3039] bg-[#0d1117] text-[#cbd5e1] hover:bg-[#111721]" : "border-[#d8dde6] bg-white text-[#334155] hover:bg-[#f8fafc]",
          )} aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}>
            {isDark ? <Sun size={12} /> : <Moon size={12} />}
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </div>
      <div className="overflow-x-auto pb-1 hide-scrollbar">
        <div className="min-w-[860px]">
          <div className={cn("grid grid-cols-[minmax(190px,1.2fr)_110px_120px_120px_130px_96px] items-center rounded-[14px] border px-4 py-4",
            isDark ? "border-[#101217] bg-[#07090d]" : "border-[#e5e9f0] bg-[#f1f3f8]",
          )}>
            <span className={cn("text-[12px] font-medium tracking-[0.22px]", isDark ? "text-[#6e737d]" : "text-[#6b7280]")}>Symbol</span>
            <ColumnHeader active={sortKey === "price"} direction={sortDirection} isDark={isDark} label="Price" onSort={() => handleSort("price")} />
            <ColumnHeader active={sortKey === "changePct"} direction={sortDirection} isDark={isDark} label="Change(%)" onSort={() => handleSort("changePct")} />
            <ColumnHeader active={sortKey === "volume"} direction={sortDirection} isDark={isDark} label="Volume" onSort={() => handleSort("volume")} />
            <ColumnHeader active={sortKey === "marketCap"} direction={sortDirection} isDark={isDark} label="MarketCap" onSort={() => handleSort("marketCap")} />
            <ColumnHeader active={sortKey === "volScore"} direction={sortDirection} isDark={isDark} label="Vol. Score" onSort={() => handleSort("volScore")} />
          </div>
          <div className="mt-3 space-y-2">
            {sortedCollections.map((collection) => (
              <SwipeableRow key={collection.slug} collection={collection} isDark={isDark} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function NftTablePage() {
  return <NftTableSection />;
}`;

const PROMPT_CONTENT = `Add row-level swipe interactions to an NFT table:
- Drag left on a row to reveal Bookmark and activate it (unfilled star -> filled star with scale animation).
- Drag right on a row to reveal 3 actions on the left: News, Trade, and Alerts.
- Keep interactions per-row and responsive for both desktop and mobile.
- Keep light theme as default and include a dark-mode toggle.
- Add UI credit to https://x.com/rndr_realm.`;

const ACTION_REVEAL_WIDTH = 186;
const BOOKMARK_REVEAL_WIDTH = 84;

function parseMetricValue(value: string) {
  const cleaned = value.replace(/[$,%]/g, "").trim();
  const suffix = cleaned.slice(-1).toUpperCase();
  const baseValue = Number.parseFloat(cleaned);
  if (Number.isNaN(baseValue)) return 0;
  if (suffix === "K") return baseValue * 1_000;
  if (suffix === "M") return baseValue * 1_000_000;
  if (suffix === "B") return baseValue * 1_000_000_000;
  if (suffix === "T") return baseValue * 1_000_000_000_000;
  return baseValue;
}

function ColumnHeader({
  active,
  direction,
  isDark,
  label,
  onSort,
}: {
  active: boolean;
  direction: SortDirection;
  isDark: boolean;
  label: string;
  onSort: () => void;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-1 text-left text-[12px] font-medium tracking-[0.2px] transition-colors",
        active
          ? isDark
            ? "text-[#d5d7dc]"
            : "text-[#1f2937]"
          : isDark
            ? "text-[#73767d]"
            : "text-[#6b7280]",
      )}
      onClick={onSort}
      type="button"
    >
      <span>{label}</span>
      <span
        className={cn(
          "text-[10px] transition-transform",
          isDark ? "text-[#61656d]" : "text-[#9ca3af]",
          active && direction === "asc" ? "rotate-180" : "",
        )}
      >
        ▾
      </span>
    </button>
  );
}

function SwipeableRow({
  collection,
  isDark,
}: {
  collection: NftCollection;
  isDark: boolean;
}) {
  const [offsetX, setOffsetX] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const movedRef = useRef(false);

  const bookmarkPreview = offsetX <= -40 || bookmarked;

  function snapOffset(rawOffset: number) {
    if (rawOffset >= 74) return ACTION_REVEAL_WIDTH;
    if (rawOffset <= -44) return -BOOKMARK_REVEAL_WIDTH;
    return 0;
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerIdRef.current = event.pointerId;
    startXRef.current = event.clientX;
    startOffsetRef.current = offsetX;
    movedRef.current = false;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) return;
    const delta = event.clientX - startXRef.current;
    if (Math.abs(delta) > 4) {
      movedRef.current = true;
    }

    const next = Math.max(
      -BOOKMARK_REVEAL_WIDTH,
      Math.min(ACTION_REVEAL_WIDTH, startOffsetRef.current + delta),
    );
    setOffsetX(next);
  }

  function finalizeDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    pointerIdRef.current = null;
    setIsDragging(false);

    const snapped = snapOffset(offsetX);
    setOffsetX(snapped);
    if (snapped === -BOOKMARK_REVEAL_WIDTH) {
      setBookmarked(true);
    }
  }

  function handleActionClick(action: SwipeAction) {
    if (action === "alerts") {
      setBookmarked(true);
    }
    setOffsetX(0);
  }

  function toggleBookmark() {
    setBookmarked((previous) => !previous);
    setOffsetX(0);
  }

  return (
    <div className="relative h-[74px] overflow-hidden rounded-[14px]">
      {/* Left actions (revealed on right drag) */}
      <div className="absolute inset-y-0 left-0 flex w-[186px] overflow-hidden rounded-l-[14px]">
        <button
          className="font-pixel flex w-1/3 flex-col items-center justify-center gap-1 bg-[#8D78EE] text-[13px] text-white"
          onClick={() => handleActionClick("news")}
          type="button"
        >
          <Newspaper size={14} />
          <span>News</span>
        </button>
        <button
          className="font-pixel flex w-1/3 flex-col items-center justify-center gap-1 bg-[#CBEF47] text-[13px] font-medium text-[#111316]"
          onClick={() => handleActionClick("trade")}
          type="button"
        >
          <Feather size={14} />
          <span>Trade</span>
        </button>
        <button
          className="font-pixel flex w-1/3 flex-col items-center justify-center gap-1 bg-[#141519] text-[13px] text-[#e4e7ec]"
          onClick={() => handleActionClick("alerts")}
          type="button"
        >
          <Bell size={14} />
          <span>Alerts</span>
        </button>
      </div>

      {/* Right bookmark action (revealed on left drag) */}
      <button
        className={cn(
          "absolute inset-y-0 right-0 flex w-[84px] items-center justify-center rounded-r-[14px]",
          isDark ? "bg-[#131418]" : "bg-[#e9edf4]",
        )}
        onClick={toggleBookmark}
        type="button"
      >
        <Star
          className={cn(
            "text-[#ffdb58] transition-all duration-200",
            bookmarkPreview ? "scale-110" : "scale-95",
          )}
          fill={bookmarkPreview ? "currentColor" : "none"}
          size={26}
          strokeWidth={2.1}
        />
      </button>

      {/* Swipeable row content */}
      <div
        className={cn(
          "absolute inset-0 grid cursor-grab grid-cols-[minmax(190px,1.2fr)_110px_120px_120px_130px_96px] items-center rounded-[14px] px-4 transition-transform duration-200",
          isDark
            ? "border border-transparent bg-[#050608] text-[#dbdde2]"
            : "border border-[#e5e8ee] bg-white text-[#1f2937]",
          isDragging ? "cursor-grabbing transition-none" : "",
        )}
        onPointerCancel={finalizeDrag}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finalizeDrag}
        style={{ transform: `translateX(${offsetX}px)`, touchAction: "pan-y" }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <img
            alt={collection.name}
            className="h-10 w-10 rounded-full object-cover"
            draggable={false}
            src={collection.image}
          />
          <span
            className={cn(
              "truncate text-[15px] font-medium",
              isDark ? "text-[#e6e8eb]" : "text-[#111827]",
            )}
            onClick={(event) => {
              if (movedRef.current) {
                event.preventDefault();
              }
            }}
          >
            {collection.name}
          </span>
        </div>

        <span className={cn("text-[13px] font-semibold", isDark ? "text-[#d8dbe0]" : "text-[#1f2937]")}>
          {collection.price}
        </span>
        <span
          className={cn(
            "inline-flex w-fit rounded-full px-2.5 py-1 text-[13px] font-semibold",
            collection.trend === "up"
              ? isDark
                ? "bg-[#0b2a1d] text-[#49d48a]"
                : "bg-[#e8f8ef] text-[#16995d]"
              : isDark
                ? "bg-[#321418] text-[#e15d6e]"
                : "bg-[#fdecee] text-[#dc4b5f]",
          )}
        >
          {collection.changePct}
        </span>
        <span className={cn("text-[13px] font-semibold", isDark ? "text-[#d8dbe0]" : "text-[#1f2937]")}>
          {collection.volume}
        </span>
        <span className={cn("text-[13px] font-semibold", isDark ? "text-[#d8dbe0]" : "text-[#1f2937]")}>
          {collection.marketCap}
        </span>
        <span className={cn("text-[13px] font-semibold", isDark ? "text-[#d8dbe0]" : "text-[#1f2937]")}>
          {collection.volScore}
        </span>
      </div>
    </div>
  );
}

function NftTableSection() {
  const [sortKey, setSortKey] = useState<SortKey>("volume");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [isDark, setIsDark] = useState(false);

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
      price: [a.price, b.price],
      changePct: [a.changePct, b.changePct],
      volume: [a.volume, b.volume],
      marketCap: [a.marketCap, b.marketCap],
      volScore: [a.volScore, b.volScore],
    };
    const [aVal, bVal] = valueMap[sortKey];
    const diff = parseMetricValue(aVal) - parseMetricValue(bVal);
    return sortDirection === "asc" ? diff : -diff;
  });

  return (
    <section
      className={cn(
        "w-full max-w-6xl rounded-[22px] border p-4 sm:p-6",
        isDark
          ? "border-[#181a1f] bg-[#020306] shadow-[0_20px_55px_rgba(0,0,0,0.36)]"
          : "border-[#e3e7ee] bg-[#f8f9fc] shadow-[0_16px_35px_rgba(15,23,42,0.08)]",
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className={cn("text-sm font-semibold", isDark ? "text-[#d7dae0]" : "text-[#111827]")}>
            NFT Collection Table
          </h2>
          <button
            type="button"
            onClick={() => setIsDark((previous) => !previous)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
              isDark
                ? "border-[#2b3039] bg-[#0d1117] text-[#cbd5e1] hover:bg-[#111721]"
                : "border-[#d8dde6] bg-white text-[#334155] hover:bg-[#f8fafc]",
            )}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          >
            {isDark ? <Sun size={12} /> : <Moon size={12} />}
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
        <a
          href="https://x.com/rndr_realm"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "text-xs underline",
            isDark
              ? "text-[#8f949f] hover:text-[#c8ccd3]"
              : "text-[#6b7280] hover:text-[#374151]",
          )}
        >
          Credit: @rndr_realm
        </a>
      </div>

      <div className="overflow-x-auto pb-1 hide-scrollbar">
        <div className="min-w-[860px]">
          <div
            className={cn(
              "grid grid-cols-[minmax(190px,1.2fr)_110px_120px_120px_130px_96px] items-center rounded-[14px] border px-4 py-4",
              isDark
                ? "border-[#101217] bg-[#07090d]"
                : "border-[#e5e9f0] bg-[#f1f3f8]",
            )}
          >
            <span
              className={cn(
                "text-[12px] font-medium tracking-[0.22px]",
                isDark ? "text-[#6e737d]" : "text-[#6b7280]",
              )}
            >
              Symbol
            </span>
            <ColumnHeader
              active={sortKey === "price"}
              direction={sortDirection}
              isDark={isDark}
              label="Price"
              onSort={() => handleSort("price")}
            />
            <ColumnHeader
              active={sortKey === "changePct"}
              direction={sortDirection}
              isDark={isDark}
              label="Change(%)"
              onSort={() => handleSort("changePct")}
            />
            <ColumnHeader
              active={sortKey === "volume"}
              direction={sortDirection}
              isDark={isDark}
              label="Volume"
              onSort={() => handleSort("volume")}
            />
            <ColumnHeader
              active={sortKey === "marketCap"}
              direction={sortDirection}
              isDark={isDark}
              label="MarketCap"
              onSort={() => handleSort("marketCap")}
            />
            <ColumnHeader
              active={sortKey === "volScore"}
              direction={sortDirection}
              isDark={isDark}
              label="Vol. Score"
              onSort={() => handleSort("volScore")}
            />
          </div>

          <div className="mt-3 space-y-2">
            {sortedCollections.map((collection) => (
              <SwipeableRow key={collection.slug} collection={collection} isDark={isDark} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function NftTablePage() {
  return (
    <ComponentShell
      title="NFT Collections Table"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <NftTableSection />
    </ComponentShell>
  );
}
