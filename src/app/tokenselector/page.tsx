"use client";

import ComponentShell from "@/components/ComponentShell";
import TokenSelectorModal from "@/components/TokenSelectorModal";

const CODE_CONTENT = `https://github.com/anthropics/Proteus/blob/main/src/app/tokenselector/page.tsx`;

const PROMPT_CONTENT = `Build a token selector modal that matches this style: muted gray sheet background, search row, "Top by volume" section title, list of tokens with logos/price/volume and green-red percentage change on the right, plus a bottom keyboard hint bar for arrows, Enter, and Esc.`;

export default function TokenSelectorPage() {
  return (
    <ComponentShell
      title="Token Selector Modal"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <TokenSelectorModal />
    </ComponentShell>
  );
}
