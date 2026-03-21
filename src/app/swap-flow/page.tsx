import { AnimatedSwapFlow } from "@/components/AnimatedSwapFlow";

export default function SwapFlowPage() {
  return (
    <main className="min-h-dvh bg-[#e1e4e8] px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-5xl items-center justify-center">
        <AnimatedSwapFlow />
      </div>
    </main>
  );
}
