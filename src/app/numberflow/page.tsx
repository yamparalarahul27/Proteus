"use client";

import { useState, useEffect, useCallback } from "react";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import { continuous } from "number-flow/plugins";
import ComponentShell from "@/components/ComponentShell";

/* ------------------------------------------------------------------ */
/*  Tab type                                                           */
/* ------------------------------------------------------------------ */

type TabId =
  | "basic"
  | "currency"
  | "percent"
  | "compact"
  | "countdown"
  | "input"
  | "continuous"
  | "trend";

const tabs: { id: TabId; label: string }[] = [
  { id: "basic", label: "Basic" },
  { id: "currency", label: "Currency" },
  { id: "percent", label: "Percent" },
  { id: "compact", label: "Compact" },
  { id: "countdown", label: "Countdown" },
  { id: "input", label: "Input" },
  { id: "continuous", label: "Continuous" },
  { id: "trend", label: "Trend" },
];

/* ------------------------------------------------------------------ */
/*  Basic                                                              */
/* ------------------------------------------------------------------ */

function BasicDemo() {
  const [value, setValue] = useState(321);
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-[12px] text-[#6b7280]">
        Click to randomize the number
      </p>
      <button
        onClick={() => setValue(Math.floor(Math.random() * 10000))}
        className="rounded-xl bg-white border border-gray-200 px-8 py-5 shadow-sm hover:shadow-md transition-shadow"
      >
        <NumberFlow
          value={value}
          className="text-4xl sm:text-5xl font-semibold text-[#1f2937]"
          transformTiming={{ duration: 500, easing: "ease-out" }}
        />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Currency                                                           */
/* ------------------------------------------------------------------ */

function CurrencyDemo() {
  const [price, setPrice] = useState(1234.56);
  const currencies = ["USD", "EUR", "GBP", "JPY"] as const;
  const [currency, setCurrency] = useState<string>("USD");

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        {currencies.map((c) => (
          <button
            key={c}
            onClick={() => setCurrency(c)}
            className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all ${
              currency === c
                ? "bg-[#8162ff] text-white"
                : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="rounded-xl bg-white border border-gray-200 px-8 py-5 shadow-sm">
        <NumberFlow
          value={price}
          format={{
            style: "currency",
            currency,
            trailingZeroDisplay: "stripIfInteger",
          }}
          className="text-3xl sm:text-4xl font-semibold text-[#1f2937]"
          transformTiming={{ duration: 500, easing: "ease-out" }}
        />
      </div>
      <button
        onClick={() => setPrice(+(Math.random() * 9999).toFixed(2))}
        className="text-[12px] text-[#8162ff] font-medium hover:underline"
      >
        Randomize price
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Percent                                                            */
/* ------------------------------------------------------------------ */

function PercentDemo() {
  const [value, setValue] = useState(0.856);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-xl bg-white border border-gray-200 px-8 py-5 shadow-sm">
        <NumberFlow
          value={value}
          format={{ style: "percent", minimumFractionDigits: 1 }}
          className="text-3xl sm:text-4xl font-semibold text-[#1f2937]"
          transformTiming={{ duration: 500, easing: "ease-out" }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(value * 100)}
        onChange={(e) => setValue(+e.target.value / 100)}
        className="w-[200px] sm:w-[260px] accent-[#8162ff]"
      />
      <p className="text-[11px] text-[#9ca3af]">Drag to change percentage</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Compact notation                                                   */
/* ------------------------------------------------------------------ */

function CompactDemo() {
  const presets = [1_234, 56_789, 1_234_567, 98_765_432];
  const [value, setValue] = useState(1_234_567);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-xl bg-white border border-gray-200 px-8 py-5 shadow-sm">
        <NumberFlow
          value={value}
          format={{
            notation: "compact",
            compactDisplay: "short",
            maximumFractionDigits: 1,
          }}
          className="text-3xl sm:text-4xl font-semibold text-[#1f2937]"
          willChange
          transformTiming={{ duration: 500, easing: "ease-out" }}
        />
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => setValue(p)}
            className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all ${
              value === p
                ? "bg-[#8162ff] text-white"
                : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {p.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Countdown                                                          */
/* ------------------------------------------------------------------ */

function CountdownDemo() {
  const [total, setTotal] = useState(3661);

  useEffect(() => {
    const id = setInterval(() => {
      setTotal((prev) => (prev <= 0 ? 3661 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const hh = Math.floor(total / 3600);
  const mm = Math.floor((total % 3600) / 60);
  const ss = total % 60;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-xl bg-white border border-gray-200 px-6 sm:px-8 py-5 shadow-sm">
        <NumberFlowGroup>
          <div
            className="flex items-baseline text-3xl sm:text-5xl font-semibold text-[#1f2937]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            <NumberFlow
              trend={-1}
              value={hh}
              format={{ minimumIntegerDigits: 2 }}
              transformTiming={{ duration: 500, easing: "ease-out" }}
            />
            <NumberFlow
              prefix=":"
              trend={-1}
              value={mm}
              digits={{ 1: { max: 5 } }}
              format={{ minimumIntegerDigits: 2 }}
              transformTiming={{ duration: 500, easing: "ease-out" }}
            />
            <NumberFlow
              prefix=":"
              trend={-1}
              value={ss}
              digits={{ 1: { max: 5 } }}
              format={{ minimumIntegerDigits: 2 }}
              transformTiming={{ duration: 500, easing: "ease-out" }}
            />
          </div>
        </NumberFlowGroup>
      </div>
      <p className="text-[11px] text-[#9ca3af]">
        Live countdown with NumberFlowGroup sync
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Input with +/- buttons                                             */
/* ------------------------------------------------------------------ */

function InputDemo() {
  const [value, setValue] = useState(5);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-0 rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setValue((v) => Math.max(0, v - 1))}
          className="px-4 sm:px-5 py-4 text-xl font-medium text-[#6b7280] hover:bg-gray-50 transition-colors border-r border-gray-200"
        >
          −
        </button>
        <div className="px-6 sm:px-10 py-4">
          <NumberFlow
            value={value}
            className="text-3xl sm:text-4xl font-semibold text-[#1f2937]"
            transformTiming={{ duration: 300, easing: "ease-out" }}
          />
        </div>
        <button
          onClick={() => setValue((v) => Math.min(99, v + 1))}
          className="px-4 sm:px-5 py-4 text-xl font-medium text-[#6b7280] hover:bg-gray-50 transition-colors border-l border-gray-200"
        >
          +
        </button>
      </div>
      <p className="text-[11px] text-[#9ca3af]">
        Stepper input — tap +/− to change
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Continuous plugin                                                  */
/* ------------------------------------------------------------------ */

function ContinuousDemo() {
  const [value, setValue] = useState(50);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-xl bg-white border border-gray-200 px-8 py-5 shadow-sm">
        <NumberFlow
          value={value}
          plugins={[continuous]}
          willChange
          isolate
          className="text-4xl sm:text-5xl font-semibold text-[#1f2937]"
          transformTiming={{ duration: 750, easing: "ease-out" }}
          opacityTiming={{ duration: 250, easing: "ease-out" }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(+e.target.value)}
        className="w-[200px] sm:w-[260px] accent-[#8162ff]"
      />
      <p className="text-[11px] text-[#9ca3af]">
        Digits scroll through intermediate numbers
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Trend demo                                                         */
/* ------------------------------------------------------------------ */

function TrendDemo() {
  const [value, setValue] = useState(42);
  const [lastDelta, setLastDelta] = useState(0);

  const bump = useCallback(
    (dir: 1 | -1) => {
      const delta = Math.floor(Math.random() * 20) + 1;
      setValue((v) => Math.max(0, v + dir * delta));
      setLastDelta(dir * delta);
    },
    []
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-xl bg-white border border-gray-200 px-8 py-5 shadow-sm flex flex-col items-center gap-2">
        <NumberFlow
          value={value}
          trend={(oldVal, newVal) => Math.sign(newVal - oldVal) as -1 | 0 | 1}
          className="text-4xl sm:text-5xl font-semibold text-[#1f2937]"
          transformTiming={{ duration: 500, easing: "ease-out" }}
        />
        {lastDelta !== 0 && (
          <span
            className="text-[13px] font-medium"
            style={{ color: lastDelta > 0 ? "#22A06B" : "#E56910" }}
          >
            {lastDelta > 0 ? "▲" : "▼"} {Math.abs(lastDelta)}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => bump(-1)}
          className="rounded-lg px-4 py-2 text-[12px] font-medium bg-white border border-gray-200 text-[#E56910] hover:bg-orange-50 transition-colors"
        >
          ▼ Decrease
        </button>
        <button
          onClick={() => bump(1)}
          className="rounded-lg px-4 py-2 text-[12px] font-medium bg-white border border-gray-200 text-[#22A06B] hover:bg-green-50 transition-colors"
        >
          ▲ Increase
        </button>
      </div>
      <p className="text-[11px] text-[#9ca3af]">
        Digits spin up or down based on value direction
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Variant map                                                        */
/* ------------------------------------------------------------------ */

const demos: Record<TabId, () => React.JSX.Element> = {
  basic: BasicDemo,
  currency: CurrencyDemo,
  percent: PercentDemo,
  compact: CompactDemo,
  countdown: CountdownDemo,
  input: InputDemo,
  continuous: ContinuousDemo,
  trend: TrendDemo,
};

/* ------------------------------------------------------------------ */
/*  CODE / PROMPT                                                      */
/* ------------------------------------------------------------------ */

const CODE_CONTENT = `"use client";

import { useState, useEffect, useCallback } from "react";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import { continuous } from "number-flow/plugins";

// --- Basic ---
function BasicDemo() {
  const [value, setValue] = useState(321);
  return (
    <button onClick={() => setValue(Math.floor(Math.random() * 10000))}>
      <NumberFlow
        value={value}
        className="text-5xl font-semibold"
        transformTiming={{ duration: 500, easing: "ease-out" }}
      />
    </button>
  );
}

// --- Currency ---
function CurrencyDemo() {
  const [price, setPrice] = useState(1234.56);
  const [currency, setCurrency] = useState("USD");
  return (
    <NumberFlow
      value={price}
      format={{ style: "currency", currency, trailingZeroDisplay: "stripIfInteger" }}
      className="text-4xl font-semibold"
      transformTiming={{ duration: 500, easing: "ease-out" }}
    />
  );
}

// --- Percent ---
function PercentDemo() {
  const [value, setValue] = useState(0.856);
  return (
    <>
      <NumberFlow
        value={value}
        format={{ style: "percent", minimumFractionDigits: 1 }}
        className="text-4xl font-semibold"
      />
      <input type="range" min={0} max={100} value={Math.round(value * 100)}
        onChange={(e) => setValue(+e.target.value / 100)} />
    </>
  );
}

// --- Compact Notation ---
function CompactDemo() {
  const [value, setValue] = useState(1_234_567);
  return (
    <NumberFlow
      value={value}
      format={{ notation: "compact", compactDisplay: "short", maximumFractionDigits: 1 }}
      className="text-4xl font-semibold"
      willChange
    />
  );
}

// --- Countdown (NumberFlowGroup) ---
function CountdownDemo() {
  const [total, setTotal] = useState(3661);
  useEffect(() => {
    const id = setInterval(() => setTotal((p) => (p <= 0 ? 3661 : p - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = Math.floor(total / 3600);
  const mm = Math.floor((total % 3600) / 60);
  const ss = total % 60;
  return (
    <NumberFlowGroup>
      <div style={{ fontVariantNumeric: "tabular-nums" }} className="flex items-baseline text-5xl font-semibold">
        <NumberFlow trend={-1} value={hh} format={{ minimumIntegerDigits: 2 }} />
        <NumberFlow prefix=":" trend={-1} value={mm} digits={{ 1: { max: 5 } }} format={{ minimumIntegerDigits: 2 }} />
        <NumberFlow prefix=":" trend={-1} value={ss} digits={{ 1: { max: 5 } }} format={{ minimumIntegerDigits: 2 }} />
      </div>
    </NumberFlowGroup>
  );
}

// --- Input stepper ---
function InputDemo() {
  const [value, setValue] = useState(5);
  return (
    <div className="flex items-center">
      <button onClick={() => setValue((v) => Math.max(0, v - 1))}>\\u2212</button>
      <NumberFlow value={value} className="text-4xl font-semibold" />
      <button onClick={() => setValue((v) => Math.min(99, v + 1))}>+</button>
    </div>
  );
}

// --- Continuous plugin ---
function ContinuousDemo() {
  const [value, setValue] = useState(50);
  return (
    <>
      <NumberFlow
        value={value}
        plugins={[continuous]}
        willChange isolate
        className="text-5xl font-semibold"
        transformTiming={{ duration: 750, easing: "ease-out" }}
        opacityTiming={{ duration: 250, easing: "ease-out" }}
      />
      <input type="range" min={0} max={100} value={value}
        onChange={(e) => setValue(+e.target.value)} />
    </>
  );
}

// --- Trend ---
function TrendDemo() {
  const [value, setValue] = useState(42);
  return (
    <NumberFlow
      value={value}
      trend={(oldVal, newVal) => Math.sign(newVal - oldVal)}
      className="text-5xl font-semibold"
    />
  );
}`;

const PROMPT_CONTENT = `Build a NumberFlow showcase page in Next.js using @number-flow/react (by Maxwell Barvian) with 8 interactive variants in tabs:

1. Basic — click to randomize a number with smooth digit transitions
2. Currency — format as USD/EUR/GBP/JPY with currency switcher pills
3. Percent — slider-controlled percentage with minimumFractionDigits
4. Compact — compact notation (1.2M, 56.8K) with preset value buttons
5. Countdown — live HH:MM:SS countdown using NumberFlowGroup to sync three NumberFlow instances, with trend={-1} and digits constraints
6. Input — stepper with +/- buttons, animated number in the center
7. Continuous — continuous plugin for fluid intermediate number scrolling, controlled by a range slider
8. Trend — custom trend function that spins digits up/down based on value direction, with increase/decrease buttons

Requirements:
- Install: npm install @number-flow/react
- Use tabular-nums for countdown alignment
- All demos responsive (text-3xl on mobile, text-5xl on desktop)
- Each variant in its own tab pill
- Wrap in ComponentShell with credit link
- Credit: https://number-flow.barvian.me by @mbarvian`;

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function NumberFlowPage() {
  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const Demo = demos[activeTab];

  return (
    <ComponentShell
      title="NumberFlow"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="flex flex-col items-center gap-6 w-full max-w-[600px]">
        {/* Tab pills — scrollable on mobile */}
        <div className="w-full overflow-x-auto hide-scrollbar">
          <div className="flex items-center justify-center gap-1.5 min-w-max px-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-3 py-1.5 text-[11px] sm:text-[12px] font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#8162ff] text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Demo area */}
        <div className="proteus-panel rounded-[16px] p-6 sm:p-8 w-full flex flex-col items-center min-h-[200px] justify-center">
          <Demo />
        </div>

        {/* Props reference */}
        <div className="proteus-panel rounded-[12px] p-5 w-full">
          <p className="text-[13px] font-semibold text-[#1f2937] mb-3">
            Key Props
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[12px]">
            {[
              ["value", "number — the value to animate"],
              ["format", "Intl.NumberFormatOptions"],
              ["locales", "locale string(s) for formatting"],
              ["prefix / suffix", "static text around the number"],
              ["transformTiming", "{ duration, easing } for layout"],
              ["spinTiming", "{ duration, easing } for digit spin"],
              ["opacityTiming", "{ duration, easing } for fade"],
              ["trend", "1 | -1 | 0 | function — spin direction"],
              ["plugins", "[continuous] for fluid scrolling"],
              ["willChange", "boolean — optimize for animation"],
              ["isolate", "boolean — prevent layout shift"],
              ["digits", "per-digit max constraints"],
            ].map(([prop, desc]) => (
              <div key={prop} className="flex gap-2 py-1">
                <code className="text-[11px] font-mono text-[#8162ff] bg-gray-50 rounded px-1.5 py-0.5 shrink-0">
                  {prop}
                </code>
                <span className="text-[#6b7280]">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Credit */}
        <p className="text-[11px] text-[#9ca3af]">
          Powered by{" "}
          <a
            href="https://number-flow.barvian.me"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#6b7280]"
          >
            NumberFlow
          </a>
          {" "}by{" "}
          <a
            href="https://x.com/mbarvian"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#6b7280]"
          >
            @mbarvian
          </a>
        </p>
      </div>
    </ComponentShell>
  );
}
