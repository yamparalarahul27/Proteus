import { SectionLanding } from "@/components/SectionLanding";

export default function NftPage() {
  return (
    <SectionLanding
      description="The NFT table on the homepage now supports sorting and collection redirects. This page is the destination for deeper collection exploration."
      eyebrow="NFT"
      primaryHref="/"
      primaryLabel="Browse Collections"
      secondaryHref="/swap-flow"
      secondaryLabel="Open Swap Flow"
      title="Collection Discovery Starts Here"
    />
  );
}
