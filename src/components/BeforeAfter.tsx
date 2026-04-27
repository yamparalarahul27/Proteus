"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface BeforeAfterProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  width?: number | string;
  aspectRatio?: string;
  initialPosition?: number;
}

export default function BeforeAfter({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  width = "100%",
  aspectRatio = "16/10",
  initialPosition = 50,
}: BeforeAfterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const updatePosition = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setPosition(pct);
    },
    [],
  );

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: PointerEvent) => {
      e.preventDefault();
      updatePosition(e.clientX);
    };
    const onUp = () => setIsDragging(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [isDragging, updatePosition]);

  return (
    <div
      ref={containerRef}
      className="group relative select-none overflow-hidden rounded-xl"
      style={{
        width,
        aspectRatio,
        cursor: isDragging ? "ew-resize" : "default",
        touchAction: "none",
      }}
      onPointerDown={(e) => {
        setIsDragging(true);
        updatePosition(e.clientX);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* After image (full, bottom layer) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={after}
        alt={afterLabel}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Before image (clipped, top layer) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={before}
          alt={beforeLabel}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ width: containerRef.current?.offsetWidth ?? "100%" }}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 z-10"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        {/* Line */}
        <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-white shadow-[0_0_8px_rgba(0,0,0,0.3)]" />

        {/* Handle */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
          style={{ transform: `translate(-50%, -50%) scale(${isDragging || isHovered ? 1.1 : 1})` }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white/20 shadow-lg backdrop-blur-md">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 3L3 8.5L8 14" />
              <path d="M16 3L21 8.5L16 14" />
            </svg>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div
        className="absolute left-3 top-3 z-20 transition-opacity duration-300"
        style={{ opacity: isHovered || isDragging ? 1 : 0 }}
      >
        <span className="rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
          {beforeLabel}
        </span>
      </div>
      <div
        className="absolute right-3 top-3 z-20 transition-opacity duration-300"
        style={{ opacity: isHovered || isDragging ? 1 : 0 }}
      >
        <span className="rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
          {afterLabel}
        </span>
      </div>
    </div>
  );
}
