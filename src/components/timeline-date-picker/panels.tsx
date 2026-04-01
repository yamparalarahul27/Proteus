import { useState } from "react";
import {
  addMonths,
  endOfMonth,
  endOfYear,
  format,
  getDay,
  isToday,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type RangePanelProps = {
  today: Date;
  startDate: Date;
  endDate: Date;
  onSelect: (startDate: Date, endDate: Date) => void;
};

export function YearPanel({
  today,
  startDate,
  endDate,
  onSelect,
}: RangePanelProps) {
  const currentYear = today.getFullYear();
  const years = Array.from({ length: 8 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="flex flex-wrap gap-2 py-3">
      {years.map((year) => {
        const start = new Date(year, 0, 1);
        const end = endOfYear(start);
        const cappedEnd = end > today ? today : end;
        const isSelected =
          startDate.getFullYear() === year &&
          startOfYear(startDate).getTime() === start.getTime() &&
          endDate.getTime() === cappedEnd.getTime();

        return (
          <button
            className={cn(
              "rounded-lg px-4 py-2 text-sm transition-all",
              isSelected
                ? "border-2 border-blue-400 bg-blue-50 font-semibold text-blue-700"
                : "border border-gray-200 text-gray-600 hover:border-gray-400",
            )}
            key={year}
            onClick={() => onSelect(start, cappedEnd)}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
}

export function HalfYearPanel({
  today,
  startDate,
  endDate,
  onSelect,
}: RangePanelProps) {
  const currentYear = today.getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="space-y-3 py-3">
      {years.map((year) => (
        <div key={year}>
          <div className="mb-1.5 text-xs text-gray-400">{year}</div>
          <div className="flex gap-2">
            {[1, 2].map((half) => {
              const start = half === 1 ? new Date(year, 0, 1) : new Date(year, 6, 1);
              const end =
                half === 1
                  ? endOfMonth(new Date(year, 5, 1))
                  : endOfMonth(new Date(year, 11, 1));
              const cappedEnd = end > today ? today : end;
              const isFuture = start > today;
              const isSelected =
                startDate.getTime() === start.getTime() &&
                endDate.getTime() === cappedEnd.getTime();

              return (
                <button
                  className={cn(
                    "rounded-lg px-4 py-2.5 text-sm transition-all sm:py-2",
                    isFuture && "cursor-not-allowed opacity-40",
                    isSelected
                      ? "border-2 border-blue-400 bg-blue-50 font-semibold text-blue-700"
                      : "border border-gray-200 text-gray-600 hover:border-gray-400",
                  )}
                  disabled={isFuture}
                  key={half}
                  onClick={() => onSelect(start, cappedEnd)}
                >
                  H{half}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function QuarterPanel({
  today,
  startDate,
  endDate,
  onSelect,
}: RangePanelProps) {
  const currentYear = today.getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="space-y-3 py-3">
      {years.map((year) => (
        <div key={year}>
          <div className="mb-1.5 text-xs text-gray-400">{year}</div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((quarter) => {
              const startMonth = (quarter - 1) * 3;
              const start = new Date(year, startMonth, 1);
              const end = endOfMonth(new Date(year, startMonth + 2, 1));
              const cappedEnd = end > today ? today : end;
              const isFuture = start > today;
              const isSelected =
                startDate.getTime() === start.getTime() &&
                endDate.getTime() === cappedEnd.getTime();

              return (
                <button
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm transition-all sm:py-2",
                    isFuture && "cursor-not-allowed opacity-40",
                    isSelected
                      ? "border-2 border-blue-400 bg-blue-50 font-semibold text-blue-700"
                      : "border border-gray-200 text-gray-600 hover:border-gray-400",
                  )}
                  disabled={isFuture}
                  key={quarter}
                  onClick={() => onSelect(start, cappedEnd)}
                >
                  Q{quarter}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function MonthPanel({
  today,
  startDate,
  endDate,
  onSelect,
}: RangePanelProps) {
  const currentYear = today.getFullYear();
  const years = [currentYear - 1, currentYear];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="space-y-3 py-3">
      {years.map((year) => (
        <div key={year}>
          <div className="mb-1.5 text-xs text-gray-400">{year}</div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {monthNames.map((monthName, monthIndex) => {
              const start = new Date(year, monthIndex, 1);
              const end = endOfMonth(start);
              const cappedEnd = end > today ? today : end;
              const isFuture = start > today;
              const isSelected =
                startDate.getTime() === start.getTime() &&
                endDate.getTime() === cappedEnd.getTime();

              return (
                <button
                  className={cn(
                    "rounded-lg px-2 py-2 text-sm transition-all sm:py-1.5",
                    isFuture && "cursor-not-allowed opacity-40",
                    isSelected
                      ? "border-2 border-blue-400 bg-blue-50 font-semibold text-blue-700"
                      : "border border-gray-200 text-gray-600 hover:border-gray-400",
                  )}
                  disabled={isFuture}
                  key={monthName}
                  onClick={() => onSelect(start, cappedEnd)}
                >
                  {monthName}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DayPanel({
  today,
  startDate,
  onSelect,
}: {
  today: Date;
  startDate: Date;
  onSelect: (startDate: Date, endDate: Date) => void;
}) {
  const [viewMonth, setViewMonth] = useState(startDate);
  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const startDay = getDay(monthStart);
  const daysInMonth = monthEnd.getDate();
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  return (
    <div className="py-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {format(viewMonth, "MMMM yyyy")}
        </span>
        <div className="flex gap-1">
          <button
            className="rounded p-2 text-gray-500 hover:bg-gray-100 sm:p-1"
            onClick={() => setViewMonth((value) => subMonths(value, 1))}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="rounded p-2 text-gray-500 hover:bg-gray-100 sm:p-1"
            onClick={() => setViewMonth((value) => addMonths(value, 1))}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-0">
        {weekdays.map((weekday) => (
          <div
            className="py-1 text-center text-[11px] font-medium text-gray-400"
            key={weekday}
          >
            {weekday}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0">
        {cells.map((day, index) => {
          if (day === null) {
            return <div className="h-10 sm:h-9" key={`blank-${index}`} />;
          }

          const date = new Date(
            viewMonth.getFullYear(),
            viewMonth.getMonth(),
            day,
          );
          date.setHours(0, 0, 0, 0);

          const isFuture = date > today;
          const isSelected = startDate.getTime() === date.getTime();
          const isTodayDate = isToday(date);
          const dayOfWeek = (startDay + day - 1) % 7;
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          return (
            <button
              className={cn(
                "flex h-10 items-center justify-center rounded-full text-sm transition-all sm:h-9",
                isFuture && "cursor-not-allowed opacity-30",
                isSelected && "bg-blue-500 font-semibold text-white",
                !isSelected &&
                  isTodayDate &&
                  "ring-2 ring-blue-300 ring-inset font-semibold text-blue-600",
                !isSelected &&
                  !isFuture &&
                  !isTodayDate &&
                  isWeekend &&
                  "text-gray-400 hover:bg-gray-100",
                !isSelected &&
                  !isFuture &&
                  !isTodayDate &&
                  !isWeekend &&
                  "text-gray-700 hover:bg-gray-100",
              )}
              disabled={isFuture}
              key={day}
              onClick={() => onSelect(date, date)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
