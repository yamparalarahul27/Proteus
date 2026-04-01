"use client";

import { useState } from "react";
import Link from "next/link";
import { Code, MessageSquare, Undo2 } from "lucide-react";
import BottomSheet from "@/components/BottomSheet";

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
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        {children}
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
