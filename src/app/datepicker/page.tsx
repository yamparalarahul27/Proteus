"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Code, MessageSquare, Undo2 } from "lucide-react";
import TimelineDatePicker from "@/components/TimelineDatePicker";
import BottomSheet from "@/components/BottomSheet";
import { cn } from "@/lib/utils";

const PROMPT_CONTENT = `Build a React timeline date range selector component with the following specs:

Layout & Structure
Two-row card component with a white background, rounded corners, and subtle shadow.
  - Row 1: Left-aligned date range label (e.g. "March 1 – Today") + right-aligned preset buttons: This month, Last 7D, 30D, 90D
  - Row 2: A « back-navigation chevron, a horizontal tick-mark ruler, and a draggable selection window floating over the ruler. Month labels (December, January, February, March) sit below the ruler, evenly spaced.

The Selection Window
A pill/rounded-rect overlay sitting on top of the ruler track. It displays the day count inside (e.g. "31 Days"). It has:
  - A left resize handle (circular notch on the left edge, ↔ cursor) — dragging changes the start date, end stays anchored
  - A right resize handle (circular notch on right edge, → cursor) — dragging changes the span/end
  - A draggable body (grab cursor) — panning moves the whole window left/right without changing span

Text Input & Granularity
Replace the date label with a text input that accepts natural language:
  - "yesterday" → highlights yesterday
  - "Q4" → snaps to Oct 1 – Dec 31 of current year
  - "july" → snaps to July 1 – July 31
  - "last 30 days" → 30 days ago to today
Add granularity tabs (Day, Month, Quarter, Half-year, Year) with selection panels.

Interactions
  1. Drag body → pans the date range. Updates start date label, keeps day count the same.
  2. Drag left edge → resizes start date. Day count updates live. End stays fixed.
  3. Drag right edge → resizes end/span. Day count updates live.
  4. Click month label → snaps window to that full calendar month.
  5. Click preset button → sets active style, updates window size and position.
  6. Click « → scrolls the visible timeline window backward (~1 month).
  7. Type in input → parses natural language and updates slider + active tab.

Visual Design
  - Tick marks: thin vertical lines, taller ticks for week boundaries
  - Selection window: white background, light gray border, slight shadow, blue left-border accent when active/dragging
  - Circular notch handles on both left and right edges
  - Active ticks inside selection window: slightly blue-tinted
  - Active preset button: white pill with border + bold text; inactive: plain gray text
  - Month labels: gray by default; bold when selection window overlaps
  - All transitions animate smoothly with transition on non-drag states

State: startDate, endDate, viewportOffset, activePreset, inputValue, activeGranularity

Tech: React Next.js + Tailwind. useRef + onMouseDown/Move/Up + touch events for drag logic. No external date-picker libraries. date-fns for date math.`;

const CODE_CONTENT = `// ============================================
// Timeline Date Picker — Multi-file Component
// ============================================
//
// File structure:
//   src/components/TimelineDatePicker.tsx             — Main component
//   src/components/timeline-date-picker/constants.ts  — Config, helpers, types
//   src/components/timeline-date-picker/panels.tsx    — Granularity selection panels
//   src/lib/parseDateInput.ts                         — Natural language date parser
//
// Dependencies: react, date-fns, lucide-react, tailwindcss (cn utility)
//
// Usage:
//   import TimelineDatePicker from "@/components/TimelineDatePicker";
//   <TimelineDatePicker onChange={({ startDate, endDate }) => { ... }} />
//
// ============================================
// page.tsx (wrapper)
// ============================================
// "use client";
// import { useState } from "react";
// import TimelineDatePicker from "@/components/TimelineDatePicker";
//
// export default function DatePickerPage() {
//   const [isVisible, setIsVisible] = useState(true);
//   return (
//     <div>
//       <button onClick={() => setIsVisible(v => !v)}>
//         <Calendar size={18} />
//       </button>
//       <TimelineDatePicker />
//     </div>
//   );
// }
//
// ============================================
// constants.ts (key exports)
// ============================================
// TICK_WIDTH = 4, TOTAL_DAYS = 365, RULER_WIDTH = TOTAL_DAYS * TICK_WIDTH
// Preset type: "thisMonth" | "7d" | "30d" | "90d" | null
// GRANULARITY_TABS: day, month, quarter, half-year, year
// PRESET_OPTIONS: This month, Last 7D, 30D, 90D
// dayToIndex(day) — converts Date to ruler pixel index
// indexToDay(index) — converts ruler index back to Date
// getMonthMarkers() — generates month label positions for the ruler
//
// ============================================
// TimelineDatePicker.tsx (main component, abbreviated)
// ============================================
// export default function TimelineDatePicker({ onChange }) {
//   const [startDate, setStartDate] = useState(() => startOfMonth(today));
//   const [endDate, setEndDate] = useState(() => today);
//   const [activePreset, setActivePreset] = useState("thisMonth");
//   const [isDragging, setIsDragging] = useState(false);
//   const [inputValue, setInputValue] = useState("");
//   const [isFocused, setIsFocused] = useState(false);
//   const [activeGranularity, setActiveGranularity] = useState(null);
//
//   // Drag system: useRef for dragType ("body"|"left"|"right"),
//   //   dragStartX, dragStartStartDate, dragStartEndDate, dragStartScroll
//   // applyDragDelta(clientX) — calculates day delta from pixel movement,
//   //   clamps to bounds, updates start/end dates based on drag type
//   // Mouse/touch event listeners added/removed in useEffect when isDragging
//
//   // Key handlers:
//   //   applyPreset(preset) — sets date range for thisMonth/7d/30d/90d
//   //   handleMonthClick(monthDate) — snaps to full calendar month
//   //   handleBack() — scrolls ruler left by ~30 days
//   //   handleNaturalLanguageInput(text) — calls parseDateInput, applies result
//   //   handlePanelSelect(start, end) — applies from granularity panel
//
//   // Render:
//   //   - Text input (shows dateLabel when blurred, NL input when focused)
//   //   - Preset buttons row
//   //   - Granularity tabs (Day/Month/Quarter/Half-year/Year)
//   //   - Collapsible panel area (DayPanel, MonthPanel, QuarterPanel, etc.)
//   //   - Back chevron + scrollable ruler with ticks + selection window
//   //   - Selection window: left handle, draggable body, right handle
//   //   - Month labels below ruler (bold when overlapping selection)
// }
//
// ============================================
// panels.tsx (granularity selection panels)
// ============================================
// YearPanel — grid of year buttons (currentYear-5 to +2), selected highlight
// HalfYearPanel — H1/H2 buttons grouped by year
// QuarterPanel — Q1-Q4 buttons grouped by year (grid cols-4)
// MonthPanel — Jan-Dec buttons grouped by year (grid cols-4 sm:cols-6)
// DayPanel — full calendar grid with month nav (ChevronLeft/Right),
//   weekday headers, day buttons with today ring, weekend styling, future disabled
//
// ============================================
// parseDateInput.ts (natural language parser)
// ============================================
// export function parseDateInput(input, referenceDate?): ParseResult | null
// Supports: "today", "yesterday", "last N days",
//   "q1"-"q4" (optional year), "h1"/"h2" (optional year),
//   "next/last/this year", 4-digit year, "this/last month",
//   "month day year", "month day", "month year", month name alone
// Returns: { startDate, endDate, granularity } or null`;

export default function DatePickerPage() {
  const [isVisible, setIsVisible] = useState(true);
  const [sheetOpen, setSheetOpen] = useState<"code" | "prompt" | null>(null);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[var(--background)] border-b border-gray-200/60 px-4 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Undo2 size={16} />
          <span>Back</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 gap-5">
        {/* Title + Credits */}
        <div className="text-center space-y-1.5">
          <h1 className="text-xl font-semibold text-gray-800">
            Date Picker Component
          </h1>
          <p className="text-xs text-gray-400">
            Inspired and combined engineered from the work of{" "}
            <a
              href="https://x.com/kvnkld"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600 transition-colors"
            >
              @kvnkld
            </a>
            {" & "}
            <a
              href="https://x.com/kenneth_skovhus"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600 transition-colors"
            >
              @kenneth_skovhus
            </a>
          </p>
        </div>

        {/* Calendar Toggle */}
        <button
          onClick={() => setIsVisible((v) => !v)}
          className={cn(
            "p-2.5 rounded-xl transition-all duration-200",
            isVisible
              ? "bg-white border border-gray-300 shadow-sm text-gray-800"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          )}
          aria-label="Toggle date picker"
        >
          <Calendar size={18} />
        </button>

        {/* Date Picker Component */}
        <div
          className={cn(
            "w-full max-w-4xl transition-all duration-300 ease-in-out origin-top",
            isVisible
              ? "opacity-100 scale-100 max-h-[600px]"
              : "opacity-0 scale-95 max-h-0 overflow-hidden pointer-events-none"
          )}
        >
          <TimelineDatePicker />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 px-4 py-4">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setSheetOpen("code")}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-white border border-gray-200 text-gray-700 shadow-sm hover:border-gray-300 hover:shadow transition-all"
          >
            <Code size={14} />
            Copy Code (NextJs)
          </button>
          <button
            onClick={() => setSheetOpen("prompt")}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg bg-white border border-gray-200 text-gray-700 shadow-sm hover:border-gray-300 hover:shadow transition-all"
          >
            <MessageSquare size={14} />
            Copy Prompt
          </button>
        </div>
      </footer>

      {/* Bottom Sheets */}
      <BottomSheet
        isOpen={sheetOpen === "code"}
        onClose={() => setSheetOpen(null)}
        title="Component Code (Next.js)"
        content={CODE_CONTENT}
      />
      <BottomSheet
        isOpen={sheetOpen === "prompt"}
        onClose={() => setSheetOpen(null)}
        title="Claude / Codex Prompt"
        content={PROMPT_CONTENT}
      />
    </div>
  );
}
