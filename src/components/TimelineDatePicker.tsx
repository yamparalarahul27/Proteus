"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  endOfYear,
  format,
  getDay,
  isToday,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  parseDateInput,
  type Granularity,
} from "@/lib/parseDateInput";

type Preset = "thisMonth" | "7d" | "30d" | "90d" | null;

const TICK_WIDTH = 4;
const TOTAL_DAYS = 365;
const RULER_WIDTH = TOTAL_DAYS * TICK_WIDTH;

function getToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function dayToIndex(day: Date): number {
  const today = getToday();
  const diff = differenceInCalendarDays(today, day);
  return TOTAL_DAYS - diff;
}

function indexToDay(index: number): Date {
  const today = getToday();
  return subDays(today, TOTAL_DAYS - index);
}

function getMonthMarkers() {
  const today = getToday();
  const markers: { label: string; index: number; date: Date }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = startOfMonth(subMonths(today, i));
    const idx = dayToIndex(d);
    if (idx >= 0 && idx <= TOTAL_DAYS) {
      markers.push({ label: format(d, "MMMM"), index: idx, date: d });
    }
  }
  return markers;
}

const GRANULARITY_TABS: { key: Granularity; label: string }[] = [
  { key: "day", label: "Day" },
  { key: "month", label: "Month" },
  { key: "quarter", label: "Quarter" },
  { key: "half-year", label: "Half-year" },
  { key: "year", label: "Year" },
];

// ─── Granularity Panels ───

function YearPanel({
  today,
  startDate,
  endDate,
  onSelect,
}: {
  today: Date;
  startDate: Date;
  endDate: Date;
  onSelect: (s: Date, e: Date) => void;
}) {
  const currentYear = today.getFullYear();
  const years = Array.from({ length: 8 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="flex flex-wrap gap-2 py-3">
      {years.map((y) => {
        const s = new Date(y, 0, 1);
        const e = endOfYear(s);
        const isSelected =
          startDate.getFullYear() === y &&
          startOfYear(startDate).getTime() === s.getTime() &&
          endDate.getTime() === (e > today ? today : e).getTime();
        return (
          <button
            key={y}
            onClick={() => onSelect(s, e > today ? today : e)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm transition-all",
              isSelected
                ? "bg-blue-50 border-2 border-blue-400 text-blue-700 font-semibold"
                : "border border-gray-200 text-gray-600 hover:border-gray-400"
            )}
          >
            {y}
          </button>
        );
      })}
    </div>
  );
}

function HalfYearPanel({
  today,
  startDate,
  endDate,
  onSelect,
}: {
  today: Date;
  startDate: Date;
  endDate: Date;
  onSelect: (s: Date, e: Date) => void;
}) {
  const currentYear = today.getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="py-3 space-y-3">
      {years.map((y) => (
        <div key={y}>
          <div className="text-xs text-gray-400 mb-1.5">{y}</div>
          <div className="flex gap-2">
            {[1, 2].map((h) => {
              const s = h === 1 ? new Date(y, 0, 1) : new Date(y, 6, 1);
              const e =
                h === 1
                  ? endOfMonth(new Date(y, 5, 1))
                  : endOfMonth(new Date(y, 11, 1));
              const clampedEnd = e > today ? today : e;
              const isFuture = s > today;
              const isSelected =
                startDate.getTime() === s.getTime() &&
                endDate.getTime() === clampedEnd.getTime();
              return (
                <button
                  key={h}
                  disabled={isFuture}
                  onClick={() => onSelect(s, clampedEnd)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm transition-all",
                    isFuture && "opacity-40 cursor-not-allowed",
                    isSelected
                      ? "bg-blue-50 border-2 border-blue-400 text-blue-700 font-semibold"
                      : "border border-gray-200 text-gray-600 hover:border-gray-400"
                  )}
                >
                  H{h}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function QuarterPanel({
  today,
  startDate,
  endDate,
  onSelect,
}: {
  today: Date;
  startDate: Date;
  endDate: Date;
  onSelect: (s: Date, e: Date) => void;
}) {
  const currentYear = today.getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="py-3 space-y-3">
      {years.map((y) => (
        <div key={y}>
          <div className="text-xs text-gray-400 mb-1.5">{y}</div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((q) => {
              const startMonth = (q - 1) * 3;
              const s = new Date(y, startMonth, 1);
              const e = endOfMonth(new Date(y, startMonth + 2, 1));
              const clampedEnd = e > today ? today : e;
              const isFuture = s > today;
              const isSelected =
                startDate.getTime() === s.getTime() &&
                endDate.getTime() === clampedEnd.getTime();
              return (
                <button
                  key={q}
                  disabled={isFuture}
                  onClick={() => onSelect(s, clampedEnd)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm transition-all",
                    isFuture && "opacity-40 cursor-not-allowed",
                    isSelected
                      ? "bg-blue-50 border-2 border-blue-400 text-blue-700 font-semibold"
                      : "border border-gray-200 text-gray-600 hover:border-gray-400"
                  )}
                >
                  Q{q}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function MonthPanel({
  today,
  startDate,
  endDate,
  onSelect,
}: {
  today: Date;
  startDate: Date;
  endDate: Date;
  onSelect: (s: Date, e: Date) => void;
}) {
  const currentYear = today.getFullYear();
  const years = [currentYear - 1, currentYear];
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return (
    <div className="py-3 space-y-3">
      {years.map((y) => (
        <div key={y}>
          <div className="text-xs text-gray-400 mb-1.5">{y}</div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {monthNames.map((name, i) => {
              const s = new Date(y, i, 1);
              const e = endOfMonth(s);
              const clampedEnd = e > today ? today : e;
              const isFuture = s > today;
              const isSelected =
                startDate.getTime() === s.getTime() &&
                endDate.getTime() === clampedEnd.getTime();
              return (
                <button
                  key={i}
                  disabled={isFuture}
                  onClick={() => onSelect(s, clampedEnd)}
                  className={cn(
                    "px-2 py-1.5 rounded-lg text-sm transition-all",
                    isFuture && "opacity-40 cursor-not-allowed",
                    isSelected
                      ? "bg-blue-50 border-2 border-blue-400 text-blue-700 font-semibold"
                      : "border border-gray-200 text-gray-600 hover:border-gray-400"
                  )}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function DayPanel({
  today,
  startDate,
  onSelect,
}: {
  today: Date;
  startDate: Date;
  onSelect: (s: Date, e: Date) => void;
}) {
  const [viewMonth, setViewMonth] = useState(startDate);
  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const startDay = getDay(monthStart);
  const daysInMonth = monthEnd.getDate();

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Build the grid: leading blanks + days
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">
          {format(viewMonth, "MMMM yyyy")}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setViewMonth((v) => subMonths(v, 1))}
            className="p-1 rounded hover:bg-gray-100 text-gray-500"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setViewMonth((v) => addMonths(v, 1))}
            className="p-1 rounded hover:bg-gray-100 text-gray-500"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {weekdays.map((wd) => (
          <div
            key={wd}
            className="text-center text-[11px] font-medium text-gray-400 py-1"
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`blank-${i}`} className="h-9" />;
          }
          const date = new Date(
            viewMonth.getFullYear(),
            viewMonth.getMonth(),
            day
          );
          date.setHours(0, 0, 0, 0);
          const isFuture = date > today;
          const isSelected = startDate.getTime() === date.getTime();
          const isTodayDate = isToday(date);
          const dayOfWeek = (startDay + day - 1) % 7;
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          return (
            <button
              key={day}
              disabled={isFuture}
              onClick={() => onSelect(date, date)}
              className={cn(
                "h-9 flex items-center justify-center rounded-full text-sm transition-all",
                isFuture && "opacity-30 cursor-not-allowed",
                isSelected &&
                  "bg-blue-500 text-white font-semibold",
                !isSelected && isTodayDate &&
                  "ring-2 ring-blue-300 ring-inset font-semibold text-blue-600",
                !isSelected && !isFuture && !isTodayDate && isWeekend &&
                  "text-gray-400 hover:bg-gray-100",
                !isSelected && !isFuture && !isTodayDate && !isWeekend &&
                  "text-gray-700 hover:bg-gray-100"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───

export default function TimelineDatePicker({
  onChange,
}: {
  onChange?: (range: { startDate: Date; endDate: Date }) => void;
}) {
  const today = getToday();

  const [startDate, setStartDate] = useState(() => startOfMonth(today));
  const [endDate, setEndDate] = useState(() => today);
  const [activePreset, setActivePreset] = useState<Preset>("thisMonth");
  const [isDragging, setIsDragging] = useState(false);

  // New state for text input + granularity
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeGranularity, setActiveGranularity] =
    useState<Granularity | null>(null);

  const rulerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const dragType = useRef<"body" | "left" | "right" | null>(null);
  const dragStartX = useRef(0);
  const dragStartStartDate = useRef(startDate);
  const dragStartEndDate = useRef(endDate);
  const dragStartScroll = useRef(0);

  const dayCount = differenceInCalendarDays(endDate, startDate) + 1;
  const monthMarkers = useMemo(() => getMonthMarkers(), []);

  // Scroll so selection is visible on mount
  useEffect(() => {
    if (rulerRef.current) {
      const endIdx = dayToIndex(endDate);
      const scrollTo =
        endIdx * TICK_WIDTH - (rulerRef.current.clientWidth - 80);
      rulerRef.current.scrollLeft = Math.max(0, scrollTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const notifyChange = useCallback(
    (s: Date, e: Date) => {
      onChange?.({ startDate: s, endDate: e });
    },
    [onChange]
  );

  const scrollToRange = useCallback((s: Date, e: Date) => {
    requestAnimationFrame(() => {
      if (rulerRef.current) {
        const midIdx =
          dayToIndex(s) + differenceInCalendarDays(e, s) / 2;
        const scrollTo =
          midIdx * TICK_WIDTH - rulerRef.current.clientWidth / 2;
        rulerRef.current.scrollLeft = Math.max(0, scrollTo);
      }
    });
  }, []);

  // ─── Apply a date range from any source ───
  const applyRange = useCallback(
    (s: Date, e: Date, granularity?: Granularity) => {
      const clampedEnd = e > today ? today : e;
      setStartDate(s);
      setEndDate(clampedEnd);
      setActivePreset(null);
      if (granularity !== undefined) {
        setActiveGranularity(granularity);
      }
      notifyChange(s, clampedEnd);
      scrollToRange(s, clampedEnd);
    },
    [today, notifyChange, scrollToRange]
  );

  // ─── Preset Handlers ───
  const applyPreset = useCallback(
    (preset: Preset) => {
      setActivePreset(preset);
      setActiveGranularity(null);
      setInputValue("");
      let s: Date;
      const e: Date = today;
      switch (preset) {
        case "thisMonth":
          s = startOfMonth(today);
          break;
        case "7d":
          s = subDays(today, 6);
          break;
        case "30d":
          s = subDays(today, 29);
          break;
        case "90d":
          s = subDays(today, 89);
          break;
        default:
          return;
      }
      setStartDate(s);
      setEndDate(e);
      notifyChange(s, e);
      scrollToRange(s, e);
    },
    [today, notifyChange, scrollToRange]
  );

  // ─── Month Click Handler ───
  const handleMonthClick = useCallback(
    (monthDate: Date) => {
      const s = startOfMonth(monthDate);
      const e = endOfMonth(monthDate);
      const clampedEnd = e > today ? today : e;
      applyRange(s, clampedEnd, "month");
    },
    [today, applyRange]
  );

  // ─── Back Chevron ───
  const handleBack = useCallback(() => {
    if (rulerRef.current) {
      const monthPx = 30 * TICK_WIDTH;
      rulerRef.current.scrollBy({ left: -monthPx, behavior: "smooth" });
    }
  }, []);

  // ─── NL Parse Handler ───
  const handleNLParse = useCallback(
    (text: string) => {
      setInputValue(text);
      const result = parseDateInput(text);
      if (result) {
        applyRange(result.startDate, result.endDate, result.granularity);
      }
    },
    [applyRange]
  );

  // ─── Panel Selection Handler ───
  const handlePanelSelect = useCallback(
    (s: Date, e: Date) => {
      applyRange(s, e, activeGranularity ?? undefined);
      setInputValue("");
      setIsFocused(false);
    },
    [applyRange, activeGranularity]
  );

  // ─── Drag Logic (mouse + touch) ───
  const startDrag = useCallback(
    (type: "body" | "left" | "right", clientX: number) => {
      dragType.current = type;
      dragStartX.current = clientX;
      dragStartStartDate.current = startDate;
      dragStartEndDate.current = endDate;
      dragStartScroll.current = rulerRef.current?.scrollLeft ?? 0;
      setIsDragging(true);
      setActiveGranularity(null);
    },
    [startDate, endDate]
  );

  const handleMouseDown = useCallback(
    (type: "body" | "left" | "right", e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      startDrag(type, e.clientX);
    },
    [startDrag]
  );

  const handleTouchStart = useCallback(
    (type: "body" | "left" | "right", e: React.TouchEvent) => {
      e.stopPropagation();
      startDrag(type, e.touches[0].clientX);
    },
    [startDrag]
  );

  const applyDragDelta = useCallback(
    (clientX: number) => {
      const scrollDelta =
        (rulerRef.current?.scrollLeft ?? 0) - dragStartScroll.current;
      const dx = clientX - dragStartX.current + scrollDelta;
      const dayDelta = Math.round(dx / TICK_WIDTH);

      if (dragType.current === "body") {
        let newStart = addDays(dragStartStartDate.current, dayDelta);
        let newEnd = addDays(dragStartEndDate.current, dayDelta);
        const span = differenceInCalendarDays(
          dragStartEndDate.current,
          dragStartStartDate.current
        );
        if (newEnd > today) {
          newEnd = today;
          newStart = subDays(today, span);
        }
        const earliest = indexToDay(0);
        if (newStart < earliest) {
          newStart = earliest;
          newEnd = addDays(earliest, span);
        }
        setStartDate(newStart);
        setEndDate(newEnd);
        setActivePreset(null);
      } else if (dragType.current === "left") {
        let newStart = addDays(dragStartStartDate.current, dayDelta);
        const earliest = indexToDay(0);
        if (newStart < earliest) newStart = earliest;
        if (newStart >= dragStartEndDate.current) {
          newStart = subDays(dragStartEndDate.current, 1);
        }
        setStartDate(newStart);
        setEndDate(dragStartEndDate.current);
        setActivePreset(null);
      } else if (dragType.current === "right") {
        let newEnd = addDays(dragStartEndDate.current, dayDelta);
        if (newEnd > today) newEnd = today;
        if (newEnd <= dragStartStartDate.current) {
          newEnd = addDays(dragStartStartDate.current, 1);
        }
        setEndDate(newEnd);
        setStartDate(dragStartStartDate.current);
        setActivePreset(null);
      }
    },
    [today]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e) e.preventDefault();
      const clientX =
        "touches" in e ? e.touches[0].clientX : e.clientX;
      applyDragDelta(clientX);
    };

    const handleEnd = () => {
      setIsDragging(false);
      dragType.current = null;
      notifyChange(startDate, endDate);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
    window.addEventListener("touchcancel", handleEnd);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("touchcancel", handleEnd);
    };
  }, [isDragging, applyDragDelta, startDate, endDate, notifyChange]);

  // ─── Computed positions ───
  const startIdx = dayToIndex(startDate);
  const endIdx = dayToIndex(endDate);
  const selLeft = startIdx * TICK_WIDTH;
  const selWidth = (endIdx - startIdx + 1) * TICK_WIDTH;

  // ─── Date Label ───
  const dateLabel = `${format(startDate, "MMMM d")} – ${isToday(endDate) ? "Today" : format(endDate, "MMMM d")}`;

  // ─── Generate tick marks ───
  const ticks = useMemo(() => {
    const result: { index: number; isWeek: boolean; isMonth: boolean }[] = [];
    for (let i = 0; i <= TOTAL_DAYS; i++) {
      const d = indexToDay(i);
      const isMonth = d.getDate() === 1;
      const isWeek = d.getDay() === 0;
      result.push({ index: i, isWeek, isMonth });
    }
    return result;
  }, []);

  const presets: { key: Preset; label: string }[] = [
    { key: "thisMonth", label: "This month" },
    { key: "7d", label: "Last 7D" },
    { key: "30d", label: "30D" },
    { key: "90d", label: "90D" },
  ];

  return (
    <div
      ref={containerRef}
      className="proteus-panel w-full max-w-4xl rounded-xl p-3 sm:p-5 select-none"
    >
      {/* Row 1: Text Input + Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            className={cn(
              "text-sm w-full bg-transparent outline-none py-1 pr-7",
              "border-b-2 transition-colors",
              isFocused
                ? "border-blue-400 text-gray-800 placeholder-gray-400"
                : "border-transparent text-gray-800 font-medium"
            )}
            value={isFocused ? inputValue : dateLabel}
            placeholder={isFocused ? `e.g. "Q4", "yesterday", "july"` : undefined}
            onChange={(e) => handleNLParse(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setInputValue("");
            }}
            onBlur={() => {
              // Delay to allow panel clicks to register
              setTimeout(() => setIsFocused(false), 200);
            }}
          />
          {isFocused && inputValue && (
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setInputValue("");
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar shrink-0">
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => applyPreset(p.key)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full transition-all duration-200 whitespace-nowrap",
                activePreset === p.key
                  ? "bg-white border border-gray-300 font-bold text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: Granularity Tabs */}
      <div className="flex items-center gap-1 mb-1 overflow-x-auto hide-scrollbar border-b border-gray-100">
        {GRANULARITY_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              setActiveGranularity((prev) =>
                prev === tab.key ? null : tab.key
              )
            }
            className={cn(
              "px-3 py-1.5 text-xs whitespace-nowrap transition-all duration-200 border-b-2 -mb-px",
              activeGranularity === tab.key
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-400 hover:text-gray-600"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Row 3: Selection Panel (conditional) */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          activeGranularity ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {activeGranularity === "year" && (
          <YearPanel
            today={today}
            startDate={startDate}
            endDate={endDate}
            onSelect={handlePanelSelect}
          />
        )}
        {activeGranularity === "half-year" && (
          <HalfYearPanel
            today={today}
            startDate={startDate}
            endDate={endDate}
            onSelect={handlePanelSelect}
          />
        )}
        {activeGranularity === "quarter" && (
          <QuarterPanel
            today={today}
            startDate={startDate}
            endDate={endDate}
            onSelect={handlePanelSelect}
          />
        )}
        {activeGranularity === "month" && (
          <MonthPanel
            today={today}
            startDate={startDate}
            endDate={endDate}
            onSelect={handlePanelSelect}
          />
        )}
        {activeGranularity === "day" && (
          <DayPanel
            today={today}
            startDate={startDate}
            onSelect={handlePanelSelect}
          />
        )}
      </div>

      {/* Row 4: Back chevron + Ruler */}
      <div className="flex items-stretch gap-2 mt-2">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-8 shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Scroll timeline back"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M10.5 3L5.5 8L10.5 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          ref={rulerRef}
          className="relative flex-1 overflow-x-auto hide-scrollbar"
          style={{ height: 72 }}
        >
          <div
            className="relative"
            style={{ width: RULER_WIDTH, height: "100%" }}
          >
            {/* Tick marks */}
            <div className="absolute inset-x-0 top-0" style={{ height: 36 }}>
              {ticks.map((t) => {
                const left = t.index * TICK_WIDTH;
                const insideSelection =
                  t.index >= startIdx && t.index <= endIdx;
                return (
                  <div
                    key={t.index}
                    className={cn(
                      "absolute top-0 w-px",
                      t.isMonth
                        ? "h-6 bg-gray-400"
                        : t.isWeek
                          ? "h-4 bg-gray-300"
                          : "h-2.5 bg-gray-200",
                      insideSelection && !isDragging && "bg-blue-300",
                      insideSelection && isDragging && "bg-blue-400"
                    )}
                    style={{ left }}
                  />
                );
              })}
            </div>

            {/* Selection window */}
            <div
              className={cn(
                "absolute top-0 rounded-lg border bg-white/90 shadow-sm",
                isDragging ? "border-blue-400 shadow-md" : "border-gray-200",
                !isDragging && "transition-all duration-300 ease-out"
              )}
              style={{
                left: selLeft,
                width: Math.max(selWidth, 24),
                height: 36,
                borderLeftWidth: isDragging ? 3 : 2,
                borderLeftColor: isDragging
                  ? "rgb(96 165 250)"
                  : "rgb(147 197 253)",
              }}
            >
              {/* Left resize handle */}
              <div
                onMouseDown={(e) => handleMouseDown("left", e)}
                onTouchStart={(e) => handleTouchStart("left", e)}
                className="absolute left-0 top-0 bottom-0 w-5 sm:w-3 -ml-1 cursor-ew-resize z-10"
              />

              {/* Draggable body */}
              <div
                onMouseDown={(e) => handleMouseDown("body", e)}
                onTouchStart={(e) => handleTouchStart("body", e)}
                className="absolute inset-0 mx-5 sm:mx-3 flex items-center justify-center cursor-grab active:cursor-grabbing"
              >
                <span className="text-[10px] font-semibold text-gray-600 whitespace-nowrap pointer-events-none">
                  {dayCount} {dayCount === 1 ? "Day" : "Days"}
                </span>
              </div>

              {/* Right resize handle */}
              <div
                onMouseDown={(e) => handleMouseDown("right", e)}
                onTouchStart={(e) => handleTouchStart("right", e)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 flex items-center justify-center p-1"
              >
                <div className="w-5 h-5 sm:w-4 sm:h-4 rounded-full bg-white border-2 border-blue-400 shadow cursor-e-resize hover:border-blue-500 hover:scale-110 transition-transform" />
              </div>
            </div>

            {/* Month labels */}
            <div
              className="absolute inset-x-0 flex"
              style={{ top: 44, height: 28 }}
            >
              {monthMarkers.map((m) => {
                const isActive =
                  dayToIndex(startOfMonth(m.date)) <= endIdx &&
                  dayToIndex(endOfMonth(m.date)) >= startIdx;
                return (
                  <button
                    key={m.index}
                    onClick={() => handleMonthClick(m.date)}
                    className={cn(
                      "absolute text-xs whitespace-nowrap transition-all duration-200",
                      isActive
                        ? "font-bold text-gray-800"
                        : "font-normal text-gray-400 hover:text-gray-600"
                    )}
                    style={{ left: m.index * TICK_WIDTH }}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
