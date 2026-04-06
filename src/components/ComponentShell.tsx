"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Undo2 } from "lucide-react";
import BottomSheet from "@/components/BottomSheet";
import FloatingComponentDock from "@/components/FloatingComponentDock";
import { componentNavLinks } from "@/lib/componentNavLinks";

export default function ComponentShell({
  title,
  codeContent,
  promptContent,
  children,
}: {
  title: string;
  codeContent: string;
  promptContent: string;
  children: React.ReactNode;
}) {
  const [sheetOpen, setSheetOpen] = useState<"code" | "prompt" | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const storedTheme = window.localStorage.getItem("proteus-shell-theme");
    return storedTheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    window.localStorage.setItem("proteus-shell-theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <div
      className={`
        min-h-screen flex flex-col transition-colors
        ${isDark ? "bg-[#0f1117]" : "bg-[var(--background)]"}
      `}
    >
      {/* Header */}
      <header
        className={`
          sticky top-0 z-30 border-b px-4 py-3 transition-colors
          ${isDark ? "border-[#242834] bg-[#0f1117]" : "border-gray-200/60 bg-[var(--background)]"}
        `}
      >
        <Link
          href="/"
          className={`
            inline-flex items-center gap-2 text-sm transition-colors
            ${isDark ? "text-[#aab1be] hover:text-[#e4e7ee]" : "text-gray-600 hover:text-gray-900"}
          `}
        >
          <Undo2 size={16} />
          <span>Back</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center gap-5 p-6 pb-28 sm:p-8 sm:pb-32">
        <h1 className={`text-xl font-semibold ${isDark ? "text-[#e4e7ee]" : "text-gray-800"}`}>
          {title}
        </h1>
        {children}
      </main>

      <FloatingComponentDock
        componentLinks={componentNavLinks}
        onCopyCode={() => setSheetOpen("code")}
        onCopyPrompt={() => setSheetOpen("prompt")}
        onThemeChange={setTheme}
        theme={theme}
      />

      {/* Bottom Sheets */}
      <BottomSheet
        isOpen={sheetOpen === "code"}
        onClose={() => setSheetOpen(null)}
        title="Component Code (Next.js)"
        content={codeContent}
      />
      <BottomSheet
        isOpen={sheetOpen === "prompt"}
        onClose={() => setSheetOpen(null)}
        title="Claude / Codex Prompt"
        content={promptContent}
      />
    </div>
  );
}
