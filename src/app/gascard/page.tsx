/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Undo2 } from "lucide-react";

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

const gasProfile = {
  base: 30,
  values: {
    "future-car": 34,
    "speed-bike": 32,
    walking: 31,
  } as Record<string, number>,
};

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
        active
          ? "bg-white shadow-[0_8px_18px_rgba(0,0,0,0.08)]"
          : "hover:bg-white/70"
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
            <span className="text-[#374151]">
              {speedParts.slice(1).join(" ")}
            </span>
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

export default function GasCardPage() {
  const [selectedGasMode, setSelectedGasMode] = useState("speed-bike");
  const [countdown, setCountdown] = useState(3);
  const [gasRefreshIndex, setGasRefreshIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setGasRefreshIndex((i) => i + 1);
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function getGwei(modeId: string) {
    const base = gasProfile.values[modeId] ?? gasProfile.base;
    const variance = ((gasRefreshIndex + modeId.length) % 3) - 1;
    return base + variance;
  }

  const selectedMode =
    gasModes.find((m) => m.id === selectedGasMode) ?? gasModes[1];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white px-6 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <Undo2 className="h-4 w-4" />
          <span>Back</span>
        </Link>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col items-center px-6 py-12">
        <h1 className="mb-8 text-2xl font-semibold text-gray-900">
          Gas Fee Mode Selector
        </h1>

        <div className="proteus-panel rounded-[8px] p-4">
          {/* Panel header */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                alt="fuel"
                className="h-5 w-5"
                src="/proteus/overview/fuel.svg"
              />
              <span className="text-[16px] font-semibold text-[#1f2937]">
                ETH Gas Fees
              </span>
            </div>
            <img
              alt="info"
              className="h-4 w-4"
              src="/proteus/overview/info.svg"
            />
          </div>

          {/* Subtitle */}
          <p className="mb-3 text-[12px] text-[#6b7280]">
            Base: {gasProfile.base} &nbsp;|&nbsp; Next update in {countdown}s
          </p>

          {/* Selected mode label */}
          <p className="mb-2 text-[14px] font-medium text-[#374151]">
            {selectedMode.label}
          </p>

          {/* Mode cards */}
          <div className="flex items-center gap-2">
            {gasModes.map((mode) => (
              <GasFeeModeCard
                active={selectedGasMode === mode.id}
                gwei={getGwei(mode.id)}
                key={mode.id}
                mode={mode}
                onSelect={setSelectedGasMode}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white px-6 py-4" />
    </div>
  );
}
