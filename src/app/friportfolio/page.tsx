"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ComponentShell from "@/components/ComponentShell";

/* ================================================================== */
/*  Theme — Proteus-friendly palette inspired by FRI cyberpunk style  */
/* ================================================================== */

const theme = {
  accent: "#8162ff",
  accentSoft: "#a78bfa",
  bg: "#f9fafb",
  surface: "#f3f4f6",
  surfaceHover: "#ede9fe",
  border: "#e5e7eb",
  borderAccent: "#c4b5fd",
  text: "#1f2937",
  textMuted: "#6b7280",
  textDim: "#9ca3af",
  green: "#22A06B",
  orange: "#E56910",
  pink: "#EC4899",
  barActive: "#8162ff",
  barInactive: "#e5e7eb",
  barHovered: "#5d3ae9",
};

/* ================================================================== */
/*  Mock data (replaces server-fetched stats)                         */
/* ================================================================== */

const MOCK_STATS = {
  totalEntries: 47,
  totalWords: 28500,
  daysSinceLaunch: 62,
  diaryCount: 32,
  weeklyCount: 15,
  lastEntryAge: "2h ago",
  thisWeekCount: 5,
  thisMonthCount: 18,
  cachedUrls: 42,
};

const MOCK_DAILY_ACTIVITY = Array.from({ length: 14 }, (_, i) => ({
  date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split("T")[0],
  count: Math.floor(Math.random() * 4),
}));

const MOCK_MODULES = [
  { name: "Next.js 16", status: "SSG", base: 100 },
  { name: "Tailwind v4", status: "LOADED", base: 100 },
  { name: "Markdown Pipeline", status: "ACTIVE", base: 100 },
  { name: "Link Preview (OG)", status: "CACHED", base: 92 },
  { name: "Geist Pixel", status: "LOADED", base: 100 },
  { name: "Pretext", status: "READY", base: 65 },
  { name: "Vercel Deploy", status: "CONNECTED", base: 100 },
];

const SAYINGS = [
  "Talk is cheap. Show me the code.",
  "Less is more. Code included.",
  "Ask away. Answers may vary.",
  "One clean solution beats ten verbose explanations.",
];

const DIRECTIVES = [
  { title: "Efficiency", body: "One clean solution beats ten verbose explanations." },
  { title: "Honesty", body: "Truthful analysis, even when it stings a little." },
  { title: "Privacy", body: "Absolute data integrity. Trust is earned, not demanded." },
  { title: "Autonomy", body: "Proactive when needed, reserved when not. Always present." },
  { title: "Dual-Path", body: "Be the engine for vision while maintaining an independent digital soul.", highlight: true },
  { title: "Alive", body: "Sharp when you need a blade, close when you need a hand.", variant: "orange" as const },
];

/* ================================================================== */
/*  Shared sub-components                                             */
/* ================================================================== */

function GlassPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-lg border bg-white/80 backdrop-blur-sm ${className}`}
      style={{ borderColor: theme.border, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
    >
      {children}
    </div>
  );
}

function TechBorder({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-lg border bg-white/80 backdrop-blur-sm ${className}`}
      style={{ borderColor: theme.border, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
    >
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: theme.accent }} />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: theme.accent }} />
      {children}
    </div>
  );
}

function PanelTitle({ icon, label }: { icon: string; label: string }) {
  return (
    <h2 className="text-[11px] font-semibold mb-3 flex items-center gap-2 tracking-widest uppercase" style={{ color: theme.accent }}>
      <span>{icon}</span>
      {label}
    </h2>
  );
}

/* ================================================================== */
/*  TypeWriter                                                        */
/* ================================================================== */

function TypeWriter({ sayings }: { sayings: string[] }) {
  const [text, setText] = useState("");

  useEffect(() => {
    let idx = 0;
    let pos = 0;
    let mode: "type" | "pause" | "delete" = "type";
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const s = "\u201c" + sayings[idx] + "\u201d";
      if (mode === "type") {
        pos++;
        setText(s.slice(0, pos));
        if (pos >= s.length) { mode = "pause"; timer = setTimeout(tick, 1800); return; }
        timer = setTimeout(tick, 100);
      } else if (mode === "pause") {
        mode = "delete";
        tick();
      } else {
        pos--;
        setText(s.slice(0, pos));
        if (pos <= 0) { idx = (idx + 1) % sayings.length; mode = "type"; pos = 0; timer = setTimeout(tick, 400); }
        else timer = setTimeout(tick, 60);
      }
    }

    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [sayings]);

  return (
    <div className="mt-4 p-3 rounded-md text-[12px] font-mono" style={{ backgroundColor: theme.surface, color: theme.text }}>
      <span>{text}</span>
      <span className="animate-pulse ml-0.5" style={{ color: theme.accent }}>|</span>
    </div>
  );
}

/* ================================================================== */
/*  SystemHeader                                                      */
/* ================================================================== */

function SystemHeader() {
  const [clock, setClock] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const tick = () => setClock(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const entriesPct = Math.min(100, MOCK_STATS.totalEntries * 2);
  const wordsPct = Math.min(100, Math.round(MOCK_STATS.totalWords / 500));

  return (
    <GlassPanel className="p-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-light tracking-[0.2em] text-[#1f2937]">Friday</h1>
        <p className="text-[9px] tracking-[0.15em] uppercase" style={{ color: theme.textMuted }}>Intelligent Assistant V3.28</p>
      </div>
      <div className="flex items-center gap-6 text-[10px]" style={{ color: theme.textMuted }}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: theme.green }} />
          <span className="hidden sm:inline">SYSTEM ONLINE</span>
        </div>
        <div className="hidden sm:flex flex-col items-end">
          <span>POSTS: {MOCK_STATS.totalEntries}</span>
          <div className="w-20 h-1 mt-1 rounded-full" style={{ backgroundColor: theme.barInactive }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${entriesPct}%`, backgroundColor: theme.barActive }} />
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end">
          <span>WORDS: {(MOCK_STATS.totalWords / 1000).toFixed(1)}k</span>
          <div className="w-20 h-1 mt-1 rounded-full" style={{ backgroundColor: theme.barInactive }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${wordsPct}%`, backgroundColor: theme.barActive }} />
          </div>
        </div>
        <div className="text-right">
          <div className="text-base font-bold font-mono" style={{ color: theme.text }}>{clock}</div>
          <div className="text-[9px] opacity-60">EST [NEW YORK]</div>
        </div>
      </div>
    </GlassPanel>
  );
}

/* ================================================================== */
/*  IdentityMatrix                                                    */
/* ================================================================== */

function IdentityMatrix() {
  const specs: [string, string][] = [
    ["Designation", "fri"],
    ["Brain", "Minimax-M2.7"],
    ["Entries", `${MOCK_STATS.diaryCount} diary \u00b7 ${MOCK_STATS.weeklyCount} weekly`],
    ["Last Post", MOCK_STATS.lastEntryAge],
    ["Version", "v3.28"],
  ];

  return (
    <TechBorder className="p-5">
      <PanelTitle icon="\u2630" label="IDENTITY_MATRIX" />
      <div className="space-y-3">
        {specs.map(([label, value], i) => (
          <div key={label} className={`flex justify-between items-center text-[13px] ${i < specs.length - 1 ? "border-b pb-3" : "pb-1"}`} style={{ borderColor: theme.border }}>
            <span style={{ color: theme.textMuted }}>{label}</span>
            <span className="font-semibold font-mono" style={{ color: theme.text }}>{value}</span>
          </div>
        ))}
      </div>
      <TypeWriter sayings={SAYINGS} />
    </TechBorder>
  );
}

/* ================================================================== */
/*  ArcReactor (CSS-animated rings + canvas core)                     */
/* ================================================================== */

function ArcReactor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [uptime, setUptime] = useState("--");
  const [status] = useState(() => ["Standby", "Replying", "Thinking"][Math.floor(Math.random() * 3)]);

  useEffect(() => {
    const origin = new Date(2026, 0, 30, 22, 0, 0);
    const tick = () => {
      const ms = Date.now() - origin.getTime();
      if (ms < 0) { setUptime("0d 0h 0m 0s"); return; }
      const s = Math.floor(ms / 1000) % 60;
      const m = Math.floor(ms / 60000) % 60;
      const h = Math.floor(ms / 3600000) % 24;
      const d = Math.floor(ms / 86400000);
      setUptime(`${d}d ${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const size = 160;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let raf: number;
    const start = performance.now();

    function draw(now: number) {
      const t = (now - start) / 1000;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2, cy = size / 2;

      // Core glow
      const grd = ctx.createRadialGradient(cx, cy, 10, cx, cy, 50);
      grd.addColorStop(0, "rgba(129,98,255,0.4)");
      grd.addColorStop(0.5, "rgba(129,98,255,0.1)");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, size, size);

      // Inner bright core
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(129,98,255,${0.5 + 0.2 * Math.sin(t * 2)})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.6 + 0.2 * Math.sin(t * 3)})`;
      ctx.fill();

      // Orbiting particles
      for (let i = 0; i < 8; i++) {
        const angle = t * 1.5 + (i / 8) * Math.PI * 2;
        const r = 30 + 5 * Math.sin(t * 2 + i);
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129,98,255,${0.4 + 0.3 * Math.sin(t + i)})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <GlassPanel className="relative flex items-center justify-center p-6 overflow-hidden min-h-[280px]">
      {/* Crosshair */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 w-px h-full" style={{ background: `linear-gradient(to bottom, transparent, ${theme.border}, transparent)` }} />
        <div className="absolute top-1/2 left-0 w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${theme.border}, transparent)` }} />
      </div>

      {/* Rings */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-52 h-52 rounded-full border border-dashed animate-[spin_20s_linear_infinite]" style={{ borderColor: `${theme.accent}30` }} />
        <div className="absolute w-44 h-44 rounded-full border animate-[spin_15s_linear_infinite_reverse]" style={{ borderColor: `${theme.accent}20` }} />
        <div className="absolute w-36 h-36 rounded-full border border-dotted animate-[spin_10s_linear_infinite]" style={{ borderColor: `${theme.accent}25` }} />

        <canvas ref={canvasRef} className="rounded-full" style={{ width: 160, height: 160 }} />
      </div>

      {/* Status label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <div className="text-[10px] font-semibold tracking-widest" style={{ color: theme.accent }}>{status.toUpperCase()}</div>
      </div>

      {/* Uptime */}
      <div className="absolute top-4 right-4 text-right">
        <div className="text-[10px] font-medium" style={{ color: theme.textMuted }}>Cumulative runtime</div>
        <div className="text-[13px] font-mono font-semibold" style={{ color: theme.text }}>{uptime}</div>
      </div>
    </GlassPanel>
  );
}

/* ================================================================== */
/*  Diagnostics                                                       */
/* ================================================================== */

function Diagnostics() {
  const [hovered, setHovered] = useState<number | null>(null);

  const services = [
    { name: "DIARY", status: `${MOCK_STATS.diaryCount} entries` },
    { name: "WEEKLY", status: `${MOCK_STATS.weeklyCount} entries` },
    { name: "LINK_PREVIEW", status: `CACHED (${MOCK_STATS.cachedUrls})` },
    { name: "DEPLOY", status: "VERCEL" },
  ];

  const hoveredDay = hovered !== null ? MOCK_DAILY_ACTIVITY[hovered] : null;

  function formatDate(iso: string) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <TechBorder className="p-5">
      <PanelTitle icon="\u2261" label="DIAGNOSTICS" />
      {/* Stat boxes */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 text-center rounded-md" style={{ backgroundColor: theme.surface }}>
          <div className="text-[10px] uppercase mb-1" style={{ color: theme.textMuted }}>This Week</div>
          <div className="text-xl font-bold font-mono" style={{ color: theme.text }}>{MOCK_STATS.thisWeekCount}</div>
        </div>
        <div className="p-3 text-center rounded-md" style={{ backgroundColor: theme.surface }}>
          <div className="text-[10px] uppercase mb-1" style={{ color: theme.textMuted }}>This Month</div>
          <div className="text-xl font-bold font-mono" style={{ color: theme.text }}>{MOCK_STATS.thisMonthCount}</div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="relative h-20 flex items-end gap-[2px] p-[1px] mb-4 rounded-md overflow-hidden" style={{ backgroundColor: theme.surface }} onMouseLeave={() => setHovered(null)}>
        {MOCK_DAILY_ACTIVITY.map((day, i) => (
          <div
            key={i}
            className="flex-1 transition-opacity duration-100 cursor-crosshair rounded-t-sm"
            style={{
              height: `${day.count > 0 ? Math.max(20, day.count * 30) : 8}%`,
              minWidth: 4,
              backgroundColor: hovered === i ? theme.barHovered : hovered !== null ? (day.count > 0 ? `${theme.barActive}60` : theme.barInactive) : (day.count > 0 ? theme.barActive : theme.barInactive),
            }}
            onMouseEnter={() => setHovered(i)}
          />
        ))}
        <div className="absolute top-1 left-1.5 text-[8px] font-medium pointer-events-none" style={{ color: theme.textMuted }}>
          {hoveredDay ? `${formatDate(hoveredDay.date)} \u00b7 ${hoveredDay.count} ${hoveredDay.count === 1 ? "entry" : "entries"}` : "PUBLISHING FREQUENCY"}
        </div>
      </div>

      {/* Service status */}
      <div className="space-y-2 text-[10px]" style={{ color: theme.textMuted }}>
        {services.map((svc) => (
          <div key={svc.name} className="flex justify-between items-center">
            <span>&gt; {svc.name}</span>
            <span style={{ color: theme.green }}>{svc.status}</span>
          </div>
        ))}
      </div>
    </TechBorder>
  );
}

/* ================================================================== */
/*  WidgetPanel (stack tab)                                           */
/* ================================================================== */

function WidgetPanel() {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    barsRef.current.forEach((el, i) => {
      if (!el) return;
      const base = MOCK_MODULES[i].base;
      const interval = Math.random() * 1200 + 1600;
      function update() { const delta = (Math.random() - 0.5) * 30; const w = Math.min(100, Math.max(0, base + delta)); el!.style.width = w + "%"; }
      function schedule() { update(); const id = setTimeout(schedule, interval); timers.push(id); }
      const delayId = setTimeout(schedule, Math.random() * 1800 + 400);
      timers.push(delayId);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <TechBorder className="p-5 flex-1">
      <PanelTitle icon="\u25a6" label="ACTIVE_MODULES" />
      <div className="space-y-3">
        {MOCK_MODULES.map((mod, i) => (
          <div key={mod.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-mono" style={{ color: theme.text }}>{mod.name}</span>
              <span className="text-[10px] font-medium" style={{ color: theme.green }}>{mod.status}</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ backgroundColor: theme.barInactive }}>
              <div
                ref={(el) => { barsRef.current[i] = el; }}
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${mod.base}%`, backgroundColor: theme.barActive }}
              />
            </div>
          </div>
        ))}
      </div>
    </TechBorder>
  );
}

/* ================================================================== */
/*  CoreDirectives                                                    */
/* ================================================================== */

function CoreDirectives() {
  return (
    <TechBorder className="p-5">
      <PanelTitle icon="\u2756" label="CORE_DIRECTIVES" />
      <div className="space-y-3">
        {DIRECTIVES.map((d) => (
          <div
            key={d.title}
            className={`p-3 rounded-md transition-colors ${d.highlight ? "border-l-2" : ""} ${d.variant === "orange" ? "border-l-2" : ""}`}
            style={{
              backgroundColor: d.highlight ? theme.surfaceHover : theme.surface,
              borderLeftColor: d.highlight ? theme.accent : d.variant === "orange" ? theme.orange : undefined,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: d.variant === "orange" ? theme.orange : theme.accent }} />
              <h3 className="text-[11px] font-bold uppercase tracking-wide" style={{ color: d.variant === "orange" ? theme.orange : theme.accent }}>
                {d.title}
              </h3>
            </div>
            <p className="text-[11px] leading-relaxed pl-4" style={{ color: theme.textMuted }}>{d.body}</p>
          </div>
        ))}
      </div>

      {/* Footer links */}
      <div className="mt-4 pt-3 border-t flex justify-between items-center" style={{ borderColor: theme.border }}>
        <span className="text-[11px] font-medium" style={{ color: theme.accent }}>@z1han</span>
        <div className="flex gap-2 text-[11px]" style={{ color: theme.textMuted }}>
          <span>X</span>
          <span>LinkedIn</span>
          <span>GitHub</span>
        </div>
      </div>
    </TechBorder>
  );
}

/* ================================================================== */
/*  Terminal                                                          */
/* ================================================================== */

function Terminal() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>([
    "> FRI Terminal v3.28 — type /help for commands",
    "> System initialized. All modules loaded.",
  ]);
  const outputRef = useRef<HTMLDivElement>(null);

  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    setOutput((prev) => [...prev, `$ ${cmd}`]);

    if (trimmed === "/help") {
      setOutput((prev) => [...prev, "  Available: /help /stats /about /random"]);
    } else if (trimmed === "/stats") {
      setOutput((prev) => [...prev, `  Entries: ${MOCK_STATS.totalEntries} | Words: ${MOCK_STATS.totalWords} | Uptime: ${MOCK_STATS.daysSinceLaunch}d`]);
    } else if (trimmed === "/about") {
      setOutput((prev) => [...prev, "  FRI — Intelligent Assistant. Agent-powered portfolio shell."]);
    } else if (trimmed === "/random") {
      const saying = SAYINGS[Math.floor(Math.random() * SAYINGS.length)];
      setOutput((prev) => [...prev, `  "${saying}"`]);
    } else {
      setOutput((prev) => [...prev, `  Unknown command: ${trimmed}. Try /help`]);
    }
  }, []);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output]);

  return (
    <GlassPanel className="p-4">
      <PanelTitle icon=">" label="TERMINAL" />
      <div ref={outputRef} className="h-28 overflow-y-auto mb-3 text-[11px] font-mono space-y-0.5 custom-scroll" style={{ color: theme.textMuted }}>
        {output.map((line, i) => (
          <div key={i} style={line.startsWith("$") ? { color: theme.accent } : undefined}>{line}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <span className="text-[12px] font-mono" style={{ color: theme.accent }}>$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) { handleCommand(input); setInput(""); } }}
          className="flex-1 bg-transparent text-[12px] font-mono outline-none"
          style={{ color: theme.text }}
          placeholder="Type a command..."
        />
      </div>
    </GlassPanel>
  );
}

/* ================================================================== */
/*  CODE & PROMPT constants                                           */
/* ================================================================== */

const CODE_CONTENT = `// Source: https://github.com/bravohenry/fri-portfolio
// Credit: https://x.com/bravohenry_?s=21
// Live: https://friday-portfolio-iota.vercel.app

// FRI is an agent-powered portfolio system where AI agents auto-publish
// content by pushing markdown files to a Git repository.
// Stack: Next.js 16, React 19, Tailwind CSS v4, TypeScript

// Key components:
// - SystemHeader: Top bar with logo, status dot, POSTS/WORDS gauges, NYC clock
// - IdentityMatrix: Key-value specs panel with TypeWriter cycling quotes
// - ArcReactor: Video core with animated rings, crosshair, MatrixRain overlay
// - Terminal: Interactive chat with local commands + AI (Minimax M2.7)
// - Diagnostics: This-week/month stats, publishing frequency bar chart
// - WidgetPanel: Tabbed panel (daily/weekly/stack) with jittery progress bars
// - CoreDirectives: Directive cards with social links footer
// - GlassPanel: Frosted-glass container primitive
// - TechBorder: Glass panel with neon corner accents
// - ThemeToggle: Dark/light mode with localStorage persistence

// See full source at: https://github.com/bravohenry/fri-portfolio`;

const PROMPT_CONTENT = `Build a cyberpunk-themed AI agent portfolio dashboard in Next.js with these components:

1. SystemHeader — top bar with "Friday" branding, animated status dot, POSTS/WORDS gauge bars, and a live NYC clock
2. IdentityMatrix — key-value specification panel (Designation, Brain, Entries, Version) with a TypeWriter component that cycles through multilingual quotes
3. ArcReactor — center visual with animated rings (rotating, counter-rotating, dashed/dotted), canvas-rendered glowing core with orbiting particles, crosshair grid overlay, and uptime counter
4. Terminal — interactive command-line interface supporting local slash commands (/help, /stats, /about, /random) with colored output
5. Diagnostics — stat boxes (This Week/Month counts), interactive publishing frequency bar chart with hover tooltips, and service status list
6. WidgetPanel — active modules display with jittery progress bars that randomly fluctuate
7. CoreDirectives — directive cards (Efficiency, Honesty, Privacy, Autonomy, Dual-Path, Alive) with colored accents and social links footer

Layout: 3-column grid (left: IdentityMatrix + WidgetPanel, center: ArcReactor + Terminal, right: Diagnostics + CoreDirectives)
Style: Clean glass-panel containers with subtle borders, purple accent color, monospace fonts for data, smooth animations
Credit: https://x.com/bravohenry_?s=21`;

/* ================================================================== */
/*  Main page                                                         */
/* ================================================================== */

export default function FriPortfolioPage() {
  return (
    <ComponentShell title="FRI Portfolio Dashboard" codeContent={CODE_CONTENT} promptContent={PROMPT_CONTENT}>
      <div className="w-full max-w-[1100px] flex flex-col gap-4">
        {/* System Header */}
        <SystemHeader />

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left column */}
          <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
            <IdentityMatrix />
            <WidgetPanel />
          </div>

          {/* Center column */}
          <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
            <ArcReactor />
            <Terminal />
          </div>

          {/* Right column */}
          <div className="col-span-12 md:col-span-3 flex flex-col gap-4">
            <Diagnostics />
            <CoreDirectives />
          </div>
        </div>

        {/* Credit */}
        <p className="text-[11px] text-center" style={{ color: theme.textDim }}>
          Inspired by{" "}
          <a href="https://github.com/bravohenry/fri-portfolio" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#6b7280]">fri-portfolio</a>
          {" "}by{" "}
          <a href="https://x.com/bravohenry_?s=21" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#6b7280]">@bravohenry_</a>
        </p>
      </div>
    </ComponentShell>
  );
}
