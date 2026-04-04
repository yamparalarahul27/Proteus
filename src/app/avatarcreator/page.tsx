"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ComponentShell from "@/components/ComponentShell";

type AvatarSwatch = {
  id: string;
  top: string;
  bottom: string;
};

const PRESET_SWATCHES: AvatarSwatch[] = [
  { id: "orange", top: "#ff7a17", bottom: "#ff9b3f" },
  { id: "purple", top: "#9b4ee8", bottom: "#ad73ee" },
  { id: "blue", top: "#5d8de8", bottom: "#8ab8f5" },
  { id: "charcoal", top: "#62626d", bottom: "#787884" },
  { id: "silver", top: "#c8c8ca", bottom: "#dddddf" },
  { id: "sage", top: "#afc39e", bottom: "#c5d7b8" },
  { id: "lavender", top: "#bcadd8", bottom: "#d3c8e8" },
  { id: "pink", top: "#e79ebd", bottom: "#f1bed5" },
  { id: "peach", top: "#e8a19c", bottom: "#f2c2be" },
  { id: "mint", top: "#37cc9b", bottom: "#6fddb4" },
  { id: "rose", top: "#ef6b85", bottom: "#f59daf" },
  { id: "sun", top: "#f2c707", bottom: "#f2de86" },
];

const CODE_CONTENT = `"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type AvatarSwatch = {
  id: string;
  top: string;
  bottom: string;
};

const PRESET_SWATCHES: AvatarSwatch[] = [
  { id: "orange", top: "#ff7a17", bottom: "#ff9b3f" },
  { id: "purple", top: "#9b4ee8", bottom: "#ad73ee" },
  { id: "blue", top: "#5d8de8", bottom: "#8ab8f5" },
  { id: "charcoal", top: "#62626d", bottom: "#787884" },
  { id: "silver", top: "#c8c8ca", bottom: "#dddddf" },
  { id: "sage", top: "#afc39e", bottom: "#c5d7b8" },
  { id: "lavender", top: "#bcadd8", bottom: "#d3c8e8" },
  { id: "pink", top: "#e79ebd", bottom: "#f1bed5" },
  { id: "peach", top: "#e8a19c", bottom: "#f2c2be" },
  { id: "mint", top: "#37cc9b", bottom: "#6fddb4" },
  { id: "rose", top: "#ef6b85", bottom: "#f59daf" },
  { id: "sun", top: "#f2c707", bottom: "#f2de86" },
];

function SplitCircle({
  bottom,
  className,
  size,
  top,
}: {
  bottom: string;
  className?: string;
  size: number | string;
  top: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={\\\`rounded-full \\\${className ?? ""}\\\`}
      style={{
        background: \\\`linear-gradient(180deg, \\\${top} 0 50%, \\\${bottom} 50% 100%)\\\`,
        height: size,
        width: size,
      }}
    />
  );
}

export default function AvatarCreatorPage() {
  const [customSwatches, setCustomSwatches] = useState<AvatarSwatch[]>([]);
  const [selectedSwatchId, setSelectedSwatchId] = useState("purple");
  const [showAddPopover, setShowAddPopover] = useState(false);
  const [draftTop, setDraftTop] = useState("#082357");
  const [draftBottom, setDraftBottom] = useState("#334679");
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const allSwatches = useMemo(
    () => [...PRESET_SWATCHES, ...customSwatches],
    [customSwatches],
  );

  const selectedSwatch =
    allSwatches.find((swatch) => swatch.id === selectedSwatchId) ?? allSwatches[0];

  useEffect(() => {
    if (!showAddPopover) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (popoverRef.current?.contains(target) || addButtonRef.current?.contains(target)) {
        return;
      }
      setShowAddPopover(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowAddPopover(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showAddPopover]);

  function handleShuffle() {
    if (allSwatches.length === 0) {
      return;
    }

    const candidates =
      allSwatches.length > 1
        ? allSwatches.filter((swatch) => swatch.id !== selectedSwatchId)
        : allSwatches;
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const nextSwatch = candidates[randomIndex];
    if (!nextSwatch) {
      return;
    }

    setSelectedSwatchId(nextSwatch.id);
    setShowAddPopover(false);
  }

  function handleAddSwatch() {
    const newSwatch: AvatarSwatch = {
      id: \\\`custom-\\\${crypto.randomUUID()}\\\`,
      top: draftTop,
      bottom: draftBottom,
    };

    setCustomSwatches((prev) => [...prev, newSwatch]);
    setSelectedSwatchId(newSwatch.id);
    setShowAddPopover(false);
  }

  return (
    <div className="w-full max-w-[620px] rounded-[28px] border border-white/80 bg-[#f9fafb] px-5 py-6 shadow-[0_20px_38px_rgba(15,23,42,0.05)] sm:px-9 sm:py-9">
      <h2 className="text-[15px] font-semibold uppercase tracking-[0.05em] text-[#a1a1a1] sm:text-[17px]">
        Avatar Creator
      </h2>

      <div className="mt-6 flex flex-col items-start gap-4 sm:mt-8 sm:flex-row sm:items-center sm:gap-8">
        <SplitCircle
          bottom={selectedSwatch.bottom}
          className="shadow-[0_14px_18px_rgba(15,23,42,0.12)]"
          size="clamp(86px,24vw,104px)"
          top={selectedSwatch.top}
        />
        <button
          className="rounded-full border border-[#dddddf] bg-white px-5 py-[9px] text-[15px] font-medium text-[#666666] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#fdfdfd] sm:px-6 sm:py-[10px] sm:text-[16px]"
          onClick={handleShuffle}
          type="button"
        >
          <span className="inline-flex items-center gap-2 text-[15px] leading-none sm:text-[16px]">
            <span aria-hidden="true" className="text-[15px]">
              🎲
            </span>
            <span>Shuffle</span>
          </span>
        </button>
      </div>

      <div className="relative mt-7 sm:mt-9">
        <div className="grid w-fit grid-cols-4 gap-2.5 sm:max-w-[560px] sm:grid-cols-7 sm:gap-x-[14px] sm:gap-y-[14px]">
          {allSwatches.map((swatch) => {
            const selected = swatch.id === selectedSwatchId;
            return (
              <button
                aria-label={\\\`Select \\\${swatch.id} color pair\\\`}
                className={\\\`relative flex h-[54px] w-[54px] items-center justify-center rounded-full transition-transform hover:-translate-y-0.5 sm:h-[60px] sm:w-[60px] \\\${
                  selected
                    ? "ring-2 ring-[#b574f0] ring-offset-2 ring-offset-[#f9fafb]"
                    : "ring-1 ring-transparent"
                }\\\`}
                key={swatch.id}
                onClick={() => {
                  setSelectedSwatchId(swatch.id);
                  setShowAddPopover(false);
                }}
                type="button"
              >
                <SplitCircle
                  bottom={swatch.bottom}
                  size="clamp(50px, 14vw, 58px)"
                  top={swatch.top}
                />
              </button>
            );
          })}

          <button
            aria-label="Add custom avatar colors"
            className="flex h-[54px] w-[54px] items-center justify-center rounded-full border-2 border-dashed border-[#d4d4d6] bg-transparent text-[30px] leading-none text-[#cccccf] transition-colors hover:border-[#bcbcc0] hover:text-[#bcbcc0] sm:h-[60px] sm:w-[60px] sm:text-[34px]"
            onClick={() => setShowAddPopover((prev) => !prev)}
            ref={addButtonRef}
            type="button"
          >
            +
          </button>
        </div>

        {showAddPopover ? (
          <div
            className="absolute left-0 top-full z-20 mt-3 w-[198px] rounded-[16px] bg-white p-4 shadow-[0_14px_30px_rgba(15,23,42,0.14)] sm:left-auto sm:right-1 sm:w-[210px] sm:rounded-[18px] sm:p-5"
            ref={popoverRef}
          >
            <div
              aria-hidden="true"
              className="absolute -top-[7px] right-[96px] hidden h-[14px] w-[14px] rotate-45 rounded-[3px] bg-white sm:block"
            />

            <div className="space-y-4">
              <label className="flex items-center justify-between gap-3">
                <span className="text-[14px] font-semibold text-[#a3a3a3] sm:text-[15px]">Top</span>
                <span
                  className="relative h-8 w-[90px] rounded-[2px] border border-[#dddddf]"
                  style={{ backgroundColor: draftTop }}
                >
                  <input
                    aria-label="Top avatar color"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(event) => setDraftTop(event.target.value)}
                    type="color"
                    value={draftTop}
                  />
                </span>
              </label>

              <label className="flex items-center justify-between gap-3">
                <span className="text-[14px] font-semibold text-[#a3a3a3] sm:text-[15px]">Bottom</span>
                <span
                  className="relative h-8 w-[90px] rounded-[2px] border border-[#dddddf]"
                  style={{ backgroundColor: draftBottom }}
                >
                  <input
                    aria-label="Bottom avatar color"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(event) => setDraftBottom(event.target.value)}
                    type="color"
                    value={draftBottom}
                  />
                </span>
              </label>
            </div>

            <button
              className="mt-4 w-full rounded-[12px] bg-[#191a1f] py-2.5 text-[16px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-opacity hover:opacity-90 sm:mt-5 sm:py-3 sm:text-[17px]"
              onClick={handleAddSwatch}
              type="button"
            >
              Add
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}`;

const PROMPT_CONTENT = `Build an Avatar Creator panel in Next.js with a split-color avatar preview, color swatch palette, shuffle action, and add-custom-color popover.

Requirements:
- Render a large circular avatar preview split horizontally into top and bottom colors.
- Show a 2-row swatch palette of circular split-color options.
- Selected swatch has a visible selection ring.
- Add a rounded Shuffle button that randomly selects a swatch.
- Include a dashed circular "+" slot that opens a floating custom-color popover.
- Popover includes "Top" and "Bottom" color pickers plus an "Add" button.
- On Add, append the new swatch to the palette and select it.
- Close popover on outside click or Escape.
- Style should match a clean soft card aesthetic with subtle shadows and gray background.`;

function SplitCircle({
  bottom,
  className,
  size,
  top,
}: {
  bottom: string;
  className?: string;
  size: number | string;
  top: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-full ${className ?? ""}`}
      style={{
        background: `linear-gradient(180deg, ${top} 0 50%, ${bottom} 50% 100%)`,
        height: size,
        width: size,
      }}
    />
  );
}

export default function AvatarCreatorPage() {
  const [customSwatches, setCustomSwatches] = useState<AvatarSwatch[]>([]);
  const [selectedSwatchId, setSelectedSwatchId] = useState("purple");
  const [showAddPopover, setShowAddPopover] = useState(false);
  const [draftTop, setDraftTop] = useState("#082357");
  const [draftBottom, setDraftBottom] = useState("#334679");
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const allSwatches = useMemo(
    () => [...PRESET_SWATCHES, ...customSwatches],
    [customSwatches],
  );

  const selectedSwatch =
    allSwatches.find((swatch) => swatch.id === selectedSwatchId) ?? allSwatches[0];

  useEffect(() => {
    if (!showAddPopover) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (popoverRef.current?.contains(target) || addButtonRef.current?.contains(target)) {
        return;
      }
      setShowAddPopover(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowAddPopover(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showAddPopover]);

  function handleShuffle() {
    if (allSwatches.length === 0) {
      return;
    }

    const candidates =
      allSwatches.length > 1
        ? allSwatches.filter((swatch) => swatch.id !== selectedSwatchId)
        : allSwatches;
    const randomIndex = Math.floor(Math.random() * candidates.length);
    const nextSwatch = candidates[randomIndex];
    if (!nextSwatch) {
      return;
    }

    setSelectedSwatchId(nextSwatch.id);
    setShowAddPopover(false);
  }

  function handleAddSwatch() {
    const newSwatch: AvatarSwatch = {
      id: `custom-${crypto.randomUUID()}`,
      top: draftTop,
      bottom: draftBottom,
    };

    setCustomSwatches((prev) => [...prev, newSwatch]);
    setSelectedSwatchId(newSwatch.id);
    setShowAddPopover(false);
  }

  return (
    <ComponentShell title="Avatar Creator" codeContent={CODE_CONTENT} promptContent={PROMPT_CONTENT}>
      <div className="w-full max-w-[620px] rounded-[28px] border border-white/80 bg-[#f9fafb] px-5 py-6 shadow-[0_20px_38px_rgba(15,23,42,0.05)] sm:px-9 sm:py-9">
        <h2 className="text-[15px] font-semibold uppercase tracking-[0.05em] text-[#a1a1a1] sm:text-[17px]">
          Avatar Creator
        </h2>

        <div className="mt-6 flex flex-col items-start gap-4 sm:mt-8 sm:flex-row sm:items-center sm:gap-8">
          <SplitCircle
            bottom={selectedSwatch.bottom}
            className="shadow-[0_14px_18px_rgba(15,23,42,0.12)]"
            size="clamp(86px,24vw,104px)"
            top={selectedSwatch.top}
          />
          <button
            className="rounded-full border border-[#dddddf] bg-white px-5 py-[9px] text-[15px] font-medium text-[#666666] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#fdfdfd] sm:px-6 sm:py-[10px] sm:text-[16px]"
            onClick={handleShuffle}
            type="button"
          >
            <span className="inline-flex items-center gap-2 text-[15px] leading-none sm:text-[16px]">
              <span aria-hidden="true" className="text-[15px]">
                🎲
              </span>
              <span>Shuffle</span>
            </span>
          </button>
        </div>

        <div className="relative mt-7 sm:mt-9">
          <div className="grid w-fit grid-cols-4 gap-2.5 sm:max-w-[560px] sm:grid-cols-7 sm:gap-x-[14px] sm:gap-y-[14px]">
            {allSwatches.map((swatch) => {
              const selected = swatch.id === selectedSwatchId;
              return (
                <button
                  aria-label={`Select ${swatch.id} color pair`}
                  className={`relative flex h-[54px] w-[54px] items-center justify-center rounded-full transition-transform hover:-translate-y-0.5 sm:h-[60px] sm:w-[60px] ${
                    selected
                      ? "ring-2 ring-[#b574f0] ring-offset-2 ring-offset-[#f9fafb]"
                      : "ring-1 ring-transparent"
                  }`}
                  key={swatch.id}
                  onClick={() => {
                    setSelectedSwatchId(swatch.id);
                    setShowAddPopover(false);
                  }}
                  type="button"
                >
                  <SplitCircle
                    bottom={swatch.bottom}
                    size="clamp(50px, 14vw, 58px)"
                    top={swatch.top}
                  />
                </button>
              );
            })}

            <button
              aria-label="Add custom avatar colors"
              className="flex h-[54px] w-[54px] items-center justify-center rounded-full border-2 border-dashed border-[#d4d4d6] bg-transparent text-[30px] leading-none text-[#cccccf] transition-colors hover:border-[#bcbcc0] hover:text-[#bcbcc0] sm:h-[60px] sm:w-[60px] sm:text-[34px]"
              onClick={() => setShowAddPopover((prev) => !prev)}
              ref={addButtonRef}
              type="button"
            >
              +
            </button>
          </div>

          {showAddPopover ? (
            <div
              className="absolute left-0 top-full z-20 mt-3 w-[198px] rounded-[16px] bg-white p-4 shadow-[0_14px_30px_rgba(15,23,42,0.14)] sm:left-auto sm:right-1 sm:w-[210px] sm:rounded-[18px] sm:p-5"
              ref={popoverRef}
            >
              <div
                aria-hidden="true"
                className="absolute -top-[7px] right-[96px] hidden h-[14px] w-[14px] rotate-45 rounded-[3px] bg-white sm:block"
              />

              <div className="space-y-4">
                <label className="flex items-center justify-between gap-3">
                  <span className="text-[14px] font-semibold text-[#a3a3a3] sm:text-[15px]">Top</span>
                  <span
                    className="relative h-8 w-[90px] rounded-[2px] border border-[#dddddf]"
                    style={{ backgroundColor: draftTop }}
                  >
                    <input
                      aria-label="Top avatar color"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={(event) => setDraftTop(event.target.value)}
                      type="color"
                      value={draftTop}
                    />
                  </span>
                </label>

                <label className="flex items-center justify-between gap-3">
                  <span className="text-[14px] font-semibold text-[#a3a3a3] sm:text-[15px]">Bottom</span>
                  <span
                    className="relative h-8 w-[90px] rounded-[2px] border border-[#dddddf]"
                    style={{ backgroundColor: draftBottom }}
                  >
                    <input
                      aria-label="Bottom avatar color"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={(event) => setDraftBottom(event.target.value)}
                      type="color"
                      value={draftBottom}
                    />
                  </span>
                </label>
              </div>

              <button
                className="mt-4 w-full rounded-[12px] bg-[#191a1f] py-2.5 text-[16px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-opacity hover:opacity-90 sm:mt-5 sm:py-3 sm:text-[17px]"
                onClick={handleAddSwatch}
                type="button"
              >
                Add
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </ComponentShell>
  );
}
