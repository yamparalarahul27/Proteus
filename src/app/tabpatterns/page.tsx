"use client";

import ComponentShell from "@/components/ComponentShell";
import TabPatternsShowcase from "@/components/TabPatternsShowcase";

const CODE_CONTENT = `"use client";

import { Mail, MessageSquareText, Radio, Send } from "lucide-react";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TabItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  dot?: boolean;
  warning?: boolean;
};

function WarningTriangle() {
  return (
    <svg aria-hidden="true" className="size-3.5" viewBox="0 0 20 20">
      <path d="M10 2.2L19 17.5H1L10 2.2Z" fill="#EA1608" />
      <rect x="9" y="6.9" width="2" height="6.4" rx="1" fill="#fff" />
      <circle cx="10" cy="15.2" r="1.1" fill="#fff" />
    </svg>
  );
}

function OutlinePillTabs({
  items,
  value,
  onChange,
}: {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1.5 sm:gap-2.5" role="tablist">
      {items.map((item) => {
        const selected = value === item.id;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.id)}
            className={cn(
              "font-pixel inline-flex h-10 items-center justify-center rounded-full px-4 text-[15px] uppercase transition-colors sm:h-12 sm:px-5 sm:text-[17px]",
              selected
                ? "border-2 border-[#2a2b2f] text-[#2a2b2f]"
                : "border-2 border-transparent text-[#7f8085]",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function SegmentedTabs({
  items,
  value,
  onChange,
  compact = false,
}: {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center rounded-full bg-[#e9e9eb] p-1",
        compact ? "gap-0.5" : "gap-1",
      )}
      role="tablist"
    >
      {items.map((item) => {
        const selected = value === item.id;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.id)}
            className={cn(
              "font-pixel inline-flex items-center justify-center gap-1.5 rounded-full px-3 text-[14px] uppercase transition-all sm:px-4 sm:text-[16px]",
              compact ? "h-8 sm:h-9" : "h-10 sm:h-11",
              selected
                ? "bg-[#f7f7f8] text-[#2f3034] shadow-[0_1px_0_rgba(255,255,255,0.8),0_1px_3px_rgba(0,0,0,0.09)]"
                : "text-[#88898f]",
            )}
          >
            {item.icon ? <span className="text-[#a0a1a7]">{item.icon}</span> : null}
            <span>{item.label}</span>
            {item.warning ? <WarningTriangle /> : null}
            {item.dot ? (
              <span
                aria-hidden="true"
                className="ml-1 inline-block size-[9px] rounded-full bg-[#E92312]"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function UnderlineTabs({
  items,
  value,
  onChange,
}: {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="inline-flex max-w-full items-center gap-6 sm:gap-7" role="tablist">
      {items.map((item) => {
        const selected = value === item.id;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(item.id)}
            className={cn(
              "font-pixel inline-flex h-10 items-center gap-2 border-b-2 pb-1 text-[14px] uppercase transition-colors sm:h-11 sm:text-[16px]",
              selected
                ? "border-[#2a2b2f] text-[#2a2b2f]"
                : "border-transparent text-[#7f8086]",
            )}
          >
            {item.icon ? <span className="text-[#a0a1a7]">{item.icon}</span> : null}
            <span>{item.label}</span>
            {item.dot ? (
              <span
                aria-hidden="true"
                className="ml-1 inline-block size-[9px] rounded-full bg-[#E92312]"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export default function TabPatternsShowcase() {
  const [mode, setMode] = useState("design");
  const [logTab, setLogTab] = useState("call-logs");
  const [planTab, setPlanTab] = useState("plan");
  const [statusTab, setStatusTab] = useState("pending");
  const [channelTab, setChannelTab] = useState("voice");
  const [billingTab, setBillingTab] = useState("billing");
  const [severityTab, setSeverityTab] = useState("low");
  const [autonomyTab, setAutonomyTab] = useState("observe");

  const modeItems: TabItem[] = [
    { id: "design", label: "Design" },
    { id: "deploy", label: "Deploy" },
  ];

  const logItems: TabItem[] = [
    { id: "call-logs", label: "Call Logs" },
    { id: "chats", label: "Chats", warning: true },
    { id: "workflows", label: "Workflows" },
  ];

  const planItems: TabItem[] = [
    { id: "plan", label: "Plan" },
    { id: "execute", label: "Execute" },
  ];

  const statusItems: TabItem[] = [
    { id: "pending", label: "Pending" },
    { id: "complete", label: "Complete" },
    { id: "failed", label: "Failed", dot: true },
  ];

  const channelItems: TabItem[] = [
    { id: "voice", label: "Voice", icon: <Radio size={14} strokeWidth={1.7} /> },
    { id: "chat", label: "Chat", icon: <MessageSquareText size={14} strokeWidth={1.7} /> },
    { id: "email", label: "Email", icon: <Mail size={14} strokeWidth={1.7} /> },
    { id: "sms", label: "SMS", icon: <Send size={14} strokeWidth={1.7} /> },
  ];

  const billingItems: TabItem[] = [
    { id: "billing", label: "Billing" },
    { id: "invoices", label: "Invoices" },
  ];

  const severityItems: TabItem[] = [
    { id: "low", label: "Low" },
    { id: "normal", label: "Normal" },
    { id: "critical", label: "Critical" },
  ];

  const autonomyItems: TabItem[] = [
    { id: "observe", label: "Observe" },
    { id: "suggest", label: "Suggest" },
    { id: "copilot", label: "Co-Pilot" },
    { id: "autonomous", label: "Autonomous" },
  ];

  return (
    <div className="w-full max-w-[560px] space-y-4">
      <section className="w-full max-w-[560px] rounded-[20px] bg-[#f4f4f5] p-4 text-[#1f2024] sm:rounded-[24px] sm:p-7">
        <p className="text-[clamp(16px,2.3vw,24px)] leading-[1.25] text-[#6f7076]">
          Good for Modes/Personas.
        </p>

        <div className="mt-4 overflow-x-auto pb-1 hide-scrollbar">
          <OutlinePillTabs items={modeItems} value={mode} onChange={setMode} />
        </div>

        <div className="mt-5 overflow-x-auto pb-1 hide-scrollbar">
          <SegmentedTabs items={logItems} value={logTab} onChange={setLogTab} />
        </div>

        <p className="mt-9 text-[clamp(16px,2.4vw,28px)] leading-[1.28] text-[#6f7076] sm:mt-12">
          Good for Primary Sections.
          <br />
          Use larger labels where the tab changes the whole working mode.
        </p>

        <div className="mt-6 overflow-x-auto pb-1 hide-scrollbar">
          <UnderlineTabs items={planItems} value={planTab} onChange={setPlanTab} />
        </div>

        <div className="mt-4 overflow-x-auto pb-1 hide-scrollbar">
          <UnderlineTabs items={statusItems} value={statusTab} onChange={setStatusTab} />
        </div>

        <div className="mt-4 overflow-x-auto pb-1 hide-scrollbar">
          <UnderlineTabs items={channelItems} value={channelTab} onChange={setChannelTab} />
        </div>

        <p className="mt-9 text-[clamp(16px,2.4vw,28px)] leading-[1.28] text-[#6f7076] sm:mt-12">
          Use small tabs for lightweight filters
          <br />
          where the risk of mis tap is low and the choice is reversible.
        </p>

        <div className="mt-5 space-y-4">
          <div className="overflow-x-auto pb-1 hide-scrollbar">
            <SegmentedTabs compact items={billingItems} value={billingTab} onChange={setBillingTab} />
          </div>
          <div className="overflow-x-auto pb-1 hide-scrollbar">
            <SegmentedTabs compact items={severityItems} value={severityTab} onChange={setSeverityTab} />
          </div>
          <div className="overflow-x-auto pb-1 hide-scrollbar">
            <SegmentedTabs compact items={autonomyItems} value={autonomyTab} onChange={setAutonomyTab} />
          </div>
        </div>
      </section>
      <p className="text-center text-xs text-[#6b7280] sm:text-sm">
        Credit:{" "}
        <a
          href="https://30kstrategy.com/about"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#374151]"
        >
          Alex (30kstrategy)
        </a>
      </p>
    </div>
  );
}`;

const PROMPT_CONTENT = `Create a set of tab components matching these patterns: mode/persona pill tabs, segmented tabs with warning badges, primary underline tabs with icons, and small filter segmented tabs. Keep the style neutral light-gray with pixel-like uppercase labels.`;

export default function TabPatternsPage() {
  return (
    <ComponentShell
      title="Tab Patterns"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="w-full max-w-[560px] space-y-4">
        <TabPatternsShowcase />
        <p className="text-center text-xs text-[#6b7280] sm:text-sm">
          Credit:{" "}
          <a
            href="https://30kstrategy.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#374151]"
          >
            Alex (30kstrategy)
          </a>
        </p>
      </div>
    </ComponentShell>
  );
}
