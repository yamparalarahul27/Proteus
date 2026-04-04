"use client";

import { Brain, Thermometer, Volume2, WalletMinimal } from "lucide-react";
import { cn } from "@/lib/utils";

type Stage = {
  id: string;
  label: string;
  value: number;
  highlightPrefix?: string;
};

const stages: Stage[] = [
  { id: "awakening", label: "AWAKENING", value: 0 },
  { id: "priming", label: "PRIMING", value: 10 },
  { id: "thinking", label: "THINKING", value: 50, highlightPrefix: "THINK" },
  { id: "delivering", label: "DELIVERING", value: 90 },
];

function DottedProgress({ value }: { value: number }) {
  return (
    <div className="relative h-[clamp(12px,2.1vw,28px)] w-full overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(220,220,224,0.95) 1.8px, transparent 1.8px)",
          backgroundSize: "8px 8px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 bg-[#17181b]"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function StageRow({ stage }: { stage: Stage }) {
  const prefix = stage.highlightPrefix ?? "";
  const suffix = prefix ? stage.label.slice(prefix.length) : "";

  return (
    <div className="grid gap-2 sm:grid-cols-[minmax(190px,1fr)_minmax(200px,2fr)_62px] sm:items-center sm:gap-4 md:gap-6">
      <div className="flex items-center justify-between gap-3 text-[#727378] sm:justify-start">
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <Brain className="size-[clamp(18px,3.1vw,30px)]" strokeWidth={1.8} />
          <p className="font-pixel text-[clamp(18px,2.9vw,34px)] leading-none tracking-[0.04em]">
            {prefix ? (
              <>
                <span className="text-[#1f2024]">{prefix}</span>
                <span className="text-[#b4b5ba]">{suffix}</span>
              </>
            ) : (
              stage.label
            )}
          </p>
        </div>

        <p className="font-pixel text-[clamp(18px,3vw,30px)] leading-none tracking-[0.04em] text-[#6f7076] sm:hidden">
          {stage.value}%
        </p>
      </div>

      <DottedProgress value={stage.value} />

      <p className="font-pixel hidden text-right text-[clamp(18px,3vw,34px)] leading-none tracking-[0.04em] text-[#6f7076] sm:block">
        {stage.value}%
      </p>
    </div>
  );
}

function ControlCard({
  icon,
  title,
  badge,
  badgeTone = "green",
  children,
}: {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  badgeTone?: "green" | "amber";
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-[16px] bg-[#efeff1] px-4 py-4 sm:rounded-[18px] sm:px-5 sm:py-4.5">
      <header className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex min-w-0 items-center gap-2.5 text-[#8a8b90]">
          {icon}
          <p className="font-pixel text-[clamp(14px,2.3vw,20px)] uppercase tracking-[0.05em]">
            {title}
          </p>
        </div>
        {badge ? (
          <span
            className={cn(
              "rounded-[8px] border px-2 py-1 text-[clamp(12px,2vw,16px)] leading-none",
              badgeTone === "green"
                ? "border-[#b7dfbc] bg-[#d2efd4] text-[#357848]"
                : "border-[#dbcfa6] bg-[#efe1ba] text-[#7c6327]",
            )}
          >
            {badge}
          </span>
        ) : null}
      </header>

      <div className="mt-5">{children}</div>
    </article>
  );
}

function VestingCard() {
  const totalMonths = 24;
  const unlocked = 12;

  return (
    <ControlCard
      icon={<WalletMinimal size={20} strokeWidth={1.8} />}
      title="VESTING"
      badge="Cliff passed"
    >
      <div className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-1">
        {Array.from({ length: totalMonths }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-5 rounded-[1px] sm:h-6",
              index < unlocked ? "bg-[#16893b]" : "bg-[#e2e2e5]",
            )}
          />
        ))}
      </div>

      <p className="font-pixel mt-3 text-[clamp(14px,2.2vw,20px)] leading-none tracking-[0.05em] text-[#3f4146]">
        12 OF 24 MONTHS
      </p>
      <p className="font-pixel mt-1 text-[clamp(13px,2vw,18px)] leading-none tracking-[0.05em] text-[#808187]">
        2.5% RSA
      </p>
    </ControlCard>
  );
}

function VolumeCard() {
  return (
    <ControlCard icon={<Volume2 size={20} strokeWidth={1.8} />} title="VOLUME">
      <div className="h-8 overflow-hidden rounded-[10px] border border-[#dedee1] bg-[#f3f3f5] sm:h-9 sm:rounded-[11px]">
        <div className="grid h-full grid-cols-[1fr_minmax(88px,126px)]">
          <div className="relative bg-[#d1d1d4]">
            <span
              aria-hidden="true"
              className="absolute right-0 top-1/2 h-5 w-[2px] -translate-y-1/2 bg-[#a8a9ae] sm:h-6"
            />
          </div>
          <div className="flex items-center justify-center bg-[#f2f2f4]">
            <span className="font-pixel text-[clamp(13px,2vw,18px)] leading-none tracking-[0.05em] text-[#4a4b50]">
              60%
            </span>
          </div>
        </div>
      </div>
    </ControlCard>
  );
}

function TemperatureCard() {
  const value = 0.3;
  const midpoint = 0.5;

  return (
    <ControlCard
      icon={<Thermometer size={20} strokeWidth={1.8} />}
      title="AGENT TEMPERATURE"
      badge="Medium (0.3)"
      badgeTone="amber"
    >
      <div className="font-pixel mb-2.5 flex items-center justify-between text-[clamp(12px,1.9vw,16px)] leading-none tracking-[0.05em] text-[#6e7076]">
        <span>0</span>
        <span>0.5</span>
        <span>1</span>
      </div>

      <div className="relative h-10 overflow-hidden rounded-[10px] border border-[#dedee1] bg-[#f3f3f5] sm:h-11 sm:rounded-[11px]">
        <div className="h-full rounded-[12px] bg-[#d1d1d4]" style={{ width: `${value * 100}%` }} />
        <span
          aria-hidden="true"
          className="absolute top-1/2 h-6 w-[2px] -translate-y-1/2 bg-[#d9d9dc] sm:h-7"
          style={{ left: `calc(${midpoint * 100}% - 1px)` }}
        />
      </div>

      <p className="font-pixel mt-4 text-[clamp(11px,1.7vw,16px)] leading-[1.3] tracking-[0.05em] text-[#73757b]">
        CONTROLS HOW RANDOM VS.
        <br />
        DETERMINISTIC AGENT&apos;S OUTPUTS ARE
        <br />
        DURING SAMPLING.
      </p>
    </ControlCard>
  );
}

export function AgentThinkingStagesPanel({ className }: { className?: string }) {
  return (
    <section className={cn("w-full rounded-[20px] bg-[#f2f2f4] p-4 sm:rounded-[24px] sm:p-6 md:p-8", className)}>
      <div className="space-y-4 sm:space-y-6 md:space-y-7">
        {stages.map((stage) => (
          <StageRow key={stage.id} stage={stage} />
        ))}
      </div>
    </section>
  );
}

export function AgentControlCardsPanel({ className }: { className?: string }) {
  return (
    <section className={cn("w-full max-w-[420px] rounded-[20px] bg-[#f5f5f6] p-3.5 sm:p-4", className)}>
      <div className="space-y-4">
        <VestingCard />
        <VolumeCard />
        <TemperatureCard />
      </div>
    </section>
  );
}
