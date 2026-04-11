"use client";

import dynamic from "next/dynamic";

const Agentation = dynamic(
  () => import("agentation").then((module) => module.Agentation),
  { ssr: false },
);

export function AgentationDevtools() {
  const isDev = process.env.NODE_ENV === "development";
  const isStage = process.env.NEXT_PUBLIC_STAGE === "true";

  if (!isDev && !isStage) {
    return null;
  }

  return <Agentation />;
}
