import {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  addYears,
  subYears,
  setMonth,
} from "date-fns";

export type Granularity = "day" | "month" | "quarter" | "half-year" | "year";

export type ParseResult = {
  startDate: Date;
  endDate: Date;
  granularity: Granularity;
} | null;

const MONTH_MAP: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

const MONTH_PATTERN = Object.keys(MONTH_MAP).join("|");

function makeDate(year: number, month: number, day: number): Date {
  const d = new Date(year, month, day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function quarterRange(quarter: number, year: number): { start: Date; end: Date } {
  const startMonth = (quarter - 1) * 3;
  return {
    start: makeDate(year, startMonth, 1),
    end: endOfMonth(makeDate(year, startMonth + 2, 1)),
  };
}

function halfYearRange(half: number, year: number): { start: Date; end: Date } {
  return half === 1
    ? { start: makeDate(year, 0, 1), end: endOfMonth(makeDate(year, 5, 1)) }
    : { start: makeDate(year, 6, 1), end: endOfMonth(makeDate(year, 11, 1)) };
}

export function parseDateInput(input: string, referenceDate?: Date): ParseResult {
  const today = referenceDate ?? new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();
  const text = input.trim().toLowerCase().replace(/\s+/g, " ");

  if (!text) return null;

  // "today"
  if (/^today$/.test(text)) {
    return { startDate: today, endDate: today, granularity: "day" };
  }

  // "yesterday"
  if (/^yesterday$/.test(text)) {
    const d = subDays(today, 1);
    return { startDate: d, endDate: d, granularity: "day" };
  }

  // "last N days"
  {
    const m = text.match(/^last\s+(\d+)\s+days?$/);
    if (m) {
      const n = parseInt(m[1], 10);
      return { startDate: subDays(today, n - 1), endDate: today, granularity: "day" };
    }
  }

  // "q1" – "q4" (optionally with year)
  {
    const m = text.match(/^q([1-4])(?:\s+(\d{4}))?$/);
    if (m) {
      const q = parseInt(m[1], 10);
      const y = m[2] ? parseInt(m[2], 10) : year;
      const range = quarterRange(q, y);
      return { startDate: range.start, endDate: range.end, granularity: "quarter" };
    }
  }

  // "h1" / "h2" (optionally with year)
  {
    const m = text.match(/^h([12])(?:\s+(\d{4}))?$/);
    if (m) {
      const h = parseInt(m[1], 10);
      const y = m[2] ? parseInt(m[2], 10) : year;
      const range = halfYearRange(h, y);
      return { startDate: range.start, endDate: range.end, granularity: "half-year" };
    }
  }

  // "next year" / "last year" / "this year"
  if (/^next\s+year$/.test(text)) {
    const d = addYears(today, 1);
    return { startDate: startOfYear(d), endDate: endOfYear(d), granularity: "year" };
  }
  if (/^last\s+year$/.test(text)) {
    const d = subYears(today, 1);
    return { startDate: startOfYear(d), endDate: endOfYear(d), granularity: "year" };
  }
  if (/^this\s+year$/.test(text)) {
    return { startDate: startOfYear(today), endDate: endOfYear(today), granularity: "year" };
  }

  // "2025" (4-digit year)
  {
    const m = text.match(/^(\d{4})$/);
    if (m) {
      const y = parseInt(m[1], 10);
      const d = makeDate(y, 0, 1);
      return { startDate: startOfYear(d), endDate: endOfYear(d), granularity: "year" };
    }
  }

  // "this month" / "last month"
  if (/^this\s+month$/.test(text)) {
    return { startDate: startOfMonth(today), endDate: endOfMonth(today), granularity: "month" };
  }
  if (/^last\s+month$/.test(text)) {
    const d = setMonth(today, today.getMonth() - 1);
    return { startDate: startOfMonth(d), endDate: endOfMonth(d), granularity: "month" };
  }

  // "jan 1 2025" / "january 1, 2025" (month + day + year)
  {
    const re = new RegExp(`^(${MONTH_PATTERN})\\s+(\\d{1,2}),?\\s+(\\d{4})$`);
    const m = text.match(re);
    if (m) {
      const mo = MONTH_MAP[m[1]];
      const day = parseInt(m[2], 10);
      const y = parseInt(m[3], 10);
      const d = makeDate(y, mo, day);
      return { startDate: d, endDate: d, granularity: "day" };
    }
  }

  // "jan 1" / "january 15" (month + day, current year)
  {
    const re = new RegExp(`^(${MONTH_PATTERN})\\s+(\\d{1,2})$`);
    const m = text.match(re);
    if (m) {
      const mo = MONTH_MAP[m[1]];
      const day = parseInt(m[2], 10);
      const d = makeDate(year, mo, day);
      return { startDate: d, endDate: d, granularity: "day" };
    }
  }

  // "jan 2025" / "july 2025" (month + year)
  {
    const re = new RegExp(`^(${MONTH_PATTERN})\\s+(\\d{4})$`);
    const m = text.match(re);
    if (m) {
      const mo = MONTH_MAP[m[1]];
      const y = parseInt(m[2], 10);
      const d = makeDate(y, mo, 1);
      return { startDate: startOfMonth(d), endDate: endOfMonth(d), granularity: "month" };
    }
  }

  // "jan" / "july" (month name alone, current year)
  {
    const re = new RegExp(`^(${MONTH_PATTERN})$`);
    const m = text.match(re);
    if (m) {
      const mo = MONTH_MAP[m[1]];
      const d = makeDate(year, mo, 1);
      return { startDate: startOfMonth(d), endDate: endOfMonth(d), granularity: "month" };
    }
  }

  return null;
}
