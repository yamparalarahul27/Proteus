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
      <div className="flex flex-col items-center gap-10">
        <FolderGrid>
          <Folder color="dark" size={140} />
          <Folder color="blue" size={140} />
          <Folder color="yellow" size={140} />
        </FolderGrid>

        {/* All color variants with labels */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-medium text-gray-500">All Variants</p>
          <FolderGrid>
            <Folder color="dark" name="Documents" />
            <Folder color="blue" name="Projects" />
            <Folder color="yellow" name="Favorites" />
            <Folder color="green" name="Downloads" />
            <Folder color="red" name="Important" />
            <Folder color="purple" name="Archive" />
          </FolderGrid>
        </div>

        {/* Size variants */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-medium text-gray-500">Sizes</p>
          <div className="flex items-end justify-center gap-6">
            <Folder color="blue" size={60} name="Small" />
            <Folder color="blue" size={90} name="Medium" />
            <Folder color="blue" size={120} name="Default" />
            <Folder color="blue" size={160} name="Large" />
          </div>
        </div>
      </div>
    </ComponentShell>
  );
}
