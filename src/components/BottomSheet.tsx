"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  content,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}) {
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLPreElement>(null);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = content;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [content]);

  // Auto-copy when opened
  useEffect(() => {
    if (isOpen) {
      copyToClipboard();
    }
  }, [isOpen, copyToClipboard]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/30 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
        style={{ maxHeight: "70vh" }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className={cn(
                "px-3 py-1 text-xs rounded-full transition-all duration-200",
                copied
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-auto p-5" style={{ maxHeight: "calc(70vh - 80px)" }}>
          <pre
            ref={contentRef}
            className="text-xs text-gray-700 whitespace-pre-wrap break-words font-mono leading-relaxed"
          >
            {content}
          </pre>
        </div>
      </div>
    </>
  );
}
