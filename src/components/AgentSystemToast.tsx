"use client";

import { cn } from "@/lib/utils";

export type AgentSystemToastVariant =
  | "runComplete"
  | "overrideRecommendation"
  | "agentPaused"
  | "deleteAgent";

type HeaderTone = {
  dark: string;
  light: string;
  title: string;
};

const headerToneMap: Record<AgentSystemToastVariant, HeaderTone> = {
  runComplete: {
    dark: "#006A17",
    light: "#C7EBCF",
    title: "#005D15",
  },
  overrideRecommendation: {
    dark: "#A67700",
    light: "#EFE5BE",
    title: "#996800",
  },
  agentPaused: {
    dark: "#0B3D82",
    light: "#BCD3EE",
    title: "#0B3E86",
  },
  deleteAgent: {
    dark: "#ED1000",
    light: "#F3D7DA",
    title: "#6B1010",
  },
};

function CloseButton() {
  return (
    <button
      type="button"
      aria-label="Close toast"
      className="absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-full bg-[#ebebed] text-[#1d1d1f] transition-colors hover:bg-[#e3e3e6] sm:right-4 sm:top-4 sm:size-12 md:size-16"
    >
      <svg
        aria-hidden="true"
        className="size-5 sm:size-7 md:size-10"
        viewBox="0 0 24 24"
      >
        <path
          d="M4 4L20 20M20 4L4 20"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.9"
        />
      </svg>
    </button>
  );
}

function HeaderIcon({ variant }: { variant: AgentSystemToastVariant }) {
  if (variant === "runComplete") {
    return (
      <svg aria-hidden="true" className="size-[clamp(16px,2.8vw,40px)]" viewBox="0 0 24 24">
        <path
          d="M3.5 12.5L9 18L20.5 6.5"
          fill="none"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
        />
      </svg>
    );
  }

  if (variant === "overrideRecommendation") {
    return (
      <svg aria-hidden="true" className="size-[clamp(16px,2.8vw,40px)]" viewBox="0 0 24 24">
        <path
          d="M12 2.5L21.5 12L12 21.5L2.5 12L12 2.5Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.9"
        />
        <path d="M12 7.2V13.2" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="1.9" />
        <circle cx="12" cy="16.6" fill="#ffffff" r="1.2" />
      </svg>
    );
  }

  if (variant === "agentPaused") {
    return (
      <svg aria-hidden="true" className="size-[clamp(16px,2.8vw,40px)]" viewBox="0 0 24 24">
        <rect x="6.6" y="5.3" width="4.2" height="13.4" rx="1.1" fill="none" stroke="#BBD2EF" strokeWidth="1.7" />
        <rect x="13.2" y="5.3" width="4.2" height="13.4" rx="1.1" fill="none" stroke="#BBD2EF" strokeWidth="1.7" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-[clamp(16px,2.8vw,40px)]" viewBox="0 0 24 24">
      <path d="M12 4L21 20H3L12 4Z" fill="none" stroke="#ffffff" strokeLinejoin="round" strokeWidth="2" />
      <path d="M12 9V14" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="2" />
      <circle cx="12" cy="17.2" fill="#ffffff" r="1.2" />
    </svg>
  );
}

function HeaderBadge({
  variant,
  title,
  width,
}: {
  variant: AgentSystemToastVariant;
  title: string;
  width: number;
}) {
  const tone = headerToneMap[variant];

  return (
    <div
      className="inline-flex h-[clamp(40px,7.2vw,94px)] max-w-full overflow-hidden"
      style={{ width: `min(100%, ${width}px)` }}
    >
      <div
        className="flex w-[clamp(46px,8.2vw,102px)] shrink-0 items-center justify-center"
        style={{ backgroundColor: tone.dark }}
      >
        <HeaderIcon variant={variant} />
      </div>
      <div
        className="flex min-w-0 flex-1 items-center px-[clamp(10px,2.4vw,34px)]"
        style={{ backgroundColor: tone.light }}
      >
        <p
          className="font-pixel truncate text-[clamp(14px,2.3vw,30px)] leading-none tracking-[0.045em]"
          style={{ color: tone.title }}
        >
          {title}
        </p>
      </div>
    </div>
  );
}

function ToastShell({ children }: { children: React.ReactNode }) {
  return (
    <article className="relative w-full max-w-[860px] rounded-[20px] border border-[#d6d6da] bg-[#f2f2f4] px-4 pb-5 pt-5 shadow-[0_10px_28px_rgba(0,0,0,0.14)] sm:rounded-[24px] sm:px-6 sm:pb-7 sm:pt-6 md:rounded-[28px] md:px-8 md:pb-8 md:pt-6.5">
      <CloseButton />
      {children}
    </article>
  );
}

function MainBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 space-y-4 text-[clamp(14px,2.1vw,24px)] font-normal leading-[1.2] tracking-[-0.01em] text-[#1f2024] sm:mt-6 sm:space-y-5 md:space-y-6">
      {children}
    </div>
  );
}

function ActionButton({
  children,
  variant = "ghost",
}: {
  children: React.ReactNode;
  variant?: "ghost" | "dark" | "danger";
}) {
  return (
    <button
      type="button"
      className={cn(
        "font-pixel inline-flex h-[clamp(42px,6vw,58px)] w-full items-center justify-center rounded-[clamp(12px,2vw,20px)] px-4 text-[clamp(13px,2vw,22px)] uppercase tracking-[0.06em] transition-opacity hover:opacity-95",
        variant === "ghost" && "border border-[#d1d2d6] bg-[#f3f3f4] text-[#22242a]",
        variant === "dark" && "bg-black text-white",
        variant === "danger" && "bg-[#EA0C00] text-white",
      )}
    >
      {children}
    </button>
  );
}

function RunCompleteToast() {
  return (
    <ToastShell>
      <HeaderBadge variant="runComplete" title="RUN COMPLETE" width={540} />

      <MainBody>
        <p>
          The agent finished processing 847 records
          <br className="hidden sm:block" />
          from &quot;Q1 Sale Data.csv.&quot;
        </p>

        <p>
          <strong>3 rows were skipped,</strong> mismatched column
          <br className="hidden sm:block" />
          headers.
        </p>

        <p>A report was saved to /outputs.</p>
      </MainBody>
    </ToastShell>
  );
}

function OverrideRecommendationToast() {
  return (
    <ToastShell>
      <HeaderBadge variant="overrideRecommendation" title="OVERRIDE RECOMMENDATION?" width={900} />

      <MainBody>
        <p>
          The agent recommended pausing the
          <br className="hidden sm:block" />
          *Ad Campaign* due to low CTR (0.3%).
        </p>

        <p>
          You&apos;re about to resume it.
          <br className="hidden sm:block" />
          The agent will continue spending ~$140/day.
        </p>
      </MainBody>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-6">
        <ActionButton variant="ghost">Keep Paused</ActionButton>
        <ActionButton variant="dark">Resume Anyway</ActionButton>
      </div>
    </ToastShell>
  );
}

function AgentPausedToast() {
  return (
    <ToastShell>
      <HeaderBadge variant="agentPaused" title="AGENT PAUSED" width={520} />

      <MainBody>
        <p>
          The *Email Responder* agent paused after
          <br className="hidden sm:block" />
          detecting an unusual reply pattern.
        </p>

        <p>
          It sent <strong>14 responses before stopping.</strong>
          <br className="hidden sm:block" />
          No further emails will be sent until you
          <br className="hidden sm:block" />
          resume.
        </p>
      </MainBody>

      <div className="mt-6 sm:mt-8">
        <ActionButton variant="dark">Resume Agent</ActionButton>
      </div>
    </ToastShell>
  );
}

function DeleteAgentToast() {
  return (
    <ToastShell>
      <HeaderBadge variant="deleteAgent" title="DELETE AGENT?" width={520} />

      <MainBody>
        <p>
          Deleting *Weekly Digest* will permanently
          <br className="hidden sm:block" />
          delete everything. This cannot be undone.
        </p>

        <p>
          Type <strong>“Weekly Digest”</strong> to confirm:
        </p>
      </MainBody>

      <div className="mt-6 sm:mt-7">
        <input
          type="text"
          value="Weekly Digest"
          readOnly
          aria-label="Agent name confirmation"
          className="h-[clamp(42px,6.2vw,58px)] w-full rounded-[clamp(12px,2vw,20px)] border border-[#cfd0d4] bg-[#f3f3f4] px-4 text-[clamp(14px,2.1vw,26px)] leading-none text-[#1e1f23] outline-none"
        />
      </div>

      <div className="mt-6 sm:mt-7">
        <ActionButton variant="danger">Delete Agent</ActionButton>
      </div>
    </ToastShell>
  );
}

export function AgentSystemToast({
  variant,
  className,
}: {
  variant: AgentSystemToastVariant;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      {variant === "runComplete" ? <RunCompleteToast /> : null}
      {variant === "overrideRecommendation" ? <OverrideRecommendationToast /> : null}
      {variant === "agentPaused" ? <AgentPausedToast /> : null}
      {variant === "deleteAgent" ? <DeleteAgentToast /> : null}
    </div>
  );
}
