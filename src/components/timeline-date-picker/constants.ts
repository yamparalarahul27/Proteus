import {
  differenceInCalendarDays,
  format,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import type { Granularity } from "@/lib/parseDateInput";

export type Preset = "thisMonth" | "7d" | "30d" | "90d" | null;

export type MonthMarker = {
  label: string;
  index: number;
  date: Date;
};

export const TICK_WIDTH = 4;
export const TOTAL_DAYS = 365;
export const RULER_WIDTH = TOTAL_DAYS * TICK_WIDTH;

export const GRANULARITY_TABS: { key: Granularity; label: string }[] = [
  { key: "day", label: "Day" },
  { key: "month", label: "Month" },
  { key: "quarter", label: "Quarter" },
  { key: "half-year", label: "Half-year" },
  { key: "year", label: "Year" },
];

export const PRESET_OPTIONS: { key: Preset; label: string }[] = [
  { key: "thisMonth", label: "This month" },
  { key: "7d", label: "Last 7D" },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
];

export function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function dayToIndex(day: Date): number {
  const today = getToday();
  const diff = differenceInCalendarDays(today, day);
  return TOTAL_DAYS - diff;
}

export function indexToDay(index: number): Date {
  const today = getToday();
  return subDays(today, TOTAL_DAYS - index);
}

export function getMonthMarkers(): MonthMarker[] {
  const today = getToday();
  const markers: MonthMarker[] = [];

  for (let i = 13; i >= 0; i -= 1) {
    const date = startOfMonth(subMonths(today, i));
    const index = dayToIndex(date);

    if (index >= 0 && index <= TOTAL_DAYS) {
      markers.push({ label: format(date, "MMMM"), index, date });
    }
  }

  return markers;
}
