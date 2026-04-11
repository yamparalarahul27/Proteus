"use client";

import { useEffect, useMemo, useState } from "react";
import NumberFlow from "@number-flow/react";
import ComponentShell from "@/components/ComponentShell";
import styles from "./investmentgrowth.module.css";

const CODE_CONTENT = `https://github.com/anthropics/Proteus/blob/main/src/app/investmentgrowth/page.tsx`;

const PROMPT_CONTENT = `Build a compound investment growth chart in Next.js with SVG.

Requirements:
- Exponential bar chart showing compound growth over 30 years (8% annual return)
- Green glowing growth line overlaid on bars
- Interactive slider to adjust one-time deposit amount ($2K-$9K)
- Chart reacts in real-time as slider moves
- Final compound value displayed prominently
- Floating value bubble above slider thumb
- Ruler-style tick marks with labels below slider
- Horizontal gridlines with dollar amount labels
- Year range header and footer labels
- Light/dark theme support
- Card container with rounded corners and subtle border`;

/* ── constants ── */
const RATE = 0.08;
const YEARS = 30;
const MIN_DEP = 2000;
const MAX_DEP = 9000;

/* ── SVG layout ── */
const W = 500;
const H = 310;
const CL = 52; // chart-left
const CR = 488; // chart-right
const CT = 30; // chart-top
const CB = 275; // chart-bottom
const CW = CR - CL;
const CH = CB - CT;

/* ── helpers ── */
function compound(deposit: number): number[] {
  return Array.from({ length: YEARS }, (_, i) =>
    deposit * Math.pow(1 + RATE, i + 1),
  );
}

/** Catmull-Rom → cubic-bezier smooth path */
function smoothLine(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d;
}

function fmtK(v: number) {
  return v >= 1000 ? `$${Math.round(v / 1000)}K` : `$${v}`;
}

function fmtFull(v: number) {
  return "$" + Math.round(v).toLocaleString();
}

/* ── component ── */
export default function InvestmentGrowthPage() {
  const [deposit, setDeposit] = useState(5000);
  const [isDark, setIsDark] = useState(true);

  // Read theme from ComponentShell
  useEffect(() => {
    const checkTheme = () => {
      const stored = window.localStorage.getItem("proteus-shell-theme");
      setIsDark(stored === "dark");
    };
    checkTheme();
    const interval = setInterval(checkTheme, 300);
    return () => clearInterval(interval);
  }, []);

  const growth = useMemo(() => compound(deposit), [deposit]);

  /* dynamic y-axis */
  const peak = growth[YEARS - 1];
  const step = peak <= 30_000 ? 5_000 : peak <= 60_000 ? 10_000 : 20_000;
  const gridMax = Math.ceil(peak / step) * step;
  const maxY = gridMax * 1.08;

  const gridValues = useMemo(() => {
    const vals: number[] = [];
    for (let v = 0; v <= gridMax; v += step) vals.push(v);
    return vals;
  }, [gridMax, step]);

  const barStep = CW / YEARS;
  const barW = barStep * 0.62;
  const yOf = (v: number) => Math.round((CB - (v / maxY) * CH) * 100) / 100;

  const pts: [number, number][] = growth.map((v, i) => [
    Math.round((CL + i * barStep + barStep / 2) * 100) / 100,
    yOf(v),
  ]);

  const line = smoothLine(pts);
  const area =
    line +
    ` L ${pts[YEARS - 1][0]},${CB}` +
    ` L ${pts[0][0]},${CB} Z`;

  const pct = ((deposit - MIN_DEP) / (MAX_DEP - MIN_DEP)) * 100;
  const startYear = 2025;

  // Theme colors
  const t = {
    gridLine: isDark ? "#222" : "#e5e7eb",
    gridText: isDark ? "#444" : "#9ca3af",
    headerText: isDark ? "#666" : "#6b7280",
    barBase: isDark ? [18, 22, 26] : [229, 231, 235],
    barGreenTip: isDark ? [20, 160, 50] : [20, 140, 40],
    depositLine: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
    areaFillStart: isDark ? 0.14 : 0.1,
    lineGradStart: isDark ? "rgba(21,128,61,0.3)" : "rgba(21,128,61,0.2)",
  };

  return (
    <ComponentShell
      title="Investment Growth Chart"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex items-center justify-center p-4">
        <div
          className={`${styles.card} ${isDark ? styles.cardDark : styles.cardLight}`}
        >
          {/* ════════ FINAL VALUE ════════ */}
          <div className={styles.finalValue}>
            <div className={styles.finalValueAmount}>
              <NumberFlow
                value={Math.round(peak)}
                format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
                transformTiming={{ duration: 400, easing: "ease-out" }}
                spinTiming={{ duration: 400, easing: "ease-out" }}
              />
            </div>
            <div
              className={`${styles.finalValueLabel} ${isDark ? styles.finalValueLabelDark : styles.finalValueLabelLight}`}
            >
              after {YEARS} years at {RATE * 100}% annual return
            </div>
          </div>

          {/* ════════ CHART ════════ */}
          <svg
            viewBox={`0 0 ${W} ${H}`}
            style={{ display: "block", width: "100%", marginTop: 12 }}
          >
            <defs>
              {/* glow around the green line */}
              <filter
                id="lineGlow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="5"
                  result="b"
                />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* broad glow at the tip */}
              <filter
                id="tipGlow"
                x="-200%"
                y="-200%"
                width="500%"
                height="500%"
              >
                <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
              </filter>

              {/* subtle fill under the curve */}
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="#22c55e"
                  stopOpacity={t.areaFillStart}
                />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>

              {/* line color ramp */}
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={t.lineGradStart} />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#86efac" />
              </linearGradient>
            </defs>

            {/* ── year header ── */}
            <text
              x={CL}
              y={18}
              fill={t.headerText}
              fontSize="13"
              fontWeight="500"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {startYear}
            </text>
            <text
              x={CR}
              y={18}
              fill={t.headerText}
              fontSize="13"
              fontWeight="500"
              textAnchor="end"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {startYear + YEARS - 1}
            </text>

            {/* ── gridlines + y labels ── */}
            {gridValues.map((val) => (
              <g key={val}>
                <line
                  x1={CL}
                  y1={yOf(val)}
                  x2={CR}
                  y2={yOf(val)}
                  stroke={t.gridLine}
                  strokeWidth="0.7"
                  strokeDasharray={val === 0 ? undefined : "3 4"}
                />
                <text
                  x={CL - 8}
                  y={yOf(val) + 4}
                  fill={t.gridText}
                  fontSize="11"
                  textAnchor="end"
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {fmtK(val)}
                </text>
              </g>
            ))}

            {/* ── bars ── */}
            {growth.map((val, i) => {
              const bx =
                Math.round(
                  (CL + i * barStep + (barStep - barW) / 2) * 100,
                ) / 100;
              const by = yOf(val);
              const h = Math.round((CB - by) * 100) / 100;
              // Last 2-3 bars transition to green
              const tint = Math.max(0, (i - 26) / 3);
              const r = Math.round(
                t.barBase[0] + tint * (t.barGreenTip[0] - t.barBase[0]),
              );
              const g = Math.round(
                t.barBase[1] + tint * (t.barGreenTip[1] - t.barBase[1]),
              );
              const b = Math.round(
                t.barBase[2] + tint * (t.barGreenTip[2] - t.barBase[2]),
              );
              return (
                <rect
                  key={i}
                  x={bx}
                  y={by}
                  width={barW}
                  height={h}
                  rx={2.5}
                  fill={`rgb(${r}, ${g}, ${b})`}
                  style={{ transition: "y 0.2s ease, height 0.2s ease" }}
                />
              );
            })}

            {/* ── area fill ── */}
            <path
              d={area}
              fill="url(#areaFill)"
              style={{ transition: "d 0.2s ease" }}
            />

            {/* ── tip glow ── */}
            <circle
              cx={pts[YEARS - 1][0]}
              cy={pts[YEARS - 1][1]}
              r={45}
              fill="#4ade80"
              opacity="0.3"
              filter="url(#tipGlow)"
            />
            <circle
              cx={pts[YEARS - 1][0]}
              cy={pts[YEARS - 1][1] + 5}
              r={20}
              fill="#bef264"
              opacity="0.2"
              filter="url(#tipGlow)"
            />

            {/* ── deposit baseline ── */}
            <line
              x1={CL}
              y1={yOf(deposit)}
              x2={CR}
              y2={yOf(deposit)}
              stroke={t.depositLine}
              strokeWidth="1"
            />

            {/* ── green line (glow layer) ── */}
            <path
              d={line}
              fill="none"
              stroke="#4ade80"
              strokeWidth="3"
              filter="url(#lineGlow)"
              opacity="0.5"
            />
            {/* ── green line (crisp layer) ── */}
            <path
              d={line}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* ── x labels ── */}
            <text
              x={CL + barStep / 2}
              y={CB + 20}
              fill={t.gridText}
              fontSize="11"
              textAnchor="middle"
              fontFamily="Inter, system-ui, sans-serif"
            >
              1Y
            </text>
            <text
              x={CL + (YEARS - 0.5) * barStep}
              y={CB + 20}
              fill={t.gridText}
              fontSize="11"
              textAnchor="middle"
              fontFamily="Inter, system-ui, sans-serif"
            >
              30Y
            </text>
          </svg>

          {/* ════════ SIMULATE LABEL ════════ */}
          <p
            className={`${styles.simLabel} ${isDark ? styles.simLabelDark : styles.simLabelLight}`}
          >
            Simulate{" "}
            <span
              className={`${styles.simUnderline} ${isDark ? styles.simUnderlineDark : styles.simUnderlineLight}`}
            >
              one-time deposit
            </span>{" "}
            <span className={styles.simChevron}>&#x25BE;</span>
          </p>

          {/* ════════ SLIDER ════════ */}
          <div className={styles.sliderWrap}>
            {/* value bubble */}
            <div
              className={`${styles.bubble} ${isDark ? styles.bubbleDark : styles.bubbleLight}`}
              style={{
                left: `calc(${pct}% + ${(0.5 - pct / 100) * 28}px)`,
              }}
            >
              <NumberFlow
                value={deposit}
                format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
                transformTiming={{ duration: 250, easing: "ease-out" }}
                spinTiming={{ duration: 250, easing: "ease-out" }}
              />
            </div>

            <input
              type="range"
              className={`${styles.range} ${isDark ? styles.rangeDark : styles.rangeLight}`}
              min={MIN_DEP}
              max={MAX_DEP}
              step={100}
              value={deposit}
              onChange={(e) => setDeposit(+e.target.value)}
            />

            {/* ruler ticks */}
            <div className={styles.ruler}>
              {Array.from({ length: 71 }, (_, i) => {
                const isMajor = i % 10 === 0;
                const isMid = i % 5 === 0;
                return (
                  <div
                    key={i}
                    className={`${styles.tick} ${isDark ? styles.tickDark : styles.tickLight}`}
                    style={{
                      height: isMajor ? 10 : isMid ? 7 : 4,
                      opacity: isMajor ? 0.5 : 0.2,
                    }}
                  />
                );
              })}
            </div>

            {/* labels */}
            <div
              className={`${styles.labels} ${isDark ? styles.labelsDark : styles.labelsLight}`}
            >
              {[2, 3, 4, 5, 6, 7, 8].map((k) => (
                <span key={k}>{k}K</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ComponentShell>
  );
}
