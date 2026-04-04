"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import ComponentShell from "@/components/ComponentShell";

/* ------------------------------------------------------------------ */
/*  Types & data                                                       */
/* ------------------------------------------------------------------ */

type TocItem = { id: string; label: string; depth: number };

const tocItems: TocItem[] = [
  { id: "intro", label: "Introduction", depth: 0 },
  { id: "getting-started", label: "Getting Started", depth: 0 },
  { id: "installation", label: "Installation", depth: 1 },
  { id: "configuration", label: "Configuration", depth: 1 },
  { id: "env-vars", label: "Environment Variables", depth: 2 },
  { id: "options", label: "Options Reference", depth: 2 },
  { id: "core-concepts", label: "Core Concepts", depth: 0 },
  { id: "components", label: "Components", depth: 1 },
  { id: "hooks", label: "Hooks", depth: 1 },
  { id: "state", label: "State Management", depth: 2 },
  { id: "advanced", label: "Advanced Usage", depth: 0 },
  { id: "plugins", label: "Plugins", depth: 1 },
  { id: "theming", label: "Theming", depth: 1 },
  { id: "api", label: "API Reference", depth: 0 },
];

const INDENT_PX = 16;
const ITEM_H = 32;
const GAP_H = 10;
const STROKE_X_BASE = 8;

/* ------------------------------------------------------------------ */
/*  Helpers: build SVG path segments                                   */
/* ------------------------------------------------------------------ */

function itemOffsetX(depth: number) {
  return STROKE_X_BASE + depth * INDENT_PX;
}

/** Full SVG outline path through all items (for the dim + highlighted stroke). */
function buildOutlinePath(items: TocItem[]): string {
  let d = "";
  let runningY = 0;

  for (let i = 0; i < items.length; i++) {
    const offsetX = itemOffsetX(items[i].depth);
    const topY = runningY;
    const bottomY = topY + ITEM_H;

    if (i === 0) {
      d += `M ${offsetX} ${topY} L ${offsetX} ${bottomY}`;
    } else {
      const upperOffsetX = itemOffsetX(items[i - 1].depth);
      const upperBottomY = topY; // top of gap
      // cubic Bezier through the gap
      d += ` C ${upperOffsetX} ${upperBottomY + GAP_H - 4} ${offsetX} ${upperBottomY + 4} ${offsetX} ${upperBottomY + GAP_H}`;
      d += ` L ${offsetX} ${bottomY}`;
    }

    runningY = bottomY + GAP_H;
  }
  return d;
}

/** Compute top-Y for item index */
function itemTopY(index: number) {
  return index * (ITEM_H + GAP_H);
}

/* ------------------------------------------------------------------ */
/*  Curved TOC Component                                               */
/* ------------------------------------------------------------------ */

function CurvedToc({
  items,
  activeIndex,
  onSelect,
}: {
  items: TocItem[];
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  const totalH = items.length * ITEM_H + (items.length - 1) * GAP_H;
  const outlinePath = useMemo(() => buildOutlinePath(items), [items]);

  // clip-path rect for the active thumb
  const thumbTop = itemTopY(activeIndex);
  const thumbBottom = thumbTop + ITEM_H;
  const clipPath = `inset(${thumbTop}px 0 ${totalH - thumbBottom}px 0)`;

  // thumb box position
  const thumbBoxX = itemOffsetX(items[activeIndex].depth);

  return (
    <div className="relative" style={{ height: totalH, width: 260 }}>
      {/* ---- Dim outline ---- */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={260}
        height={totalH}
      >
        <path
          d={outlinePath}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={1.5}
        />
      </svg>

      {/* ---- Highlighted (clipped) outline ---- */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath,
          transition: "clip-path 250ms cubic-bezier(.4,0,.2,1)",
        }}
      >
        <svg width={260} height={totalH}>
          <path
            d={outlinePath}
            fill="none"
            stroke="#8162ff"
            strokeWidth={2}
          />
        </svg>
      </div>

      {/* ---- Thumb box (circle) ---- */}
      <div
        className="absolute w-[7px] h-[7px] rounded-full bg-[#8162ff] shadow-[0_0_6px_rgba(129,98,255,0.5)] pointer-events-none"
        style={{
          translate: `${thumbBoxX - 3}px ${thumbTop - 3}px`,
          transition: "translate 250ms cubic-bezier(.4,0,.2,1)",
        }}
      />

      {/* ---- Labels ---- */}
      {items.map((item, i) => {
        const top = itemTopY(i);
        const isActive = i === activeIndex;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(i)}
            className="absolute flex items-center text-left transition-colors duration-200"
            style={{
              top,
              left: itemOffsetX(item.depth) + 12,
              height: ITEM_H,
              color: isActive ? "#1f2937" : "#9ca3af",
              fontWeight: isActive ? 600 : 400,
            }}
          >
            <span className="text-[13px] leading-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Individual SVG connector demo                                      */
/* ------------------------------------------------------------------ */

function ConnectorDemo() {
  const [upperDepth, setUpperDepth] = useState(0);
  const [lowerDepth, setLowerDepth] = useState(1);

  const upperX = STROKE_X_BASE + upperDepth * INDENT_PX;
  const lowerX = STROKE_X_BASE + lowerDepth * INDENT_PX;
  const w = Math.abs(upperX - lowerX) + 20;
  const viewMinX = Math.min(upperX, lowerX) - 10;
  const svgH = 60;

  const ctrlY1 = svgH - 4;
  const ctrlY2 = 4;
  const path = `M ${upperX} 0 C ${upperX} ${ctrlY1} ${lowerX} ${ctrlY2} ${lowerX} ${svgH}`;

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[12px] font-medium text-[#374151]">
        Cubic Bezier Connector
      </p>
      <div className="flex items-center gap-6">
        <label className="text-[11px] text-[#6b7280]">
          Upper depth
          <select
            className="ml-1 rounded border border-gray-200 px-1.5 py-0.5 text-[11px]"
            value={upperDepth}
            onChange={(e) => setUpperDepth(+e.target.value)}
          >
            {[0, 1, 2, 3].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="text-[11px] text-[#6b7280]">
          Lower depth
          <select
            className="ml-1 rounded border border-gray-200 px-1.5 py-0.5 text-[11px]"
            value={lowerDepth}
            onChange={(e) => setLowerDepth(+e.target.value)}
          >
            {[0, 1, 2, 3].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
      </div>
      <svg width={w} height={svgH} viewBox={`${viewMinX} 0 ${w} ${svgH}`}>
        {/* control points */}
        <circle cx={upperX} cy={ctrlY1} r={3} fill="#EC4899" opacity={0.5} />
        <circle cx={lowerX} cy={ctrlY2} r={3} fill="#EC4899" opacity={0.5} />
        {/* guide lines */}
        <line
          x1={upperX}
          y1={0}
          x2={upperX}
          y2={ctrlY1}
          stroke="#EC4899"
          strokeWidth={0.5}
          strokeDasharray="3 3"
          opacity={0.4}
        />
        <line
          x1={lowerX}
          y1={ctrlY2}
          x2={lowerX}
          y2={svgH}
          stroke="#EC4899"
          strokeWidth={0.5}
          strokeDasharray="3 3"
          opacity={0.4}
        />
        {/* curve */}
        <path d={path} fill="none" stroke="#8162ff" strokeWidth={2} />
        {/* endpoints */}
        <circle cx={upperX} cy={0} r={3} fill="#8162ff" />
        <circle cx={lowerX} cy={svgH} r={3} fill="#8162ff" />
      </svg>
      <code className="text-[10px] text-[#6b7280] bg-gray-50 rounded px-2 py-1 max-w-[280px] break-all leading-relaxed">
        C {upperX} {ctrlY1} {lowerX} {ctrlY2} {lowerX} {svgH}
      </code>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Clip-path vs mask-image comparison                                 */
/* ------------------------------------------------------------------ */

function ClipPathDemo() {
  const [method, setMethod] = useState<"clip-path" | "mask-image">(
    "clip-path"
  );
  const [pos, setPos] = useState(20);
  const barH = 24;

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[12px] font-medium text-[#374151]">
        Thumb Animation Method
      </p>
      <div className="flex gap-2">
        {(["clip-path", "mask-image"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all ${
              method === m
                ? "bg-[#8162ff] text-white"
                : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* bar track */}
      <div className="relative w-[200px] h-[120px] rounded-lg bg-gray-50 border border-gray-200 overflow-hidden">
        {/* dim line */}
        <div className="absolute left-[20px] top-[10px] bottom-[10px] w-[2px] bg-gray-200" />

        {/* animated highlight */}
        {method === "clip-path" ? (
          <div
            className="absolute left-0 top-0 bottom-0 w-full"
            style={{
              clipPath: `inset(${pos}px 0 ${120 - pos - barH}px 0)`,
              transition: "clip-path 300ms ease",
            }}
          >
            <div className="absolute left-[20px] top-[10px] bottom-[10px] w-[2px] bg-[#8162ff]" />
          </div>
        ) : (
          <div
            className="absolute left-[20px] w-[2px] bg-[#8162ff]"
            style={{
              top: pos,
              height: barH,
              transition: "top 300ms ease, height 300ms ease",
            }}
          />
        )}

        {/* label */}
        <div
          className="absolute right-3 text-[10px] font-mono text-[#8162ff]"
          style={{
            top: pos + barH / 2 - 6,
            transition: "top 300ms ease",
          }}
        >
          {method}
        </div>
      </div>

      {/* position slider */}
      <input
        type="range"
        min={0}
        max={120 - barH}
        value={pos}
        onChange={(e) => setPos(+e.target.value)}
        className="w-[200px] accent-[#8162ff]"
      />
      <p className="text-[10px] text-[#9ca3af]">
        {method === "clip-path"
          ? "Only clip-path is animated — no layout recalc"
          : "Animates top + height — triggers layout recalc"}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Offset-distance demo                                               */
/* ------------------------------------------------------------------ */

function OffsetDistanceDemo() {
  const [distance, setDistance] = useState(30);
  const pathD = "M 10 0 C 10 50 50 10 50 60 C 50 90 20 70 20 100";

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[12px] font-medium text-[#374151]">
        offset-path / offset-distance
      </p>
      <div className="relative" style={{ width: 70, height: 110 }}>
        <svg width={70} height={110}>
          <path d={pathD} fill="none" stroke="#e5e7eb" strokeWidth={1.5} />
          <path d={pathD} fill="none" stroke="#8162ff" strokeWidth={2} strokeDasharray="4 4" />
        </svg>
        <div
          className="absolute w-2 h-2 rounded-full bg-[#8162ff] shadow-[0_0_6px_rgba(129,98,255,0.6)]"
          style={{
            top: 0,
            left: 0,
            offsetPath: `path("${pathD}")`,
            offsetDistance: `${distance}%`,
            transition: "offset-distance 300ms ease",
          }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={distance}
        onChange={(e) => setDistance(+e.target.value)}
        className="w-[160px] accent-[#8162ff]"
      />
      <p className="text-[10px] text-[#9ca3af]">
        distance: {distance}% — element follows the path
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Auto-scroll demo                                                   */
/* ------------------------------------------------------------------ */

function AutoScrollToc() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tocItems.length);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return <CurvedToc items={tocItems} activeIndex={activeIndex} onSelect={setActiveIndex} />;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CODE_CONTENT = `// Inspired by: https://www.fuma-nama.dev/blog/svg-art-2
// Credit: https://x.com/fuma_nama
// Source: https://github.com/fuma-nama/fumadocs/blob/dev/packages/radix-ui/src/components/toc/clerk.tsx

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Types & data                                                       */
/* ------------------------------------------------------------------ */

type TocItem = { id: string; label: string; depth: number };

const tocItems: TocItem[] = [
  { id: "intro", label: "Introduction", depth: 0 },
  { id: "getting-started", label: "Getting Started", depth: 0 },
  { id: "installation", label: "Installation", depth: 1 },
  { id: "configuration", label: "Configuration", depth: 1 },
  { id: "env-vars", label: "Environment Variables", depth: 2 },
  { id: "options", label: "Options Reference", depth: 2 },
  { id: "core-concepts", label: "Core Concepts", depth: 0 },
  { id: "components", label: "Components", depth: 1 },
  { id: "hooks", label: "Hooks", depth: 1 },
  { id: "state", label: "State Management", depth: 2 },
  { id: "advanced", label: "Advanced Usage", depth: 0 },
  { id: "plugins", label: "Plugins", depth: 1 },
  { id: "theming", label: "Theming", depth: 1 },
  { id: "api", label: "API Reference", depth: 0 },
];

const INDENT_PX = 16;
const ITEM_H = 32;
const GAP_H = 10;
const STROKE_X_BASE = 8;

/* ------------------------------------------------------------------ */
/*  Helpers: build SVG path segments                                   */
/* ------------------------------------------------------------------ */

function itemOffsetX(depth: number) {
  return STROKE_X_BASE + depth * INDENT_PX;
}

/** Full SVG outline path through all items. */
function buildOutlinePath(items: TocItem[]): string {
  let d = "";
  let runningY = 0;

  for (let i = 0; i < items.length; i++) {
    const offsetX = itemOffsetX(items[i].depth);
    const topY = runningY;
    const bottomY = topY + ITEM_H;

    if (i === 0) {
      d += \`M \${offsetX} \${topY} L \${offsetX} \${bottomY}\`;
    } else {
      const upperOffsetX = itemOffsetX(items[i - 1].depth);
      const upperBottomY = topY;
      d += \` C \${upperOffsetX} \${upperBottomY + GAP_H - 4} \${offsetX} \${upperBottomY + 4} \${offsetX} \${upperBottomY + GAP_H}\`;
      d += \` L \${offsetX} \${bottomY}\`;
    }

    runningY = bottomY + GAP_H;
  }
  return d;
}

/** Compute top-Y for item index */
function itemTopY(index: number) {
  return index * (ITEM_H + GAP_H);
}

/* ------------------------------------------------------------------ */
/*  Curved TOC Component                                               */
/* ------------------------------------------------------------------ */

function CurvedToc({
  items,
  activeIndex,
  onSelect,
}: {
  items: TocItem[];
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  const totalH = items.length * ITEM_H + (items.length - 1) * GAP_H;
  const outlinePath = useMemo(() => buildOutlinePath(items), [items]);

  // clip-path rect for the active thumb
  const thumbTop = itemTopY(activeIndex);
  const thumbBottom = thumbTop + ITEM_H;
  const clipPath = \`inset(\${thumbTop}px 0 \${totalH - thumbBottom}px 0)\`;

  // thumb box position
  const thumbBoxX = itemOffsetX(items[activeIndex].depth);

  return (
    <div className="relative" style={{ height: totalH, width: 260 }}>
      {/* Dim outline */}
      <svg className="absolute inset-0 pointer-events-none" width={260} height={totalH}>
        <path d={outlinePath} fill="none" stroke="#e5e7eb" strokeWidth={1.5} />
      </svg>

      {/* Highlighted (clipped) outline */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath,
          transition: "clip-path 250ms cubic-bezier(.4,0,.2,1)",
        }}
      >
        <svg width={260} height={totalH}>
          <path d={outlinePath} fill="none" stroke="#8162ff" strokeWidth={2} />
        </svg>
      </div>

      {/* Thumb box (circle) */}
      <div
        className="absolute w-[7px] h-[7px] rounded-full bg-[#8162ff] shadow-[0_0_6px_rgba(129,98,255,0.5)] pointer-events-none"
        style={{
          translate: \`\${thumbBoxX - 3}px \${thumbTop - 3}px\`,
          transition: "translate 250ms cubic-bezier(.4,0,.2,1)",
        }}
      />

      {/* Labels */}
      {items.map((item, i) => {
        const top = itemTopY(i);
        const isActive = i === activeIndex;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(i)}
            className="absolute flex items-center text-left transition-colors duration-200"
            style={{
              top,
              left: itemOffsetX(item.depth) + 12,
              height: ITEM_H,
              color: isActive ? "#1f2937" : "#9ca3af",
              fontWeight: isActive ? 600 : 400,
            }}
          >
            <span className="text-[13px] leading-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Interactive Bezier connector demo                                  */
/* ------------------------------------------------------------------ */

function ConnectorDemo() {
  const [upperDepth, setUpperDepth] = useState(0);
  const [lowerDepth, setLowerDepth] = useState(1);

  const upperX = STROKE_X_BASE + upperDepth * INDENT_PX;
  const lowerX = STROKE_X_BASE + lowerDepth * INDENT_PX;
  const w = Math.abs(upperX - lowerX) + 20;
  const viewMinX = Math.min(upperX, lowerX) - 10;
  const svgH = 60;

  const ctrlY1 = svgH - 4;
  const ctrlY2 = 4;
  const path = \`M \${upperX} 0 C \${upperX} \${ctrlY1} \${lowerX} \${ctrlY2} \${lowerX} \${svgH}\`;

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[12px] font-medium text-[#374151]">Cubic Bezier Connector</p>
      <div className="flex items-center gap-6">
        <label className="text-[11px] text-[#6b7280]">
          Upper depth
          <select className="ml-1 rounded border border-gray-200 px-1.5 py-0.5 text-[11px]"
            value={upperDepth} onChange={(e) => setUpperDepth(+e.target.value)}>
            {[0, 1, 2, 3].map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
        <label className="text-[11px] text-[#6b7280]">
          Lower depth
          <select className="ml-1 rounded border border-gray-200 px-1.5 py-0.5 text-[11px]"
            value={lowerDepth} onChange={(e) => setLowerDepth(+e.target.value)}>
            {[0, 1, 2, 3].map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
      </div>
      <svg width={w} height={svgH} viewBox={\`\${viewMinX} 0 \${w} \${svgH}\`}>
        <circle cx={upperX} cy={ctrlY1} r={3} fill="#EC4899" opacity={0.5} />
        <circle cx={lowerX} cy={ctrlY2} r={3} fill="#EC4899" opacity={0.5} />
        <line x1={upperX} y1={0} x2={upperX} y2={ctrlY1}
          stroke="#EC4899" strokeWidth={0.5} strokeDasharray="3 3" opacity={0.4} />
        <line x1={lowerX} y1={ctrlY2} x2={lowerX} y2={svgH}
          stroke="#EC4899" strokeWidth={0.5} strokeDasharray="3 3" opacity={0.4} />
        <path d={path} fill="none" stroke="#8162ff" strokeWidth={2} />
        <circle cx={upperX} cy={0} r={3} fill="#8162ff" />
        <circle cx={lowerX} cy={svgH} r={3} fill="#8162ff" />
      </svg>
      <code className="text-[10px] text-[#6b7280] bg-gray-50 rounded px-2 py-1 max-w-[280px] break-all leading-relaxed">
        C {upperX} {ctrlY1} {lowerX} {ctrlY2} {lowerX} {svgH}
      </code>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Clip-path vs mask-image comparison                                 */
/* ------------------------------------------------------------------ */

function ClipPathDemo() {
  const [method, setMethod] = useState<"clip-path" | "mask-image">("clip-path");
  const [pos, setPos] = useState(20);
  const barH = 24;

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[12px] font-medium text-[#374151]">Thumb Animation Method</p>
      <div className="flex gap-2">
        {(["clip-path", "mask-image"] as const).map((m) => (
          <button key={m} onClick={() => setMethod(m)}
            className={\`rounded-full px-3 py-1 text-[11px] font-medium transition-all \${
              method === m ? "bg-[#8162ff] text-white" : "bg-white border border-gray-200 text-gray-600"
            }\`}>
            {m}
          </button>
        ))}
      </div>

      <div className="relative w-[200px] h-[120px] rounded-lg bg-gray-50 border border-gray-200 overflow-hidden">
        <div className="absolute left-[20px] top-[10px] bottom-[10px] w-[2px] bg-gray-200" />
        {method === "clip-path" ? (
          <div className="absolute left-0 top-0 bottom-0 w-full"
            style={{
              clipPath: \`inset(\${pos}px 0 \${120 - pos - barH}px 0)\`,
              transition: "clip-path 300ms ease",
            }}>
            <div className="absolute left-[20px] top-[10px] bottom-[10px] w-[2px] bg-[#8162ff]" />
          </div>
        ) : (
          <div className="absolute left-[20px] w-[2px] bg-[#8162ff]"
            style={{ top: pos, height: barH, transition: "top 300ms ease, height 300ms ease" }} />
        )}
        <div className="absolute right-3 text-[10px] font-mono text-[#8162ff]"
          style={{ top: pos + barH / 2 - 6, transition: "top 300ms ease" }}>
          {method}
        </div>
      </div>

      <input type="range" min={0} max={120 - barH} value={pos}
        onChange={(e) => setPos(+e.target.value)} className="w-[200px] accent-[#8162ff]" />
      <p className="text-[10px] text-[#9ca3af]">
        {method === "clip-path"
          ? "Only clip-path is animated — no layout recalc"
          : "Animates top + height — triggers layout recalc"}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Offset-distance demo                                               */
/* ------------------------------------------------------------------ */

function OffsetDistanceDemo() {
  const [distance, setDistance] = useState(30);
  const pathD = "M 10 0 C 10 50 50 10 50 60 C 50 90 20 70 20 100";

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[12px] font-medium text-[#374151]">offset-path / offset-distance</p>
      <div className="relative" style={{ width: 70, height: 110 }}>
        <svg width={70} height={110}>
          <path d={pathD} fill="none" stroke="#e5e7eb" strokeWidth={1.5} />
          <path d={pathD} fill="none" stroke="#8162ff" strokeWidth={2} strokeDasharray="4 4" />
        </svg>
        <div
          className="absolute w-2 h-2 rounded-full bg-[#8162ff] shadow-[0_0_6px_rgba(129,98,255,0.6)]"
          style={{
            top: 0, left: 0,
            offsetPath: \`path("\${pathD}")\`,
            offsetDistance: \`\${distance}%\`,
            transition: "offset-distance 300ms ease",
          }}
        />
      </div>
      <input type="range" min={0} max={100} value={distance}
        onChange={(e) => setDistance(+e.target.value)} className="w-[160px] accent-[#8162ff]" />
      <p className="text-[10px] text-[#9ca3af]">
        distance: {distance}% — element follows the path
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Auto-scroll demo                                                   */
/* ------------------------------------------------------------------ */

function AutoScrollToc() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tocItems.length);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return <CurvedToc items={tocItems} activeIndex={activeIndex} onSelect={setActiveIndex} />;
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function SvgTocPage() {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-[700px]">
      <div className="proteus-panel rounded-[16px] p-8 flex flex-col items-center gap-4">
        <p className="text-[13px] font-semibold text-[#1f2937]">Interactive Table of Contents</p>
        <p className="text-[11px] text-[#9ca3af] -mt-3 mb-2">Click any item — or wait for auto-cycle</p>
        <AutoScrollToc />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <div className="proteus-panel rounded-[12px] p-5 flex flex-col items-center">
          <ConnectorDemo />
        </div>
        <div className="proteus-panel rounded-[12px] p-5 flex flex-col items-center">
          <ClipPathDemo />
        </div>
      </div>

      <div className="proteus-panel rounded-[12px] p-5 w-full flex flex-col items-center">
        <OffsetDistanceDemo />
      </div>
    </div>
  );
}`;

const PROMPT_CONTENT = `Build an interactive SVG Table of Contents component in Next.js demonstrating techniques from Fuma Nama's "Some Nice Things with SVG (Part 2)" blog post.

Requirements:
- Render a nested TOC with items at varying indent depths (0, 1, 2)
- Connect items with smooth SVG cubic Bezier curves using the C path command
- Animate the active item highlight using clip-path (not mask-image) to avoid layout recalculation
- Include a small "thumb box" circle indicator that follows the active item
- Show an interactive Bezier connector demo with adjustable depth controls
- Show a clip-path vs mask-image comparison demonstrating the performance difference
- Show an offset-distance demo illustrating how elements follow SVG paths
- Auto-cycle through items to demonstrate the animation
- Use Tailwind CSS, keep the Proteus clean theme
- Credit: https://x.com/fuma_nama
- Source: https://www.fuma-nama.dev/blog/svg-art-2`;

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SvgTocPage() {
  return (
    <ComponentShell
      title="SVG Curved TOC"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-[700px]">
        {/* ---- Live TOC ---- */}
        <div className="proteus-panel rounded-[16px] p-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-[3px] w-[3px] rounded-full bg-[#8162ff]" />
            <p className="text-[13px] font-semibold text-[#1f2937]">
              Interactive Table of Contents
            </p>
          </div>
          <p className="text-[11px] text-[#9ca3af] -mt-3 mb-2">
            Click any item — or wait for auto-cycle
          </p>
          <AutoScrollToc />
        </div>

        {/* ---- Technique cards ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {/* Bezier connector */}
          <div className="proteus-panel rounded-[12px] p-5 flex flex-col items-center">
            <ConnectorDemo />
          </div>

          {/* clip-path vs mask-image */}
          <div className="proteus-panel rounded-[12px] p-5 flex flex-col items-center">
            <ClipPathDemo />
          </div>
        </div>

        {/* offset-distance */}
        <div className="proteus-panel rounded-[12px] p-5 w-full flex flex-col items-center">
          <OffsetDistanceDemo />
        </div>

        {/* ---- Article summary ---- */}
        <div className="proteus-panel rounded-[12px] p-5 w-full">
          <p className="text-[13px] font-semibold text-[#1f2937] mb-3">
            Techniques from the article
          </p>
          <ul className="space-y-2 text-[12px] text-[#6b7280] leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#8162ff] font-bold shrink-0">1.</span>
              <span>
                <strong className="text-[#374151]">Cubic Bezier curves</strong>{" "}
                — the SVG <code className="text-[11px] bg-gray-100 rounded px-1">C</code> command
                creates smooth S-curves between TOC items at different indent
                depths using control points offset by ±4px.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#8162ff] font-bold shrink-0">2.</span>
              <span>
                <strong className="text-[#374151]">clip-path animation</strong>{" "}
                — instead of <code className="text-[11px] bg-gray-100 rounded px-1">mask-image</code> +{" "}
                <code className="text-[11px] bg-gray-100 rounded px-1">transform</code>, use{" "}
                <code className="text-[11px] bg-gray-100 rounded px-1">clip-path: inset()</code> to
                mask the highlighted SVG. Only the clip rect is transitioned,
                avoiding costly layout recalculation.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#8162ff] font-bold shrink-0">3.</span>
              <span>
                <strong className="text-[#374151]">Thumb box positioning</strong>{" "}
                — a small circle at the thumb edge. Keeping it on the curved
                path requires solving the Bezier polynomial or using{" "}
                <code className="text-[11px] bg-gray-100 rounded px-1">getPointAtLength()</code>{" "}
                iteratively.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#8162ff] font-bold shrink-0">4.</span>
              <span>
                <strong className="text-[#374151]">offset-path</strong> — CSS
                property that pins an element to an SVG path using{" "}
                <code className="text-[11px] bg-gray-100 rounded px-1">offset-distance</code>, but
                only accepts path distance, not y-position.
              </span>
            </li>
          </ul>
        </div>

        {/* ---- Credit ---- */}
        <p className="text-[11px] text-[#9ca3af]">
          Based on{" "}
          <a
            href="https://www.fuma-nama.dev/blog/svg-art-2"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#6b7280]"
          >
            Some Nice Things with SVG (Part 2)
          </a>
          {" "}by{" "}
          <a
            href="https://x.com/fuma_nama"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#6b7280]"
          >
            @fuma_nama
          </a>
        </p>
      </div>
    </ComponentShell>
  );
}
