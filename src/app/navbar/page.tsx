"use client";

import { useState } from "react";
import Link from "next/link";
import ComponentShell from "@/components/ComponentShell";

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const CODE_CONTENT =
  "Full source at: https://github.com/yamparalarahul27/Proteus/blob/main/src/app/navbar/page.tsx";

const PROMPT_CONTENT =
  "A responsive top-navigation bar with an app logo, icon-labeled nav links (Home, Assets, DeFi, NFT), an inline search field, and a user avatar dropdown menu. Built with Tailwind CSS utility classes and Next.js Link routing.";

/* ------------------------------------------------------------------ */
/*  Types & Data                                                      */
/* ------------------------------------------------------------------ */

type NavItem = {
  href: string;
  icon?: string;
  kind?: "defi" | "nft";
  label: string;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: "/proteus/header/nav-home.svg" },
  { href: "/assets", label: "Assets", icon: "/proteus/header/nav-assets.svg" },
  { href: "/defi", label: "DeFi", kind: "defi" },
  { href: "/nft", label: "NFT", kind: "nft" },
];

/* ------------------------------------------------------------------ */
/*  Helper Components                                                 */
/* ------------------------------------------------------------------ */

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
  if (item.kind === "defi") return <DefiIcon />;
  if (item.kind === "nft") return <NftIcon />;
  return (
    <img
      alt=""
      aria-hidden="true"
      className="h-[22px] w-[22px]"
      src={item.icon}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function NavbarPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <ComponentShell
      title="Navbar Component"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      {/* Navbar */}
      <div className="w-full max-w-5xl rounded-[9.47px] bg-white px-4 py-2 shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              onClick={() => setUserMenuOpen((v) => !v)}
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
                  href="/swap-flow"
                >
                  Open swap flow
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </ComponentShell>
  );
}
