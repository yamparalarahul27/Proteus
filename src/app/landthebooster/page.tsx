"use client";

import dynamic from "next/dynamic";
import ComponentShell from "@/components/ComponentShell";

const LandTheBooster = dynamic(() => import("@/components/LandTheBooster"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] items-center justify-center text-sm text-gray-400">
      Preparing launch...
    </div>
  ),
});

const codeContent = `// See /src/components/LandTheBooster.tsx for full source`;
const promptContent = `Create a "Land the Booster on Mars" game inspired by land-the-booster.s13k.dev/mars. DOM-based rocket with CSS transforms, physics sim (gravity, thrust, rotation), fuel/speed/angle HUD with meter bars, arrow keys + WASD + touch controls, welcome/success/failure dialogs with scoring (time + accuracy), Mars gradient background with stars, landing pad target zone, and explosion effect on crash.`;

export default function LandTheBoosterPage() {
  return (
    <ComponentShell
      title="Land the Booster"
      codeContent={codeContent}
      promptContent={promptContent}
    >
      <div className="h-[70vh] sm:h-[75vh] w-full max-w-[900px] overflow-hidden rounded-2xl border border-white/10">
        <LandTheBooster />
      </div>
    </ComponentShell>
  );
}
