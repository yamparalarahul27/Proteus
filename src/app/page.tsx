import Link from "next/link";
import Image from "next/image";

type ComponentCard = {
  href: string;
  title: string;
  description: string;
  color: string;
  status?: "Latest" | "WIP" | "Experience";
};

const components: ComponentCard[] = [
  {
    href: "/numberflow",
    title: "NumberFlow",
    description: "Animated number transitions — currency, percent, compact, countdown, continuous, trend, and stepper variants.",
    color: "#8162ff",
    status: "Latest",
  },
  {
    href: "/floatingdock",
    title: "Floating Component Dock",
    description: "Bottom-center floating utility dock with component menu, copy actions, and theme switcher.",
    color: "#1F2937",
    status: "WIP",
  },
  {
    href: "/agentstatus",
    title: "Agent Status Panels",
    description: "Thinking-stage dotted progress rails plus vesting/volume/temperature control cards.",
    color: "#4B5563",
    status: "WIP",
  },
  {
    href: "/tabpatterns",
    title: "Tab Patterns",
    description: "Modes/personas, primary section tabs, and lightweight filter tab sets.",
    color: "#374151",
    status: "WIP",
  },
  {
    href: "/agenttoasts",
    title: "Agent System Toasts",
    description: "Four large system toasts: run complete, override warning, paused, and delete confirmation.",
    color: "#111827",
    status: "WIP",
  },
  {
    href: "/tokenselector",
    title: "Token Selector Modal",
    description: "Searchable token list modal with top-by-volume rows and keyboard hints.",
    color: "#4B5563",
    status: "WIP",
  },
  {
    href: "/timeframe",
    title: "Timeframe Selector",
    description: "Segmented timeframe pill with 24H, 7D, 30D, 90D, and 1Y options.",
    color: "#6B7280",
    status: "WIP",
  },
  {
    href: "/boneyard",
    title: "Boneyard Skeleton",
    description:
      "Pixel-perfect loading skeleton for a blog card using boneyard-js, with source credit.",
    color: "#57534E",
    status: "WIP",
  },
  {
    href: "/datepicker",
    title: "Date Picker",
    description:
      "Timeline ruler with drag-to-resize, NL text input, and granularity panels.",
    color: "#3B82F6",
    status: "Experience",
  },
  {
    href: "/svgtoc",
    title: "SVG Curved TOC",
    description: "Interactive table of contents with cubic Bezier connectors, clip-path animation, and offset-path demos.",
    color: "#8162ff",
    status: "Latest",
  },
  {
    href: "/friportfolio",
    title: "FRI Portfolio Dashboard",
    description: "Cyberpunk-themed AI agent portfolio with arc reactor, terminal, diagnostics, and directive panels.",
    color: "#5d3ae9",
    status: "WIP",
  },
  {
    href: "/mathcurveloaders",
    title: "Math Curve Loaders",
    description: "Animated loading spinners based on mathematical curves — rose, Lissajous, hypotrochoid, and more.",
    color: "#8162ff",
    status: "Experience",
  },
  {
    href: "/navbar",
    title: "Navbar",
    description: "App logo, navigation links, search input, and user menu with dropdown.",
    color: "#8162ff",
    status: "WIP",
  },
  {
    href: "/chainselector",
    title: "Chain Selector",
    description: "Horizontal pill bar for switching between blockchain networks.",
    color: "#5d3ae9",
    status: "WIP",
  },
  {
    href: "/deficard",
    title: "DeFi Card",
    description: "Protocol cards with price, trend, TVL, favorites toggle, and chain badge.",
    color: "#1D7AFC",
    status: "WIP",
  },
  {
    href: "/nfttable",
    title: "NFT Collections Table",
    description: "Sortable table with volume, floor price, owners, supply columns.",
    color: "#22A06B",
    status: "WIP",
  },
  {
    href: "/gascard",
    title: "Gas Fee Mode Selector",
    description: "Walking, Speed Bike, and Future Car modes with live gwei countdown.",
    color: "#E56910",
    status: "WIP",
  },
  {
    href: "/marketstatcard",
    title: "Market Stats Card",
    description: "Crypto coins count, market cap, and 24h trading volume.",
    color: "#1F845A",
    status: "WIP",
  },
  {
    href: "/dominancebarcard",
    title: "Dominance Bar Card",
    description: "BTC and ETH market dominance with colored progress bars.",
    color: "#374151",
    status: "WIP",
  },
  {
    href: "/transactions",
    title: "Transaction Toast",
    description: "Animated transaction status toast — processing, failed, and success states.",
    color: "#7C3AED",
    status: "WIP",
  },
  {
    href: "/swap-flow",
    title: "Swap Flow",
    description: "Animated token swap interface with step-by-step flow visualization.",
    color: "#EC4899",
    status: "WIP",
  },
  {
    href: "/avatarcreator",
    title: "Avatar Creator",
    description: "Split-tone avatar builder with swatch picker, shuffle action, and custom color add.",
    color: "#9B4EE8",
    status: "WIP",
  },
  {
    href: "/pnlcalendar",
    title: "PnL Calendar",
    description: "Monthly trading calendar with positive/negative day heatmap and paged navigation.",
    color: "#0EA5A4",
    status: "WIP",
  },
  {
    href: "/peektext",
    title: "Peektext",
    description: "Inline text hover reveal that expands a tiny image with smooth transition.",
    color: "#E11D48",
    status: "Latest",
  },
  {
    href: "/folder",
    title: "Folder",
    description: "macOS-style folder icons with glossy gradients, color variants, hover lift, and size options.",
    color: "#5aaaf5",
    status: "Latest",
  },
];

const statusPriority: Record<NonNullable<ComponentCard["status"]>, number> = {
  Latest: 0,
  Experience: 1,
  WIP: 2,
};

const sortedComponents = [...components].sort((a, b) => {
  const aPriority = a.status ? statusPriority[a.status] : Number.POSITIVE_INFINITY;
  const bPriority = b.status ? statusPriority[b.status] : Number.POSITIVE_INFINITY;
  return aPriority - bPriority;
});

export default function CollectionPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-gray-200/60 px-6 py-6 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <Image
            src="/proteus-logo.svg"
            alt="Proteus logo"
            width={1329}
            height={400}
            className="h-auto w-[180px] sm:w-[220px]"
            priority
          />
          <p className="mt-2 text-sm text-gray-500">
            Component Collection by Yamparala Rahul [Design Engineer]
          </p>
        </div>
      </header>

      {/* Grid */}
      <main className="mx-auto max-w-5xl px-6 py-8 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedComponents.map((comp) => (
            <Link
              key={comp.href}
              href={comp.href}
              className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5"
            >
              {/* Color accent bar */}
              <div
                className="absolute left-0 top-0 h-1 w-full rounded-t-xl"
                style={{ backgroundColor: comp.color }}
              />

              <div>
                <div className="mt-1 flex items-start justify-between gap-2">
                  <h2 className="text-base font-semibold text-gray-800 transition-colors group-hover:text-[#5d3ae9]">
                    {comp.title}
                  </h2>
                  {comp.status ? (
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        comp.status === "Latest"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : comp.status === "Experience"
                            ? "border-sky-200 bg-sky-50 text-sky-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {comp.status}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
                  {comp.description}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-[#8162ff] transition-colors">
                <span>View component</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  <path
                    d="M5.5 3L10.5 8L5.5 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
