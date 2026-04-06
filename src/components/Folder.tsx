"use client";

import { useEffect, useRef, useState } from "react";

type FolderColor = "dark" | "blue" | "yellow" | "green" | "red" | "purple";

interface FolderProps {
  color?: FolderColor;
  name?: string;
  /** Fixed size (used when mobileSize/desktopSize aren't set) */
  size?: number;
  /** Size on screens < 640px. Falls back to `size`. */
  mobileSize?: number;
  /** Size on screens >= 640px. Falls back to `size`. */
  desktopSize?: number;
  onClick?: () => void;
}

const colorThemes: Record<
  FolderColor,
  {
    back: string;
    backGrad: [string, string];
    front: string;
    frontGrad: [string, string];
    tab: string;
    tabGrad: [string, string];
    shadow: string;
    hoverShadow: string;
    textColor: string;
  }
> = {
  dark: {
    back: "#3a3d47",
    backGrad: ["#4a4d57", "#2e3038"],
    front: "#53565f",
    frontGrad: ["#65686f", "#3e4048"],
    tab: "#4a4d57",
    tabGrad: ["#55585f", "#3a3d47"],
    shadow: "rgba(0,0,0,0.35)",
    hoverShadow: "rgba(0,0,0,0.45)",
    textColor: "#9ca3af",
  },
  blue: {
    back: "#5aaaf5",
    backGrad: ["#7ec0ff", "#3d8ee0"],
    front: "#6ab8ff",
    frontGrad: ["#8ecfff", "#4a9ae8"],
    tab: "#5aaaf5",
    tabGrad: ["#6eb8ff", "#4a96e0"],
    shadow: "rgba(58,140,224,0.35)",
    hoverShadow: "rgba(58,140,224,0.5)",
    textColor: "#3b82f6",
  },
  yellow: {
    back: "#e8b230",
    backGrad: ["#f0c855", "#d49a18"],
    front: "#f0c040",
    frontGrad: ["#f5d065", "#e0a820"],
    tab: "#e8b830",
    tabGrad: ["#f0c545", "#d8a020"],
    shadow: "rgba(212,154,24,0.35)",
    hoverShadow: "rgba(212,154,24,0.5)",
    textColor: "#ca8a04",
  },
  green: {
    back: "#38a565",
    backGrad: ["#4cc080", "#2a8a50"],
    front: "#45b875",
    frontGrad: ["#5cd08a", "#35a060"],
    tab: "#3aad68",
    tabGrad: ["#48bf78", "#2c9555"],
    shadow: "rgba(42,138,80,0.35)",
    hoverShadow: "rgba(42,138,80,0.5)",
    textColor: "#22c55e",
  },
  red: {
    back: "#e05050",
    backGrad: ["#f06868", "#c83838"],
    front: "#e86060",
    frontGrad: ["#f07878", "#d04848"],
    tab: "#e05555",
    tabGrad: ["#f06a6a", "#c84040"],
    shadow: "rgba(200,56,56,0.35)",
    hoverShadow: "rgba(200,56,56,0.5)",
    textColor: "#ef4444",
  },
  purple: {
    back: "#8b5cf6",
    backGrad: ["#a478ff", "#7040e0"],
    front: "#9b6ff8",
    frontGrad: ["#b088ff", "#8055ea"],
    tab: "#8f62f6",
    tabGrad: ["#a070ff", "#7848e0"],
    shadow: "rgba(112,64,224,0.35)",
    hoverShadow: "rgba(112,64,224,0.5)",
    textColor: "#8b5cf6",
  },
};

export default function Folder({
  color = "blue",
  name,
  size = 120,
  mobileSize,
  desktopSize,
  onClick,
}: FolderProps) {
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const theme = colorThemes[color];

  // Track viewport for responsive sizing
  const containerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const resolvedSize = isMobile
    ? (mobileSize ?? size)
    : (desktopSize ?? size);

  const w = resolvedSize;
  const h = resolvedSize * 0.82;
  const svgW = 120;
  const svgH = 98;

  return (
    <button
      ref={containerRef}
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col items-center gap-1.5 sm:gap-2 rounded-xl p-2 sm:p-3 transition-all duration-200 hover:bg-black/[0.04] active:bg-black/[0.06] dark:hover:bg-white/[0.06] dark:active:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 min-w-[64px] touch-manipulation"
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${svgW} ${svgH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm transition-transform duration-200"
        style={{
          filter: `drop-shadow(0 ${hovered ? "8px 16px" : "4px 8px"} ${hovered ? theme.hoverShadow : theme.shadow})`,
          transform: hovered ? "translateY(-3px) scale(1.03)" : "translateY(0) scale(1)",
          transition: "filter 0.2s, transform 0.2s",
        }}
      >
        <defs>
          {/* Back panel gradient */}
          <linearGradient id={`backGrad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.backGrad[0]} />
            <stop offset="100%" stopColor={theme.backGrad[1]} />
          </linearGradient>

          {/* Tab gradient */}
          <linearGradient id={`tabGrad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.tabGrad[0]} />
            <stop offset="100%" stopColor={theme.tabGrad[1]} />
          </linearGradient>

          {/* Front panel gradient */}
          <linearGradient id={`frontGrad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.frontGrad[0]} />
            <stop offset="100%" stopColor={theme.frontGrad[1]} />
          </linearGradient>

          {/* Glossy highlight */}
          <linearGradient id={`gloss-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.25" />
            <stop offset="50%" stopColor="white" stopOpacity="0.05" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Back panel */}
        <rect
          x="6"
          y="18"
          width="108"
          height="72"
          rx="8"
          fill={`url(#backGrad-${color})`}
        />

        {/* Tab */}
        <path
          d="M12 18 L12 8 Q12 4 16 4 L42 4 Q46 4 48 8 L52 16 Q54 20 58 20 L58 18"
          fill={`url(#tabGrad-${color})`}
        />
        {/* Tab top rounded fill */}
        <rect x="12" y="4" width="40" height="16" rx="6" fill={`url(#tabGrad-${color})`} />

        {/* Front panel */}
        <rect
          x="4"
          y="26"
          width="112"
          height="68"
          rx="8"
          fill={`url(#frontGrad-${color})`}
        />

        {/* Glossy overlay on front */}
        <rect
          x="4"
          y="26"
          width="112"
          height="34"
          rx="8"
          fill={`url(#gloss-${color})`}
        />

        {/* Subtle top edge highlight */}
        <rect
          x="6"
          y="26"
          width="108"
          height="1.5"
          rx="0.75"
          fill="white"
          opacity="0.2"
        />

        {/* Bottom subtle shadow line */}
        <rect
          x="8"
          y="91"
          width="104"
          height="1"
          rx="0.5"
          fill="black"
          opacity="0.1"
        />
      </svg>

      {name && (
        <span
          className="truncate text-[11px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors"
          style={{ maxWidth: Math.max(resolvedSize, 64) }}
        >
          {name}
        </span>
      )}
    </button>
  );
}

export function FolderGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-center gap-2 sm:gap-4">
      {children}
    </div>
  );
}
