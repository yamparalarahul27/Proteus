"use client";

import ComponentShell from "@/components/ComponentShell";
import BeforeAfter from "@/components/BeforeAfter";

const codeContent = `// See /src/components/BeforeAfter.tsx for full source`;
const promptContent = `Create a before/after image comparison slider component. Two images stacked with a draggable vertical divider. Clip the "before" image to the left of the divider. Circular handle with left/right arrows. Labels appear on hover. Pointer events for drag on desktop and mobile. Smooth, minimal design.`;

export default function BeforeAfterPage() {
  return (
    <ComponentShell
      title="Before & After"
      codeContent={codeContent}
      promptContent={promptContent}
    >
      <div className="flex w-full max-w-2xl flex-col items-center gap-10 px-4">
        {/* Main demo */}
        <BeforeAfter
          before="https://picsum.photos/seed/before1/1200/750"
          after="https://picsum.photos/seed/after1/1200/750"
          beforeLabel="Before"
          afterLabel="After"
        />

        {/* Second example — different aspect ratio */}
        <div className="flex w-full flex-col items-center gap-3">
          <p className="text-sm font-medium text-gray-500">Square</p>
          <BeforeAfter
            before="https://picsum.photos/seed/before2/800/800"
            after="https://picsum.photos/seed/after2/800/800"
            aspectRatio="1/1"
            beforeLabel="Original"
            afterLabel="Edited"
            width="100%"
          />
        </div>

        {/* Third — cinematic */}
        <div className="flex w-full flex-col items-center gap-3">
          <p className="text-sm font-medium text-gray-500">Cinematic (21:9)</p>
          <BeforeAfter
            before="https://picsum.photos/seed/before3/1200/514"
            after="https://picsum.photos/seed/after3/1200/514"
            aspectRatio="21/9"
            beforeLabel="Raw"
            afterLabel="Graded"
          />
        </div>

        {/* Credit */}
        <p className="text-xs text-gray-400">
          Inspired by{" "}
          <a
            href="https://x.com/raunofreiberg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-gray-600"
          >
            @raunofreiberg
          </a>
        </p>
      </div>
    </ComponentShell>
  );
}
