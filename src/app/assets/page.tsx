import { SectionLanding } from "@/components/SectionLanding";

export default function AssetsPage() {
  return (
    <SectionLanding
      description="This section is the natural landing spot for wallet balances, token positions, and chain-by-chain holdings from the dashboard. The homepage navigation now routes here."
      eyebrow="Assets"
      primaryHref="/swap-flow"
      primaryLabel="Open Swap Flow"
      secondaryHref="/"
      secondaryLabel="Return Home"
      title="Asset Overview Coming Into Focus"
    />
  );
}
