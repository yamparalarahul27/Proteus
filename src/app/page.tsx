import Link from "next/link";

const components = [
  {
    href: "/navbar",
    title: "Navbar",
    description: "App logo, navigation links, search input, and user menu with dropdown.",
    color: "#8162ff",
  },
  {
    href: "/chainselector",
    title: "Chain Selector",
    description: "Horizontal pill bar for switching between blockchain networks.",
    color: "#5d3ae9",
  },
  {
    href: "/deficard",
    title: "DeFi Card",
    description: "Protocol cards with price, trend, TVL, favorites toggle, and chain badge.",
    color: "#1D7AFC",
  },
  {
    href: "/nfttable",
    title: "NFT Collections Table",
    description: "Sortable table with volume, floor price, owners, supply columns.",
    color: "#22A06B",
  },
  {
    href: "/gascard",
    title: "Gas Fee Mode Selector",
    description: "Walking, Speed Bike, and Future Car modes with live gwei countdown.",
    color: "#E56910",
  },
  {
    href: "/marketstatcard",
    title: "Market Stats Card",
    description: "Crypto coins count, market cap, and 24h trading volume.",
    color: "#1F845A",
  },
  {
    href: "/dominancebarcard",
    title: "Dominance Bar Card",
    description: "BTC and ETH market dominance with colored progress bars.",
    color: "#374151",
  },
  {
    href: "/datepicker",
    title: "Date Picker",
    description:
      "Timeline ruler with drag-to-resize, NL text input, and granularity panels.",
    color: "#3B82F6",
  },
  {
    href: "/transactions",
    title: "Transaction Toast",
    description: "Animated transaction status toast — processing, failed, and success states.",
    color: "#7C3AED",
  },
  {
    href: "/swap-flow",
    title: "Swap Flow",
    description: "Animated token swap interface with step-by-step flow visualization.",
    color: "#EC4899",
  },
  {
    href: "/avatarcreator",
    title: "Avatar Creator",
    description: "Split-tone avatar builder with swatch picker, shuffle action, and custom color add.",
    color: "#9B4EE8",
  },
];

export default function CollectionPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-gray-200/60 px-6 py-6 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-[10px]">
            <div className="relative flex h-[31.794px] w-[31.794px] items-center justify-center rounded-[7.337px] bg-gradient-to-b from-[#8162ff] to-[#5d3ae9]">
              <span className="font-brand text-[24.914px] leading-[1.3] tracking-[0.7474px] text-white">
                Pr
              </span>
            </div>
            <span className="text-[17.046px] font-semibold tracking-[0.5114px] text-[#1f2937]">
              Proteus
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Component collection — click any card to view the interactive demo.
          </p>
        </div>
      </header>

      {/* Grid */}
      <main className="mx-auto max-w-5xl px-6 py-8 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((comp) => (
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
                <h2 className="mt-1 text-base font-semibold text-gray-800 group-hover:text-[#5d3ae9] transition-colors">
                  {comp.title}
                </h2>
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
