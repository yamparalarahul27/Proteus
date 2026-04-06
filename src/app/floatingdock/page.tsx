"use client";

import ComponentShell from "@/components/ComponentShell";

const CODE_CONTENT = `https://github.com/anthropics/Proteus/blob/main/src/app/floatingdock/page.tsx`;

const PROMPT_CONTENT = `Create a floating bottom-center component dock used across all component pages with:
- Components dropdown
- Copy Code action
- Copy Prompt action
- Light / Dark theme switch only
Add credit to https://x.com/chalaska.`;

export default function FloatingDockPage() {
  return (
    <ComponentShell
      title="Floating Component Dock"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <section className="w-full max-w-2xl rounded-2xl border border-[var(--border-color)] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm uppercase tracking-[0.14em] text-[var(--text-secondary)]">
          Global UI Utility
        </p>
        <h2 className="mt-2 text-xl font-semibold text-[#111827] sm:text-2xl">
          Floating Bottom Dock Active
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#6b7280] sm:text-base">
          This page demonstrates the global floating dock now added to all component pages.
          Use it for Components navigation, Copy Code, Copy Prompt, and Light/Dark switching.
        </p>

        <p className="mt-5 text-sm text-[#6b7280]">
          Credit:{" "}
          <a
            href="https://x.com/chalaska"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#374151]"
          >
            @chalaska
          </a>
        </p>
      </section>
    </ComponentShell>
  );
}
