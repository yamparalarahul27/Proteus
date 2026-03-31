"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addDays,
  differenceInCalendarDays,
  endOfMonth,
  format,
  isToday,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import { cn } from "@/lib/utils";

type Preset = "thisMonth" | "7d" | "30d" | "90d" | null;

const TICK_WIDTH = 4; // px per day
const VISIBLE_DAYS = 180; // ~6 months visible in the ruler
const TOTAL_DAYS = 365; // 1 year of timeline data
const RULER_WIDTH = TOTAL_DAYS * TICK_WIDTH;

function getToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** The rightmost date on the ruler (today). Day index 0 = TOTAL_DAYS ago. */
function dayToIndex(day: Date): number {
  const today = getToday();
  const diff = differenceInCalendarDays(today, day);
  return TOTAL_DAYS - diff;
}

function indexToDay(index: number): Date {
  const today = getToday();
  return subDays(today, TOTAL_DAYS - index);
}

/** Generate month boundary markers for the ruler. */
function getMonthMarkers() {
  const today = getToday();
  const markers: { label: string; index: number; date: Date }[] = [];
  // Go back ~13 months to cover the full ruler
  for (let i = 13; i >= 0; i--) {
    const d = startOfMonth(subMonths(today, i));
    const idx = dayToIndex(d);
    if (idx >= 0 && idx <= TOTAL_DAYS) {
      markers.push({ label: format(d, "MMMM"), index: idx, date: d });
    }
  }
  return markers;
}

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

  // Viewport: the scroll offset in px from the right end of the ruler
  const rulerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag state refs (avoid re-renders during drag)
  const dragType = useRef<"body" | "left" | "right" | null>(null);
  const dragStartX = useRef(0);
  const dragStartStartDate = useRef(startDate);
  const dragStartEndDate = useRef(endDate);

  const dayCount = differenceInCalendarDays(endDate, startDate) + 1;
  const monthMarkers = useMemo(() => getMonthMarkers(), []);

  // Scroll so that the selection is visible on mount
  useEffect(() => {
    if (rulerRef.current) {
      const endIdx = dayToIndex(endDate);
      const scrollTo = endIdx * TICK_WIDTH - (rulerRef.current.clientWidth - 80);
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

  // ─── Preset Handlers ───
  const applyPreset = useCallback(
    (preset: Preset) => {
      setActivePreset(preset);
      let s: Date;
      let e: Date = today;
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
      // Scroll to show end
      requestAnimationFrame(() => {
        if (rulerRef.current) {
          const endIdx = dayToIndex(e);
          const scrollTo =
            endIdx * TICK_WIDTH - (rulerRef.current.clientWidth - 80);
          rulerRef.current.scrollLeft = Math.max(0, scrollTo);
        }
      });
    },
    [today, notifyChange]
  );

  // ─── Month Click Handler ───
  const handleMonthClick = useCallback(
    (monthDate: Date) => {
      const s = startOfMonth(monthDate);
      const e = endOfMonth(monthDate);
      // Clamp end to today
      const clampedEnd = e > today ? today : e;
      setStartDate(s);
      setEndDate(clampedEnd);
      setActivePreset(null);
      notifyChange(s, clampedEnd);
      // Scroll to show
      requestAnimationFrame(() => {
        if (rulerRef.current) {
          const midIdx = dayToIndex(s) + differenceInCalendarDays(clampedEnd, s) / 2;
          const scrollTo =
            midIdx * TICK_WIDTH - rulerRef.current.clientWidth / 2;
          rulerRef.current.scrollLeft = Math.max(0, scrollTo);
        }
      });
    },
    [today, notifyChange]
  );

  // ─── Back Chevron ───
  const handleBack = useCallback(() => {
    if (rulerRef.current) {
      const monthPx = 30 * TICK_WIDTH;
      rulerRef.current.scrollBy({ left: -monthPx, behavior: "smooth" });
    }
  }, []);

  // ─── Drag Logic ───
  const handleMouseDown = useCallback(
    (type: "body" | "left" | "right", e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragType.current = type;
      dragStartX.current = e.clientX;
      dragStartStartDate.current = startDate;
      dragStartEndDate.current = endDate;
      setIsDragging(true);
    },
    [startDate, endDate]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartX.current;
      const dayDelta = Math.round(dx / TICK_WIDTH);

      if (dragType.current === "body") {
        let newStart = addDays(dragStartStartDate.current, dayDelta);
        let newEnd = addDays(dragStartEndDate.current, dayDelta);
        // Clamp
        if (newEnd > today) {
          newEnd = today;
          newStart = subDays(
            today,
            differenceInCalendarDays(
              dragStartEndDate.current,
              dragStartStartDate.current
            )
          );
        }
        const earliest = indexToDay(0);
        if (newStart < earliest) {
          newStart = earliest;
          newEnd = addDays(
            earliest,
            differenceInCalendarDays(
              dragStartEndDate.current,
              dragStartStartDate.current
            )
          );
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
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragType.current = null;
      notifyChange(startDate, endDate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, today, startDate, endDate, notifyChange]);

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
      const isWeek = d.getDay() === 0; // Sunday
      if (i % 1 === 0) {
        result.push({ index: i, isWeek, isMonth });
      }
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
      className="proteus-panel w-full max-w-4xl rounded-xl p-5 select-none"
    >
      {/* Row 1: Date label + Presets */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-800">{dateLabel}</span>
        <div className="flex items-center gap-1">
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => applyPreset(p.key)}
              className={cn(
                "px-3 py-1 text-xs rounded-full transition-all duration-200",
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

      {/* Row 2: Back chevron + Ruler */}
      <div className="flex items-stretch gap-2">
        {/* Back Chevron */}
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

        {/* Ruler container */}
        <div
          ref={rulerRef}
          className="relative flex-1 overflow-x-auto hide-scrollbar"
          style={{ height: 72 }}
        >
          {/* Full-width ruler track */}
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
                className="absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize z-10"
              />

              {/* Draggable body */}
              <div
                onMouseDown={(e) => handleMouseDown("body", e)}
                className="absolute inset-0 mx-3 flex items-center justify-center cursor-grab active:cursor-grabbing"
              >
                <span className="text-[10px] font-semibold text-gray-600 whitespace-nowrap pointer-events-none">
                  {dayCount} {dayCount === 1 ? "Day" : "Days"}
                </span>
              </div>

              {/* Right resize handle */}
              <div
                onMouseDown={(e) => handleMouseDown("right", e)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 flex items-center justify-center"
              >
                <div className="w-4 h-4 rounded-full bg-white border-2 border-blue-400 shadow cursor-e-resize hover:border-blue-500 hover:scale-110 transition-transform" />
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
