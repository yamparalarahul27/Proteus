"use client";

import { AnimatedSwapFlow } from "@/components/AnimatedSwapFlow";
import ComponentShell from "@/components/ComponentShell";

const CODE_CONTENT = `// AnimatedSwapFlow component
// See @/components/AnimatedSwapFlow for full implementation`;

const PROMPT_CONTENT = `Create an animated swap flow component that visualizes a token swap interaction with smooth transitions and animations.`;

export default function SwapFlowPage() {
  return (
    <ComponentShell title="Swap Flow" codeContent={CODE_CONTENT} promptContent={PROMPT_CONTENT}>
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-5xl items-center justify-center">
        <AnimatedSwapFlow />
      </div>
    </ComponentShell>
  );
}
