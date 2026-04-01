"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import TimelineDatePicker from "@/components/TimelineDatePicker";
import { cn } from "@/lib/utils";

export default function DatePickerPage() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-8 gap-4">
      <button
        onClick={() => setIsVisible((v) => !v)}
        className={cn(
          "p-3 rounded-xl transition-all duration-200",
          isVisible
            ? "bg-white border border-gray-300 shadow-sm text-gray-800"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        )}
        aria-label="Toggle date picker"
      >
        <Calendar size={20} />
      </button>

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

      <p className="text-xs text-gray-400">
        Design inspired by{" "}
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
  );
}
