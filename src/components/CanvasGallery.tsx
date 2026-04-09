"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image as DreiImage, useCursor } from "@react-three/drei";
import * as THREE from "three";
import { X, ExternalLink, MapPin, Calendar, Camera } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  description?: string;
  location?: string;
  date?: string;
  tags?: string[];
}

interface CanvasGalleryProps {
  items: GalleryItem[];
  columns?: number;
  gap?: number;
  itemWidth?: number;
  itemHeight?: number;
}

/* ------------------------------------------------------------------ */
/*  Rig – camera pan / zoom with inertia                               */
/* ------------------------------------------------------------------ */

function Rig({
  selectedPosition,
  isSelected,
}: {
  selectedPosition: THREE.Vector3 | null;
  isSelected: boolean;
}) {
  const { camera } = useThree();
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0, z: 8 });
  const lockedTarget = useRef<{ x: number; y: number; z: number } | null>(null);

  // When an item is selected, lock camera target to it
  useEffect(() => {
    if (isSelected && selectedPosition) {
      lockedTarget.current = {
        x: selectedPosition.x - 1.2, // offset to leave room for side panel
        y: selectedPosition.y,
        z: 5.5,
      };
    } else {
      lockedTarget.current = null;
    }
  }, [isSelected, selectedPosition]);

  useEffect(() => {
    const el = document.getElementById("canvas-gallery-container");
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      if (isSelected) return;
      isDragging.current = true;
      previousMouse.current = { x: e.clientX, y: e.clientY };
      velocity.current = { x: 0, y: 0 };
      el.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = (e.clientX - previousMouse.current.x) * 0.01;
      const dy = (e.clientY - previousMouse.current.y) * 0.01;
      velocity.current = { x: -dx, y: dy };
      target.current.x += -dx;
      target.current.y += dy;
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = () => {
      isDragging.current = false;
      el.style.cursor = isSelected ? "default" : "grab";
    };
    const onWheel = (e: WheelEvent) => {
      if (isSelected) return;
      e.preventDefault();
      target.current.z = THREE.MathUtils.clamp(
        target.current.z + e.deltaY * 0.005,
        3,
        14
      );
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointerleave", onPointerUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointerleave", onPointerUp);
      el.removeEventListener("wheel", onWheel);
    };
  }, [isSelected]);

  useFrame(() => {
    const t = lockedTarget.current ?? target.current;
    const lerpSpeed = lockedTarget.current ? 0.06 : 0.1;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, t.x, lerpSpeed);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, t.y, lerpSpeed);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, t.z, lerpSpeed);

    // Inertia when not dragging and not locked
    if (!isDragging.current && !lockedTarget.current) {
      velocity.current.x *= 0.95;
      velocity.current.y *= 0.95;
      target.current.x += velocity.current.x;
      target.current.y += velocity.current.y;
    }
  });

  return null;
}

/* ------------------------------------------------------------------ */
/*  ImageCard – individual 3D plane                                    */
/* ------------------------------------------------------------------ */

function ImageCard({
  item,
  position,
  width,
  height,
  isSelected,
  onSelect,
}: {
  item: GalleryItem;
  position: [number, number, number];
  width: number;
  height: number;
  isSelected: boolean;
  onSelect: (item: GalleryItem, pos: THREE.Vector3) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  // Animate scale on hover and selection
  useFrame(() => {
    if (!meshRef.current) return;
    const targetScale = isSelected ? 1.08 : hovered ? 1.04 : 1;
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1);

    // Subtle z-lift on hover
    const targetZ = isSelected ? 0.3 : hovered ? 0.15 : 0;
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item, new THREE.Vector3(...position));
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <DreiImage
        url={item.image}
        scale={[width, height]}
        transparent
        toneMapped={false}
      />

      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[width + 0.12, height + 0.12]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Grid – lays out all images                                         */
/* ------------------------------------------------------------------ */

function Grid({
  items,
  columns,
  gap,
  itemWidth,
  itemHeight,
  selectedId,
  onSelect,
}: {
  items: GalleryItem[];
  columns: number;
  gap: number;
  itemWidth: number;
  itemHeight: number;
  selectedId: string | null;
  onSelect: (item: GalleryItem, pos: THREE.Vector3) => void;
}) {
  const positions = useMemo(() => {
    const totalW = columns * itemWidth + (columns - 1) * gap;
    const offsetX = -totalW / 2 + itemWidth / 2;
    return items.map((_, i) => {
      const col = i % columns;
      const row = Math.floor(i / columns);
      const x = offsetX + col * (itemWidth + gap);
      const y = -(row * (itemHeight + gap));
      return [x, y, 0] as [number, number, number];
    });
  }, [items, columns, gap, itemWidth, itemHeight]);

  return (
    <group>
      {items.map((item, i) => (
        <ImageCard
          key={item.id}
          item={item}
          position={positions[i]}
          width={itemWidth}
          height={itemHeight}
          isSelected={selectedId === item.id}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Side Panel (HTML overlay)                                          */
/* ------------------------------------------------------------------ */

function SidePanel({
  item,
  onClose,
  isDark,
}: {
  item: GalleryItem | null;
  onClose: () => void;
  isDark: boolean;
}) {
  const isOpen = item !== null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className={`
        pointer-events-none fixed inset-y-0 right-0 z-50 flex w-full sm:w-[380px]
        transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <div
        className={`
          pointer-events-auto relative flex h-full w-full flex-col overflow-y-auto
          border-l backdrop-blur-2xl
          ${isDark
            ? "border-white/10 bg-[#0f1117]/90 text-white"
            : "border-gray-200 bg-white/90 text-gray-900"
          }
        `}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`
            absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full
            transition-colors
            ${isDark
              ? "bg-white/10 hover:bg-white/20 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }
          `}
        >
          <X size={18} />
        </button>

        {item && (
          <>
            {/* Image preview */}
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover"
              />
              <div
                className={`absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t ${
                  isDark ? "from-[#0f1117]/90" : "from-white/90"
                } to-transparent`}
              />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-5 p-6">
              <div>
                <h2 className="text-xl font-bold leading-tight">{item.title}</h2>
                {item.description && (
                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {item.description}
                  </p>
                )}
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-2.5">
                {item.location && (
                  <div className="flex items-center gap-2.5">
                    <MapPin
                      size={15}
                      className={isDark ? "text-gray-500" : "text-gray-400"}
                    />
                    <span
                      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                    >
                      {item.location}
                    </span>
                  </div>
                )}
                {item.date && (
                  <div className="flex items-center gap-2.5">
                    <Calendar
                      size={15}
                      className={isDark ? "text-gray-500" : "text-gray-400"}
                    />
                    <span
                      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                    >
                      {item.date}
                    </span>
                  </div>
                )}
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium
                          ${isDark
                            ? "bg-white/10 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                          }
                        `}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Open full button */}
              <button
                className={`
                  mt-auto flex items-center justify-center gap-2 rounded-xl px-4 py-3
                  text-sm font-medium transition-colors
                  ${isDark
                    ? "bg-white/10 hover:bg-white/15 text-white"
                    : "bg-gray-900 hover:bg-gray-800 text-white"
                  }
                `}
              >
                <ExternalLink size={15} />
                View Full Size
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Minimap overlay                                                    */
/* ------------------------------------------------------------------ */

function Minimap({
  items,
  columns,
  gap,
  itemWidth,
  itemHeight,
  selectedId,
  isDark,
}: {
  items: GalleryItem[];
  columns: number;
  gap: number;
  itemWidth: number;
  itemHeight: number;
  selectedId: string | null;
  isDark: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dotSize = 4;
    const dotGap = 3;
    const mapW = columns * (dotSize + dotGap) - dotGap;
    const rows = Math.ceil(items.length / columns);
    const mapH = rows * (dotSize + dotGap) - dotGap;

    canvas.width = mapW + 8;
    canvas.height = mapH + 8;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    items.forEach((item, i) => {
      const col = i % columns;
      const row = Math.floor(i / columns);
      const x = 4 + col * (dotSize + dotGap);
      const y = 4 + row * (dotSize + dotGap);

      const isActive = item.id === selectedId;
      ctx.fillStyle = isActive
        ? "#6366f1"
        : isDark
          ? "rgba(255,255,255,0.25)"
          : "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.roundRect(x, y, dotSize, dotSize, 1);
      ctx.fill();

      if (isActive) {
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x - 2, y - 2, dotSize + 4, dotSize + 4, 2);
        ctx.stroke();
      }
    });
  }, [items, columns, selectedId, isDark, gap, itemWidth, itemHeight]);

  return (
    <canvas
      ref={canvasRef}
      className={`
        fixed bottom-5 left-5 z-40 rounded-lg border p-1
        ${isDark
          ? "border-white/10 bg-[#0f1117]/80"
          : "border-gray-200 bg-white/80"
        }
        backdrop-blur-md
      `}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  HUD overlay                                                        */
/* ------------------------------------------------------------------ */

function HUD({ isDark, itemCount }: { isDark: boolean; itemCount: number }) {
  return (
    <div
      className={`
        fixed left-5 top-[72px] z-40 flex items-center gap-2 rounded-lg border px-3 py-1.5
        text-xs font-medium backdrop-blur-md
        ${isDark
          ? "border-white/10 bg-[#0f1117]/80 text-gray-400"
          : "border-gray-200 bg-white/80 text-gray-500"
        }
      `}
    >
      <Camera size={13} />
      <span>{itemCount} items</span>
      <span className="mx-1 opacity-30">|</span>
      <span>Drag to pan &middot; Scroll to zoom</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export default function CanvasGallery({
  items,
  columns = 5,
  gap = 0.3,
  itemWidth = 2,
  itemHeight = 1.4,
}: CanvasGalleryProps) {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [selectedPos, setSelectedPos] = useState<THREE.Vector3 | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Read theme from parent ComponentShell
  useEffect(() => {
    const checkTheme = () => {
      const stored = window.localStorage.getItem("proteus-shell-theme");
      setIsDark(stored === "dark");
    };
    checkTheme();
    const interval = setInterval(checkTheme, 500);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = useCallback((item: GalleryItem, pos: THREE.Vector3) => {
    setSelected((prev) => (prev?.id === item.id ? null : item));
    setSelectedPos(pos);
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
    setSelectedPos(null);
  }, []);

  return (
    <div className="relative h-full w-full">
      <div
        id="canvas-gallery-container"
        className="h-full w-full"
        style={{ cursor: selected ? "default" : "grab" }}
      >
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Rig
            selectedPosition={selectedPos}
            isSelected={selected !== null}
          />
          <Grid
            items={items}
            columns={columns}
            gap={gap}
            itemWidth={itemWidth}
            itemHeight={itemHeight}
            selectedId={selected?.id ?? null}
            onSelect={handleSelect}
          />
          <ambientLight intensity={1.5} />
        </Canvas>
      </div>

      {/* Overlays */}
      <HUD isDark={isDark} itemCount={items.length} />
      <Minimap
        items={items}
        columns={columns}
        gap={gap}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
        selectedId={selected?.id ?? null}
        isDark={isDark}
      />
      <SidePanel item={selected} onClose={handleClose} isDark={isDark} />
    </div>
  );
}
