"use client";

import Link from "next/link";
import { ChevronDown, Diamond, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark";

export default function FloatingComponentDock({
  componentLinks,
  onCopyCode,
  onCopyPrompt,
  theme,
  onThemeChange,
}: {
  componentLinks: Array<{ href: string; label: string }>;
  onCopyCode: () => void;
  onCopyPrompt: () => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!containerRef.current) return;
      if (containerRef.current.contains(event.target as Node)) return;
      setIsMenuOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-3 left-1/2 z-30 w-[min(96vw,940px)] -translate-x-1/2 sm:bottom-5 sm:w-auto">
      <div ref={containerRef} className="pointer-events-auto relative">
        {isMenuOpen ? (
          <div className="absolute bottom-[calc(100%+10px)] left-0 max-h-[48vh] w-[min(92vw,320px)] overflow-auto rounded-2xl border border-[#2f3238] bg-[#1f2126] p-2 shadow-[0_16px_38px_rgba(0,0,0,0.45)]">
            {componentLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm text-[#d7dbe3] transition-colors hover:bg-[#2a2d34] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}

        {/* Mobile layout */}
        <div className="rounded-[26px] border border-[#2d2f35] bg-[#25272c] p-2 shadow-[0_16px_40px_rgba(0,0,0,0.32)] sm:hidden">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#2f3238] bg-[#202227] px-3 py-2 text-sm font-medium text-[#d8dde6]"
            >
              <Diamond size={14} />
              <span>Components</span>
              <ChevronDown size={14} className={cn(isMenuOpen ? "rotate-180" : "")} />
            </button>

            <div className="inline-flex items-center rounded-full border border-[#2f3238] bg-[#202227] p-1">
              <button
                type="button"
                aria-label="Use light theme"
                onClick={() => onThemeChange("light")}
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-2 py-1 transition-colors",
                  theme === "light" ? "bg-white text-[#1f2937]" : "text-[#96a0b0]",
                )}
              >
                <Sun size={14} />
              </button>
              <button
                type="button"
                aria-label="Use dark theme"
                onClick={() => onThemeChange("dark")}
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-2 py-1 transition-colors",
                  theme === "dark" ? "bg-white text-[#1f2937]" : "text-[#96a0b0]",
                )}
              >
                <Moon size={14} />
              </button>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onCopyCode}
              className="rounded-xl border border-[#2f3238] bg-[#202227] px-3 py-2 text-sm font-medium text-[#d8dde6]"
            >
              Copy Code
            </button>
            <button
              type="button"
              onClick={onCopyPrompt}
              className="rounded-xl border border-[#2f3238] bg-[#202227] px-3 py-2 text-sm font-medium text-[#d8dde6]"
            >
              Copy Prompt
            </button>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden items-center rounded-[999px] border border-[#2d2f35] bg-[#25272c] px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.32)] sm:flex">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[15px] font-medium text-[#d8dde6] transition-colors hover:bg-[#2a2d34]"
          >
            <span>Components</span>
            <ChevronDown size={15} className={cn(isMenuOpen ? "rotate-180" : "")} />
          </button>

          <span className="mx-3 h-8 w-px bg-[#33363e]" />

          <button
            type="button"
            onClick={onCopyCode}
            className="rounded-full px-3 py-2 text-[15px] font-medium text-[#d8dde6] transition-colors hover:bg-[#2a2d34]"
          >
            Copy Code
          </button>

          <span className="mx-3 h-8 w-px bg-[#33363e]" />

          <button
            type="button"
            onClick={onCopyPrompt}
            className="rounded-full px-3 py-2 text-[15px] font-medium text-[#d8dde6] transition-colors hover:bg-[#2a2d34]"
          >
            Copy Prompt
          </button>

          <span className="mx-3 h-8 w-px bg-[#33363e]" />

          <div className="inline-flex items-center rounded-full border border-[#2f3238] bg-[#202227] p-1">
            <button
              type="button"
              aria-label="Use light theme"
              onClick={() => onThemeChange("light")}
              className={cn(
                "inline-flex items-center justify-center rounded-full px-2.5 py-1.5 transition-colors",
                theme === "light" ? "bg-white text-[#1f2937]" : "text-[#96a0b0]",
              )}
            >
              <Sun size={14} />
            </button>
            <button
              type="button"
              aria-label="Use dark theme"
              onClick={() => onThemeChange("dark")}
              className={cn(
                "inline-flex items-center justify-center rounded-full px-2.5 py-1.5 transition-colors",
                theme === "dark" ? "bg-white text-[#1f2937]" : "text-[#96a0b0]",
              )}
            >
              <Moon size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
