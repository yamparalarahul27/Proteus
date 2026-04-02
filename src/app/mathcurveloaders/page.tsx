"use client";

import { useEffect, useRef, useState } from "react";
import ComponentShell from "@/components/ComponentShell";

type CurveType = {
  id: string;
  label: string;
  description: string;
  color: string;
  draw: (ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => void;
  formula: string;
};

function rose(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.35;
  const k = 5;
  const trail = 120;
  for (let i = 0; i < trail; i++) {
    const angle = t * 4 + (i / trail) * Math.PI * 2;
    const rr = r * Math.cos(k * angle);
    const x = cx + rr * Math.cos(angle);
    const y = cy + rr * Math.sin(angle);
    const alpha = i / trail;
    const size = 2 + alpha * 3;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(129, 98, 255, ${alpha * 0.9})`;
    ctx.fill();
  }
}

function lissajous(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
  const cx = w / 2;
  const cy = h / 2;
  const a = 3;
  const b = 2;
  const rx = Math.min(w, h) * 0.35;
  const ry = Math.min(w, h) * 0.35;
  const trail = 150;
  for (let i = 0; i < trail; i++) {
    const angle = t * 3 + (i / trail) * Math.PI * 2;
    const x = cx + rx * Math.sin(a * angle + Math.PI / 2);
    const y = cy + ry * Math.sin(b * angle);
    const alpha = i / trail;
    const size = 2 + alpha * 3;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(236, 72, 153, ${alpha * 0.9})`;
    ctx.fill();
  }
}

function hypotrochoid(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) * 0.25;
  const rr = R * 0.4;
  const d = R * 0.6;
  const trail = 180;
  for (let i = 0; i < trail; i++) {
    const angle = t * 2 + (i / trail) * Math.PI * 6;
    const x = cx + (R - rr) * Math.cos(angle) + d * Math.cos(((R - rr) / rr) * angle);
    const y = cy + (R - rr) * Math.sin(angle) - d * Math.sin(((R - rr) / rr) * angle);
    const alpha = i / trail;
    const size = 2 + alpha * 3;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(34, 160, 107, ${alpha * 0.9})`;
    ctx.fill();
  }
}

function cardioid(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
  const cx = w / 2;
  const cy = h / 2;
  const a = Math.min(w, h) * 0.16;
  const trail = 120;
  for (let i = 0; i < trail; i++) {
    const angle = t * 3 + (i / trail) * Math.PI * 2;
    const r = 2 * a * (1 + Math.cos(angle));
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    const alpha = i / trail;
    const size = 2 + alpha * 3;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(229, 105, 16, ${alpha * 0.9})`;
    ctx.fill();
  }
}

function cassiniOval(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
  const cx = w / 2;
  const cy = h / 2;
  const a = Math.min(w, h) * 0.22;
  const b = a * (0.9 + 0.15 * Math.sin(t));
  const trail = 140;
  for (let i = 0; i < trail; i++) {
    const angle = t * 2.5 + (i / trail) * Math.PI * 2;
    const cos2 = Math.cos(2 * angle);
    const inner = a * a * cos2 + Math.sqrt(Math.abs(b * b * b * b - a * a * a * a * (1 - cos2 * cos2)));
    const r = Math.sqrt(Math.abs(inner));
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    const alpha = i / trail;
    const size = 2 + alpha * 3;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(29, 122, 252, ${alpha * 0.9})`;
    ctx.fill();
  }
}

function fourierPath(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
  const cx = w / 2;
  const cy = h / 2;
  const scale = Math.min(w, h) * 0.3;
  const trail = 160;
  for (let i = 0; i < trail; i++) {
    const angle = t * 2 + (i / trail) * Math.PI * 2;
    const x = cx + scale * (0.5 * Math.cos(angle) + 0.3 * Math.cos(3 * angle) + 0.15 * Math.cos(5 * angle));
    const y = cy + scale * (0.5 * Math.sin(angle) + 0.3 * Math.sin(3 * angle) + 0.15 * Math.sin(7 * angle));
    const alpha = i / trail;
    const size = 2 + alpha * 3;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(124, 58, 237, ${alpha * 0.9})`;
    ctx.fill();
  }
}

const curves: CurveType[] = [
  {
    id: "rose",
    label: "Rose Curve",
    description: "Petal-shaped polar curve",
    color: "#8162ff",
    draw: rose,
    formula: "r = cos(kθ)",
  },
  {
    id: "lissajous",
    label: "Lissajous",
    description: "Harmonic motion pattern",
    color: "#EC4899",
    draw: lissajous,
    formula: "x = sin(at+δ), y = sin(bt)",
  },
  {
    id: "hypotrochoid",
    label: "Hypotrochoid",
    description: "Spirograph-like curve",
    color: "#22A06B",
    draw: hypotrochoid,
    formula: "x = (R−r)cosθ + d·cos((R−r)θ/r)",
  },
  {
    id: "cardioid",
    label: "Cardioid",
    description: "Heart-shaped curve",
    color: "#E56910",
    draw: cardioid,
    formula: "r = 2a(1 + cosθ)",
  },
  {
    id: "cassini",
    label: "Cassini Oval",
    description: "Product-of-distances curve",
    color: "#1D7AFC",
    draw: cassiniOval,
    formula: "((x−a)²+y²)((x+a)²+y²) = b⁴",
  },
  {
    id: "fourier",
    label: "Fourier Path",
    description: "Superposed harmonics",
    color: "#7C3AED",
    draw: fourierPath,
    formula: "x = Σ aₙcos(nθ), y = Σ bₙsin(nθ)",
  },
];

function CurveCanvas({ curve, size = 180 }: { curve: CurveType; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let startTime = performance.now();

    function animate(now: number) {
      const t = (now - startTime) / 1000;
      ctx!.clearRect(0, 0, size, size);
      curve.draw(ctx!, t, size, size);
      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [curve, size]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-xl"
      style={{ width: size, height: size, background: "#fafafa" }}
    />
  );
}

const CODE_CONTENT = `// Source: https://github.com/paidax01/math-curve-loaders
// Credit: https://x.com/xin_pai88825?s=21

"use client";

import { useEffect, useRef, useState } from "react";

type CurveType = {
  id: string;
  label: string;
  description: string;
  color: string;
  draw: (ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => void;
  formula: string;
};

function rose(ctx, t, w, h) {
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.35, k = 5, trail = 120;
  for (let i = 0; i < trail; i++) {
    const angle = t * 4 + (i / trail) * Math.PI * 2;
    const rr = r * Math.cos(k * angle);
    const x = cx + rr * Math.cos(angle);
    const y = cy + rr * Math.sin(angle);
    const alpha = i / trail;
    ctx.beginPath();
    ctx.arc(x, y, 2 + alpha * 3, 0, Math.PI * 2);
    ctx.fillStyle = \`rgba(129, 98, 255, \${alpha * 0.9})\`;
    ctx.fill();
  }
}

function lissajous(ctx, t, w, h) {
  const cx = w / 2, cy = h / 2;
  const rx = Math.min(w, h) * 0.35, ry = rx;
  const trail = 150;
  for (let i = 0; i < trail; i++) {
    const angle = t * 3 + (i / trail) * Math.PI * 2;
    const x = cx + rx * Math.sin(3 * angle + Math.PI / 2);
    const y = cy + ry * Math.sin(2 * angle);
    const alpha = i / trail;
    ctx.beginPath();
    ctx.arc(x, y, 2 + alpha * 3, 0, Math.PI * 2);
    ctx.fillStyle = \`rgba(236, 72, 153, \${alpha * 0.9})\`;
    ctx.fill();
  }
}

// ... other curve functions follow the same particle-trail pattern

function CurveCanvas({ curve, size = 180 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let startTime = performance.now();
    function animate(now) {
      const t = (now - startTime) / 1000;
      ctx.clearRect(0, 0, size, size);
      curve.draw(ctx, t, size, size);
      animRef.current = requestAnimationFrame(animate);
    }
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [curve, size]);

  return <canvas ref={canvasRef} style={{ width: size, height: size }} />;
}

export default function MathCurveLoadersPage() {
  const [selected, setSelected] = useState(curves[0]);
  return (
    <div>
      {/* Curve selector pills + canvas + formula display */}
    </div>
  );
}`;

const PROMPT_CONTENT = `Build a Math Curve Loaders gallery component in Next.js with animated canvas-based loading animations based on mathematical curves.

Requirements:
- Display 6 mathematical curve loaders: Rose Curve, Lissajous, Hypotrochoid, Cardioid, Cassini Oval, and Fourier Path
- Each loader is drawn on an HTML Canvas using requestAnimationFrame for smooth 60fps animation
- Particles trail along the mathematical curve path with fading opacity for a glowing trail effect
- Include a pill-bar selector to switch between curve types
- Show the active curve's mathematical formula and description
- The selected curve animates in a large canvas preview area
- Show all curves in a small grid below for quick comparison
- Use distinct colors per curve: purple for Rose, pink for Lissajous, green for Hypotrochoid, orange for Cardioid, blue for Cassini, violet for Fourier
- Device pixel ratio aware canvas rendering for crisp output
- Credit: https://x.com/xin_pai88825?s=21
- Inspired by: https://github.com/paidax01/math-curve-loaders`;

export default function MathCurveLoadersPage() {
  const [selected, setSelected] = useState<CurveType>(curves[0]);

  return (
    <ComponentShell
      title="Math Curve Loaders"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex flex-col items-center gap-5 w-full max-w-[600px]">
        {/* Curve selector pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {curves.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-all ${
                selected.id === c.id
                  ? "text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
              style={
                selected.id === c.id
                  ? { backgroundColor: c.color }
                  : undefined
              }
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Main preview */}
        <div className="proteus-panel rounded-[16px] p-6 flex flex-col items-center gap-4">
          <CurveCanvas curve={selected} size={240} />
          <div className="text-center">
            <p className="text-[15px] font-semibold text-[#1f2937]">
              {selected.label}
            </p>
            <p className="text-[12px] text-[#6b7280] mt-0.5">
              {selected.description}
            </p>
            <p
              className="mt-2 inline-block rounded-md px-3 py-1 text-[12px] font-mono font-medium"
              style={{
                backgroundColor: selected.color + "14",
                color: selected.color,
              }}
            >
              {selected.formula}
            </p>
          </div>
        </div>

        {/* Grid of all curves */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {curves.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className={`proteus-panel rounded-[12px] p-3 flex flex-col items-center gap-2 transition-all ${
                selected.id === c.id
                  ? "ring-2 ring-offset-1"
                  : "hover:shadow-md"
              }`}
              style={
                selected.id === c.id
                  ? { outlineColor: c.color, borderColor: c.color }
                  : undefined
              }
            >
              <CurveCanvas curve={c} size={80} />
              <span className="text-[11px] font-medium text-[#374151]">
                {c.label}
              </span>
            </button>
          ))}
        </div>

        {/* Credit */}
        <p className="text-[11px] text-[#9ca3af]">
          Inspired by{" "}
          <a
            href="https://github.com/paidax01/math-curve-loaders"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#6b7280]"
          >
            math-curve-loaders
          </a>
          {" "}by{" "}
          <a
            href="https://x.com/xin_pai88825?s=21"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#6b7280]"
          >
            @xin_pai88825
          </a>
        </p>
      </div>
    </ComponentShell>
  );
}
