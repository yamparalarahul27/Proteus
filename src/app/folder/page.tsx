"use client";

import ComponentShell from "@/components/ComponentShell";
import Folder, { FolderGrid } from "@/components/Folder";

const codeContent = `// See /src/components/Folder.tsx for full source`;
const promptContent = `Create a macOS-style folder component in React + Tailwind with SVG rendering. Support color variants (dark, blue, yellow, green, red, purple), optional name label, configurable size, hover lift animation with shadow, and glossy gradient finish.`;

export default function FolderPage() {
  return (
    <ComponentShell
      title="Folder"
      codeContent={codeContent}
      promptContent={promptContent}
    >
      {/* Primary trio from reference */}
      <div className="flex w-full max-w-2xl flex-col items-center gap-10 px-2">
        <FolderGrid>
          <Folder color="dark" mobileSize={100} desktopSize={140} />
          <Folder color="blue" mobileSize={100} desktopSize={140} />
          <Folder color="yellow" mobileSize={100} desktopSize={140} />
        </FolderGrid>

        {/* All color variants with labels */}
        <div className="flex w-full flex-col items-center gap-3">
          <p className="text-sm font-medium text-gray-500">All Variants</p>
          <FolderGrid>
            <Folder color="dark" name="Documents" mobileSize={80} />
            <Folder color="blue" name="Projects" mobileSize={80} />
            <Folder color="yellow" name="Favorites" mobileSize={80} />
            <Folder color="green" name="Downloads" mobileSize={80} />
            <Folder color="red" name="Important" mobileSize={80} />
            <Folder color="purple" name="Archive" mobileSize={80} />
          </FolderGrid>
        </div>

        {/* Size variants */}
        <div className="flex w-full flex-col items-center gap-3">
          <p className="text-sm font-medium text-gray-500">Sizes</p>
          <div className="flex flex-wrap items-end justify-center gap-4 sm:gap-6">
            <Folder color="blue" size={60} name="Small" />
            <Folder color="blue" mobileSize={70} desktopSize={90} name="Medium" />
            <Folder color="blue" mobileSize={90} desktopSize={120} name="Default" />
            <Folder color="blue" mobileSize={110} desktopSize={160} name="Large" />
          </div>
        </div>
      </div>
    </ComponentShell>
  );
}
