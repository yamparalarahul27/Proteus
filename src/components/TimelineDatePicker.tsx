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
} from "date-fns";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseDateInput, type Granularity } from "@/lib/parseDateInput";
import {
  DayPanel,
  HalfYearPanel,
  MonthPanel,
  QuarterPanel,
  YearPanel,
} from "./timeline-date-picker/panels";
import {
  dayToIndex,
  getMonthMarkers,
  getToday,
  GRANULARITY_TABS,
  indexToDay,
  PRESET_OPTIONS,
  RULER_WIDTH,
  TICK_WIDTH,
  TOTAL_DAYS,
  type Preset,
} from "./timeline-date-picker/constants";

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

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeGranularity, setActiveGranularity] =
    useState<Granularity | null>(null);

  const rulerRef = useRef<HTMLDivElement>(null);

  const dragType = useRef<"body" | "left" | "right" | null>(null);
  const dragStartX = useRef(0);
  const dragStartStartDate = useRef(startDate);
  const dragStartEndDate = useRef(endDate);
  const dragStartScroll = useRef(0);

  const dayCount = differenceInCalendarDays(endDate, startDate) + 1;
  const monthMarkers = useMemo(() => getMonthMarkers(), []);

  useEffect(() => {
    if (!rulerRef.current) {
      return;
    }

    const endIndex = dayToIndex(endDate);
    const scrollTo = endIndex * TICK_WIDTH - (rulerRef.current.clientWidth - 80);
    rulerRef.current.scrollLeft = Math.max(0, scrollTo);
  }, [endDate]);

  const notifyChange = useCallback(
    (nextStartDate: Date, nextEndDate: Date) => {
      onChange?.({ startDate: nextStartDate, endDate: nextEndDate });
    },
    [onChange],
  );

  const scrollToRange = useCallback((nextStartDate: Date, nextEndDate: Date) => {
    requestAnimationFrame(() => {
      if (!rulerRef.current) {
        return;
      }

      const midpoint =
        dayToIndex(nextStartDate) +
        differenceInCalendarDays(nextEndDate, nextStartDate) / 2;
      const scrollTo = midpoint * TICK_WIDTH - rulerRef.current.clientWidth / 2;
      rulerRef.current.scrollLeft = Math.max(0, scrollTo);
    });
  }, []);

  const applyRange = useCallback(
    (
      nextStartDate: Date,
      nextEndDate: Date,
      granularity?: Granularity,
    ) => {
      const cappedEndDate = nextEndDate > today ? today : nextEndDate;
      setStartDate(nextStartDate);
      setEndDate(cappedEndDate);
      setActivePreset(null);
      if (granularity !== undefined) {
        setActiveGranularity(granularity);
      }
      notifyChange(nextStartDate, cappedEndDate);
      scrollToRange(nextStartDate, cappedEndDate);
    },
    [notifyChange, scrollToRange, today],
  );

  const applyPreset = useCallback(
    (preset: Preset) => {
      setActivePreset(preset);
      setActiveGranularity(null);
      setInputValue("");

      let nextStartDate: Date;
      const nextEndDate: Date = today;

      switch (preset) {
        case "thisMonth":
          nextStartDate = startOfMonth(today);
          break;
        case "7d":
          nextStartDate = subDays(today, 6);
          break;
        case "30d":
          nextStartDate = subDays(today, 29);
          break;
        case "90d":
          nextStartDate = subDays(today, 89);
          break;
        default:
          return;
      }

      setStartDate(nextStartDate);
      setEndDate(nextEndDate);
      notifyChange(nextStartDate, nextEndDate);
      scrollToRange(nextStartDate, nextEndDate);
    },
    [notifyChange, scrollToRange, today],
  );

  const handleMonthClick = useCallback(
    (monthDate: Date) => {
      const nextStartDate = startOfMonth(monthDate);
      const nextEndDate = endOfMonth(monthDate);
      const cappedEndDate = nextEndDate > today ? today : nextEndDate;
      applyRange(nextStartDate, cappedEndDate, "month");
    },
    [applyRange, today],
  );

  const handleBack = useCallback(() => {
    if (!rulerRef.current) {
      return;
    }

    const monthPixels = 30 * TICK_WIDTH;
    rulerRef.current.scrollBy({ left: -monthPixels, behavior: "smooth" });
  }, []);

  const handleNaturalLanguageInput = useCallback(
    (text: string) => {
      setInputValue(text);
      const parsed = parseDateInput(text);
      if (parsed) {
        applyRange(parsed.startDate, parsed.endDate, parsed.granularity);
      }
    },
    [applyRange],
  );

  const handlePanelSelect = useCallback(
    (nextStartDate: Date, nextEndDate: Date) => {
      applyRange(nextStartDate, nextEndDate, activeGranularity ?? undefined);
      setInputValue("");
      setIsFocused(false);
    },
    [activeGranularity, applyRange],
  );

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
    [endDate, startDate],
  );

  const handleMouseDown = useCallback(
    (type: "body" | "left" | "right", event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      startDrag(type, event.clientX);
    },
    [startDrag],
  );

  const handleTouchStart = useCallback(
    (type: "body" | "left" | "right", event: React.TouchEvent) => {
      event.stopPropagation();
      startDrag(type, event.touches[0].clientX);
    },
    [startDrag],
  );

  const applyDragDelta = useCallback(
    (clientX: number) => {
      const scrollDelta =
        (rulerRef.current?.scrollLeft ?? 0) - dragStartScroll.current;
      const deltaX = clientX - dragStartX.current + scrollDelta;
      const dayDelta = Math.round(deltaX / TICK_WIDTH);

      if (dragType.current === "body") {
        let nextStartDate = addDays(dragStartStartDate.current, dayDelta);
        let nextEndDate = addDays(dragStartEndDate.current, dayDelta);

        const span = differenceInCalendarDays(
          dragStartEndDate.current,
          dragStartStartDate.current,
        );

        if (nextEndDate > today) {
          nextEndDate = today;
          nextStartDate = subDays(today, span);
        }

        const earliestDay = indexToDay(0);
        if (nextStartDate < earliestDay) {
          nextStartDate = earliestDay;
          nextEndDate = addDays(earliestDay, span);
        }

        setStartDate(nextStartDate);
        setEndDate(nextEndDate);
        setActivePreset(null);
      } else if (dragType.current === "left") {
        let nextStartDate = addDays(dragStartStartDate.current, dayDelta);

        const earliestDay = indexToDay(0);
        if (nextStartDate < earliestDay) {
          nextStartDate = earliestDay;
        }

        if (nextStartDate >= dragStartEndDate.current) {
          nextStartDate = subDays(dragStartEndDate.current, 1);
        }

        setStartDate(nextStartDate);
        setEndDate(dragStartEndDate.current);
        setActivePreset(null);
      } else if (dragType.current === "right") {
        let nextEndDate = addDays(dragStartEndDate.current, dayDelta);

        if (nextEndDate > today) {
          nextEndDate = today;
        }

        if (nextEndDate <= dragStartStartDate.current) {
          nextEndDate = addDays(dragStartStartDate.current, 1);
        }

        setEndDate(nextEndDate);
        setStartDate(dragStartStartDate.current);
        setActivePreset(null);
      }
    },
    [today],
  );

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handleMove = (event: MouseEvent | TouchEvent) => {
      if ("touches" in event) {
        event.preventDefault();
      }

      const clientX =
        "touches" in event ? event.touches[0].clientX : event.clientX;
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
  }, [applyDragDelta, endDate, isDragging, notifyChange, startDate]);

  const startIndex = dayToIndex(startDate);
  const endIndex = dayToIndex(endDate);
  const selectionLeft = startIndex * TICK_WIDTH;
  const selectionWidth = (endIndex - startIndex + 1) * TICK_WIDTH;

  const dateLabel = `${format(startDate, "MMMM d")} – ${
    isToday(endDate) ? "Today" : format(endDate, "MMMM d")
  }`;

  const ticks = useMemo(() => {
    const builtTicks: { index: number; isWeek: boolean; isMonth: boolean }[] = [];

    for (let i = 0; i <= TOTAL_DAYS; i += 1) {
      const date = indexToDay(i);
      builtTicks.push({
        index: i,
        isWeek: date.getDay() === 0,
        isMonth: date.getDate() === 1,
      });
    }

    return builtTicks;
  }, []);

  return (
    <div className="proteus-panel hide-scrollbar w-full max-w-4xl select-none rounded-xl p-3 sm:p-5">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <input
            className={cn(
              "w-full border-b-2 bg-transparent py-1 pr-7 text-sm outline-none transition-colors",
              isFocused
                ? "border-blue-400 text-gray-800 placeholder-gray-400"
                : "border-transparent font-medium text-gray-800",
            )}
            onBlur={() => {
              setTimeout(() => setIsFocused(false), 200);
            }}
            onChange={(event) => handleNaturalLanguageInput(event.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setInputValue("");
            }}
            placeholder={isFocused ? 'e.g. "Q4", "yesterday", "july"' : undefined}
            type="text"
            value={isFocused ? inputValue : dateLabel}
          />

          {isFocused && inputValue ? (
            <button
              className="absolute top-1/2 right-0 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setInputValue("");
              }}
              onMouseDown={(event) => event.preventDefault()}
            >
              <X size={14} />
            </button>
          ) : null}
        </div>

        <div className="hide-scrollbar flex shrink-0 items-center gap-1 overflow-x-auto">
          {PRESET_OPTIONS.map((preset) => (
            <button
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition-all duration-200",
                activePreset === preset.key
                  ? "border border-gray-300 bg-white font-bold text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
              key={preset.key}
              onClick={() => applyPreset(preset.key)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="hide-scrollbar -mb-px mb-1 flex items-center gap-1 overflow-x-auto border-b border-gray-100">
        {GRANULARITY_TABS.map((tab) => (
          <button
            className={cn(
              "-mb-px border-b-2 px-3 py-2.5 text-xs whitespace-nowrap transition-all duration-200 sm:py-1.5",
              activeGranularity === tab.key
                ? "border-blue-500 font-semibold text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-600",
            )}
            key={tab.key}
            onClick={() =>
              setActiveGranularity((previous) =>
                previous === tab.key ? null : tab.key,
              )
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          activeGranularity ? "max-h-80 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {activeGranularity === "year" ? (
          <YearPanel
            endDate={endDate}
            onSelect={handlePanelSelect}
            startDate={startDate}
            today={today}
          />
        ) : null}

        {activeGranularity === "half-year" ? (
          <HalfYearPanel
            endDate={endDate}
            onSelect={handlePanelSelect}
            startDate={startDate}
            today={today}
          />
        ) : null}

        {activeGranularity === "quarter" ? (
          <QuarterPanel
            endDate={endDate}
            onSelect={handlePanelSelect}
            startDate={startDate}
            today={today}
          />
        ) : null}

        {activeGranularity === "month" ? (
          <MonthPanel
            endDate={endDate}
            onSelect={handlePanelSelect}
            startDate={startDate}
            today={today}
          />
        ) : null}

        {activeGranularity === "day" ? (
          <DayPanel
            onSelect={handlePanelSelect}
            startDate={startDate}
            today={today}
          />
        ) : null}
      </div>

      <div className="mt-2 flex items-stretch gap-2">
        <button
          aria-label="Scroll timeline back"
          className="flex w-8 shrink-0 items-center justify-center text-gray-400 transition-colors hover:text-gray-600"
          onClick={handleBack}
        >
          <svg
            className="shrink-0"
            fill="none"
            height="16"
            viewBox="0 0 16 16"
            width="16"
          >
            <path
              d="M10.5 3L5.5 8L10.5 13"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>

        <div
          className="hide-scrollbar relative flex-1 overflow-x-auto"
          ref={rulerRef}
          style={{ height: 72 }}
        >
          <div className="relative" style={{ width: RULER_WIDTH, height: "100%" }}>
            <div className="absolute inset-x-0 top-0" style={{ height: 36 }}>
              {ticks.map((tick) => {
                const left = tick.index * TICK_WIDTH;
                const insideSelection = tick.index >= startIndex && tick.index <= endIndex;

                return (
                  <div
                    className={cn(
                      "absolute top-0 w-px",
                      tick.isMonth
                        ? "h-6 bg-gray-400"
                        : tick.isWeek
                          ? "h-4 bg-gray-300"
                          : "h-2.5 bg-gray-200",
                      insideSelection && !isDragging && "bg-blue-300",
                      insideSelection && isDragging && "bg-blue-400",
                    )}
                    key={tick.index}
                    style={{ left }}
                  />
                );
              })}
            </div>

            <div
              className={cn(
                "absolute top-0 rounded-lg border bg-white/90 shadow-sm",
                isDragging ? "border-blue-400 shadow-md" : "border-gray-200",
                !isDragging && "transition-all duration-300 ease-out",
              )}
              style={{
                left: selectionLeft,
                width: Math.max(selectionWidth, 24),
                height: 36,
                borderLeftWidth: isDragging ? 3 : 2,
                borderLeftColor: isDragging
                  ? "rgb(96 165 250)"
                  : "rgb(147 197 253)",
              }}
            >
              <div
                className="absolute top-1/2 left-0 z-10 flex -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center p-1"
                onMouseDown={(event) => handleMouseDown("left", event)}
                onTouchStart={(event) => handleTouchStart("left", event)}
              >
                <div className="h-5 w-5 rounded-full border-2 border-blue-400 bg-white shadow transition-transform hover:scale-110 hover:border-blue-500 sm:h-4 sm:w-4" />
              </div>

              <div
                className="absolute inset-0 mx-4 flex cursor-grab items-center justify-center active:cursor-grabbing"
                onMouseDown={(event) => handleMouseDown("body", event)}
                onTouchStart={(event) => handleTouchStart("body", event)}
              >
                <span className="pointer-events-none text-[10px] font-semibold whitespace-nowrap text-gray-600">
                  {dayCount} {dayCount === 1 ? "Day" : "Days"}
                </span>
              </div>

              <div
                className="absolute top-1/2 right-0 z-10 flex translate-x-1/2 -translate-y-1/2 items-center justify-center p-1"
                onMouseDown={(event) => handleMouseDown("right", event)}
                onTouchStart={(event) => handleTouchStart("right", event)}
              >
                <div className="h-5 w-5 cursor-e-resize rounded-full border-2 border-blue-400 bg-white shadow transition-transform hover:scale-110 hover:border-blue-500 sm:h-4 sm:w-4" />
              </div>
            </div>

            <div className="absolute inset-x-0 flex" style={{ top: 44, height: 28 }}>
              {monthMarkers.map((monthMarker) => {
                const isActive =
                  dayToIndex(startOfMonth(monthMarker.date)) <= endIndex &&
                  dayToIndex(endOfMonth(monthMarker.date)) >= startIndex;

                return (
                  <button
                    className={cn(
                      "absolute text-xs whitespace-nowrap transition-all duration-200",
                      isActive
                        ? "font-bold text-gray-800"
                        : "font-normal text-gray-400 hover:text-gray-600",
                    )}
                    key={monthMarker.index}
                    onClick={() => handleMonthClick(monthMarker.date)}
                    style={{ left: monthMarker.index * TICK_WIDTH }}
                  >
                    {monthMarker.label}
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
