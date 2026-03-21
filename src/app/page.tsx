/* eslint-disable @next/next/no-img-element */

type Trend = "up" | "down";

type NavItem = {
  label: string;
  icon?: string;
  active?: boolean;
  kind?: "defi" | "nft";
};

type Chain = {
  icon: string;
  label?: string;
  active?: boolean;
};

type DefiCard = {
  name: string;
  symbol: string;
  price: string;
  change: string;
  trend: Trend;
  image: string;
  tvl: string;
  highlight?: boolean;
};

type NftCollection = {
  image: string;
  name: string;
  volume: string;
  dayChange: string;
  floorPrice: string;
  owners: string;
  supply: string;
  trend: Trend;
  useRoboto?: boolean;
};

type GasMode = {
  label: string;
  speed: string;
  priceLabel: string;
  gwei: string;
  tone: string;
  textColor: string;
  image: string;
  imageClassName: string;
  duplicate?: boolean;
};

type MarketStat = {
  label: string;
  value: string;
};

type DominanceBar = {
  icon: string;
  label: string;
  value: string;
  background: string;
  textColor: string;
  width: number;
};

const navItems: NavItem[] = [
  { label: "Home", icon: "/proteus/header/nav-home.svg", active: true },
  { label: "Assets", icon: "/proteus/header/nav-assets.svg" },
  { label: "DeFi", kind: "defi" },
  { label: "NFT", kind: "nft" },
  {
    label: "Transactions",
    icon: "/proteus/header/nav-transactions.svg",
  },
];

const chains: Chain[] = [
  {
    icon: "/proteus/header/chain-ethereum.svg",
    label: "Ethereum",
    active: true,
  },
  { icon: "/proteus/header/chain-solana.svg" },
  { icon: "/proteus/header/chain-bitcoin.svg" },
  { icon: "/proteus/header/chain-4.svg" },
  { icon: "/proteus/header/chain-5.svg" },
  { icon: "/proteus/header/chain-6.svg" },
  { icon: "/proteus/header/chain-7.svg" },
  { icon: "/proteus/header/chain-8.svg" },
];

const defiCards: DefiCard[] = [
  {
    name: "Uniswap",
    symbol: "UNI",
    price: "$6.13",
    change: "0.25%",
    trend: "up",
    image: "/proteus/defi/uniswap.png",
    tvl: "$323M",
  },
  {
    name: "LIDO",
    symbol: "LDO",
    price: "$1.09",
    change: "1.96%",
    trend: "down",
    image: "/proteus/defi/lido.png",
    tvl: "$25.56B",
  },
  {
    name: "Aave V3",
    symbol: "AAVE",
    price: "$95.22",
    change: "2.93%",
    trend: "down",
    image: "/proteus/defi/aave.png",
    tvl: "$9.83B",
  },
  {
    name: "Curve",
    symbol: "CRV",
    price: "$0.25",
    change: "1.13%",
    trend: "up",
    image: "/proteus/defi/curve.png",
    tvl: "$1.5B",
  },
  {
    name: "Uniswap",
    symbol: "UNI",
    price: "$6.13",
    change: "0.25%",
    trend: "up",
    image: "/proteus/defi/fifth-card.png",
    tvl: "$97.6M",
    highlight: true,
  },
];

const nftCollections: NftCollection[] = [
  {
    image: "/proteus/nft/frogana.png",
    name: "Frogana",
    volume: "397",
    dayChange: "+29.89%",
    floorPrice: "0.027",
    owners: "5.3K",
    supply: "10.0K",
    trend: "up",
  },
  {
    image: "/proteus/nft/leaguefast.png",
    name: "LeagueFast",
    volume: "124",
    dayChange: "-9.09%",
    floorPrice: "0.047",
    owners: "6.1K",
    supply: "26.0K",
    trend: "down",
    useRoboto: true,
  },
  {
    image: "/proteus/nft/otherdeed.png",
    name: "Otherdeed for Otherside",
    volume: "567",
    dayChange: "+13.11%",
    floorPrice: "0.025",
    owners: "9.8K",
    supply: "14.0K",
    trend: "up",
    useRoboto: true,
  },
  {
    image: "/proteus/nft/azuki.png",
    name: "Azuki",
    volume: "123",
    dayChange: "+10.66%",
    floorPrice: "0.039",
    owners: "2.1K",
    supply: "45.0K",
    trend: "up",
    useRoboto: true,
  },
  {
    image: "/proteus/nft/infamous.png",
    name: "Infamous - Clearance Passes",
    volume: "256",
    dayChange: "-03.83%",
    floorPrice: "0.021",
    owners: "4.6K",
    supply: "14.0K",
    trend: "down",
    useRoboto: true,
  },
  {
    image: "/proteus/nft/cryptopunks.png",
    name: "CryptoPunks",
    volume: "645",
    dayChange: "+30.69%",
    floorPrice: "0.089",
    owners: "6.3K",
    supply: "34.0K",
    trend: "up",
    useRoboto: true,
  },
  {
    image: "/proteus/nft/bored-ape-kennel.png",
    name: "Bored Ape Kennel",
    volume: "86",
    dayChange: "-02.19%",
    floorPrice: "0.017",
    owners: "1.4K",
    supply: "16.0K",
    trend: "down",
    useRoboto: true,
  },
];

const gasModes: GasMode[] = [
  {
    label: "Walking",
    speed: "Low Speed",
    priceLabel: "$1.05 | ~ 30 secs",
    gwei: "31",
    tone: "#FFF3EB",
    textColor: "#E56910",
    image: "/proteus/overview/walker.png",
    imageClassName: "h-[40px] w-[23px] object-contain",
    duplicate: true,
  },
  {
    label: "Speed Bike",
    speed: "Average Speed",
    priceLabel: "$1.05 | ~ 30 secs",
    gwei: "32",
    tone: "#DCFFF1",
    textColor: "#22A06B",
    image: "/proteus/overview/bike.png",
    imageClassName: "h-[38px] w-[87px] object-contain",
  },
  {
    label: "Future Car",
    speed: "High Speed",
    priceLabel: "$1.05 | ~ 30 secs",
    gwei: "34",
    tone: "#E9F2FF",
    textColor: "#1D7AFC",
    image: "/proteus/overview/car.png",
    imageClassName: "h-[50px] w-[101px] object-contain -mt-2",
  },
];

const marketStats: MarketStat[] = [
  { label: "Crypto Coins", value: "21,497" },
  { label: "Need change", value: "521" },
  { label: "Market Cap", value: "$930,075,295,338" },
  { label: "24h Volume", value: "$44,125,521,243.91" },
];

const dominanceBars: DominanceBar[] = [
  {
    icon: "/proteus/overview/btc.png",
    label: "BTC",
    value: "39.8%",
    background: "#F8E6A0",
    textColor: "#1F2937",
    width: 244,
  },
  {
    icon: "/proteus/overview/eth.png",
    label: "ETH",
    value: "17.7%",
    background: "#CCE0FF",
    textColor: "#374151",
    width: 187,
  },
];

const arrowIcon = {
  up: "/proteus/defi/arrow-up.svg",
  down: "/proteus/defi/arrow-down.svg",
};

function AppLogo() {
  return (
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

function HeaderSection() {
  return (
    <header className="flex flex-col items-center gap-[6px]">
      <div className="w-full rounded-[9.47px] bg-white px-4 py-2 shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="shrink-0">
            <AppLogo />
          </div>

          <div className="flex flex-1 flex-wrap items-center justify-center gap-x-10 gap-y-4 rounded-[94.7px] px-5 py-2">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-[6px] text-[14px] leading-none"
              >
                <NavIcon item={item} />
                <span
                  className={
                    item.active
                      ? "bg-gradient-to-b from-[#8162ff] to-[#5d3ae9] bg-clip-text font-semibold text-transparent"
                      : "font-normal text-[#1f2937]"
                  }
                >
                  {item.label}
                </span>
              </div>
            ))}

            <div className="flex h-8 w-full max-w-[250px] items-center justify-between rounded-[4px] border border-black/6 bg-[#f9fafb] px-3 py-[6px]">
              <div className="flex items-center gap-2">
                <img
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5"
                  src="/proteus/header/search.svg"
                />
                <span className="text-[14px] leading-5 text-[#4b5563]">
                  Search
                </span>
              </div>
              <span className="text-[14px] leading-5 text-[#4b5563]">/</span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end xl:self-auto">
            <div className="flex h-[34.092px] w-[34.092px] items-center justify-center rounded-full bg-[#f3f0ff]">
              <span className="bg-gradient-to-b from-[#8162ff] to-[#5d3ae9] bg-clip-text text-[13.258px] font-semibold tracking-[-0.4735px] text-transparent">
                YR
              </span>
            </div>
            <div className="leading-none">
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
              className="h-6 w-6"
              src="/proteus/header/chevron-down.svg"
            />
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-[610px] items-center gap-6 overflow-x-auto rounded-[100px] bg-white px-4 py-1 shadow-[0_2px_4px_rgba(0,0,0,0.04)] hide-scrollbar">
        <span className="shrink-0 text-[14px] text-[#1f2937]">Chains:</span>

        <div className="flex min-w-[456px] flex-1 items-center justify-between gap-6">
          {chains.map((chain) => (
            <div
              key={chain.icon}
              className={
                chain.active
                  ? "flex items-center gap-1 border-b-2 border-[#8162ff] p-[6px]"
                  : "flex items-center gap-1 p-[6px]"
              }
            >
              <img
                alt={chain.label ?? ""}
                aria-hidden={!chain.label}
                className="h-5 w-5 shrink-0"
                src={chain.icon}
              />
              {chain.label ? (
                <span className="text-[12px] font-medium text-[#1f2937]">
                  {chain.label}
                </span>
              ) : null}
            </div>
          ))}
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

function DefiCard({ card }: { card: DefiCard }) {
  return (
    <article
      className={
        card.highlight
          ? "flex w-[311px] min-w-[311px] flex-col gap-2 rounded-[8px] border border-[#e5e7eb] bg-white p-3 shadow-[0_4px_6px_rgba(0,0,0,0.09)]"
          : "proteus-panel flex w-[311px] min-w-[311px] flex-col gap-2 rounded-[8px] p-3"
      }
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-3">
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
                  card.highlight
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
        </div>

        <img
          alt=""
          aria-hidden="true"
          className="h-[26px] w-[26px]"
          src="/proteus/defi/bookmark.svg"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center text-[16px] leading-6 text-[#374151]">
          <span>TVL:</span>
          <span className="ml-0.5 font-medium">{card.tvl}</span>
        </div>

        <div
          className={
            card.highlight
              ? "flex flex-1 items-center justify-between rounded-[4px] border border-[#f3f4f6] bg-white py-[6px] pl-[6px] pr-3"
              : "flex flex-1 items-center justify-between rounded-[38px] border border-[#f3f4f6] bg-white py-[6px] pl-[6px] pr-3"
          }
        >
          <div className="flex items-center gap-2">
            <img
              alt=""
              aria-hidden="true"
              className="h-[26px] w-[26px] rounded-full object-cover"
              src="/proteus/defi/ethereum-badge.png"
            />
            <span className="font-roboto text-[16px] leading-none text-[#374151]">
              Etherum
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

function DefiStripSection() {
  return (
    <section className="rounded-[8px] bg-white px-4 py-3 shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-medium leading-6 text-[#374151]">
          Popular Decentralised Finance
        </h2>
        <button
          className="rounded-[40px] border border-[#e5e7eb] bg-white px-3 py-[6px] text-[14px] font-medium leading-5 text-[#1f2937]"
          type="button"
        >
          View More
        </button>
      </div>

      <div className="mt-3 overflow-x-auto py-3 hide-scrollbar">
        <div className="flex min-w-max gap-3">
          {defiCards.map((card) => (
            <DefiCard key={`${card.name}-${card.tvl}`} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ColumnHeader({ label, width }: { label: string; width: string }) {
  return (
    <div className={`flex items-center ${width}`}>
      <span className="text-[12px] font-medium tracking-[0.24px] text-[#6b7280]">
        {label}
      </span>
      <img
        alt=""
        aria-hidden="true"
        className="h-6 w-6"
        src="/proteus/nft/column-chevron.svg"
      />
    </div>
  );
}

function NftTableSection() {
  return (
    <section className="rounded-[8px] bg-[#f3f4f6] px-4 py-3">
      <h2 className="text-[20px] font-medium leading-[22.728px] text-[#1f2937]">
        Popular NFT Collection
      </h2>

      <div className="mt-3 rounded-[4px] border border-[#e5e7eb] bg-white px-3 pb-3 pt-[6px]">
        <div className="overflow-x-auto hide-scrollbar">
          <div className="min-w-[676px]">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] p-1">
              <div className="w-[197px] text-[12px] font-medium tracking-[0.24px] text-[#6b7280]">
                Collection
              </div>
              <ColumnHeader label="24h Volume" width="w-[95px]" />
              <ColumnHeader label="1 Day %" width="w-[70px]" />
              <ColumnHeader label="Floor Price" width="w-[88px]" />
              <ColumnHeader label="Owners" width="w-[70px]" />
              <ColumnHeader label="Supply" width="w-[65px]" />
            </div>

            <div className="flex flex-col gap-[6px]">
              {nftCollections.map((collection) => (
                <div
                  key={collection.name}
                  className="flex items-center justify-between border-b border-[#e5e7eb] py-[6px]"
                >
                  <div className="flex w-[200px] items-center gap-2 px-1">
                    <img
                      alt={`${collection.name} collection artwork`}
                      className="h-[28.41px] w-[28.41px] rounded-[1.894px] object-cover"
                      src={collection.image}
                    />
                    <p
                      className={`${collection.useRoboto ? "font-roboto text-[13.258px]" : "text-[14px]"} max-w-[143px] font-medium text-[#374151] ${
                        collection.name.length > 20
                          ? "leading-[16px]"
                          : "leading-[22px]"
                      }`}
                    >
                      {collection.name}
                    </p>
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
    </section>
  );
}

function GasFeeModeCard({ mode }: { mode: GasMode }) {
  const speedParts = mode.speed.split(" ");

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-1 text-center">
        {mode.duplicate ? (
          <div className="flex h-[36.663px] items-center justify-center gap-[3.666px]">
            <img
              alt=""
              aria-hidden="true"
              className={mode.imageClassName}
              src={mode.image}
            />
            <img
              alt=""
              aria-hidden="true"
              className={mode.imageClassName}
              src={mode.image}
            />
          </div>
        ) : (
          <img
            alt=""
            aria-hidden="true"
            className={mode.imageClassName}
            src={mode.image}
          />
        )}

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
        <span className="text-[36px] font-medium leading-[44px]">
          {mode.gwei}
        </span>
        <span className="text-[12px] font-medium leading-4 tracking-[0.24px]">
          gwei
        </span>
      </div>
    </div>
  );
}

function OverviewSection() {
  return (
    <section className="rounded-[8px] bg-[#f3f4f6] py-3 pl-3 pr-0 sm:pr-3">
      <h2 className="text-[20px] font-medium leading-[22.728px] text-[#1f2937]">
        Overview of Crypto Market
      </h2>

      <div className="mt-6 flex flex-col gap-6">
        <div className="proteus-panel rounded-[8px] px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <img
                alt=""
                aria-hidden="true"
                className="h-6 w-6"
                src="/proteus/overview/fuel.svg"
              />
              <h3 className="text-[18px] font-medium leading-6 text-[#1f2937]">
                ETH Gas Fees
              </h3>
              <img
                alt=""
                aria-hidden="true"
                className="h-5 w-5"
                src="/proteus/overview/info.svg"
              />
            </div>

            <p className="text-[12px] font-medium tracking-[0.24px] text-[#4b5563]">
              Base: 30 &nbsp; | &nbsp; Next update in 3s
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
            {gasModes.map((mode) => (
              <GasFeeModeCard key={mode.label} mode={mode} />
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="proteus-panel rounded-[10px] px-[18px] py-[15px]">
            <div className="space-y-[11px]">
              {marketStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 text-[15.152px] leading-[22.728px]"
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
                <div key={bar.label} className="flex items-center gap-[6px]">
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
  return (
    <main className="min-h-screen bg-[#f3f4f6] px-4 py-4 text-[#1f2937] sm:px-6 sm:py-6">
      <div className="mx-auto flex w-full max-w-[1512px] flex-col gap-6">
        <HeaderSection />
        <DefiStripSection />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <NftTableSection />
          <OverviewSection />
        </div>
      </div>
    </main>
  );
}
