import { SectionLanding } from "@/components/SectionLanding";

export default function DefiPage() {
  return (
    <SectionLanding
      description="The DeFi dashboard cards now route into this section as a broader destination, while individual protocol interest can continue into the swap flow demo."
      eyebrow="DeFi"
      primaryHref="/swap-flow"
      primaryLabel="Launch Trade Demo"
      secondaryHref="/"
      secondaryLabel="Return Home"
      title="Explore Protocol Opportunities"
    />
  );
}
