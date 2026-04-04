"use client";

import ComponentShell from "@/components/ComponentShell";
import Peektext from "@/components/Peektext";

type Segment =
  | { text: string }
  | { text: string; image: string; imageAlt: string };

const segments: Segment[] = [
  { text: "He works at " },
  {
    text: "Equicom Technologies",
    image: "/portfolio/equicom.png",
    imageAlt: "Equicom Technologies",
  },
  { text: " building products." },
];

const CODE_CONTENT = `"use client";

import { useState } from "react";
import Image from "next/image";

type PeektextProps = {
  text: string;
  image: string;
  imageAlt: string;
};

function Peektext({ text, image, imageAlt }: PeektextProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="inline-flex cursor-pointer items-center gap-1 border-b border-dashed border-[color-mix(in_srgb,var(--text-secondary)_10%,var(--border-color))] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {text}
      <span
        className={\`inline-block overflow-hidden transition-all duration-200 ease-in-out \${
          hovered ? "h-8 w-8 opacity-100" : "h-0 w-0 opacity-0"
        }\`}
      >
        <Image
          alt={imageAlt}
          className="h-8 w-8 rounded-sm object-cover"
          height={32}
          src={image}
          width={32}
        />
      </span>
    </span>
  );
}

type Segment =
  | { text: string }
  | { text: string; image: string; imageAlt: string };

const segments: Segment[] = [
  { text: "He works at " },
  {
    text: "Equicom Technologies",
    image: "/portfolio/equicom.png",
    imageAlt: "Equicom Technologies",
  },
  { text: " building products." },
];

function isImageSegment(
  segment: Segment,
): segment is { text: string; image: string; imageAlt: string } {
  return "image" in segment;
}

export default function PeektextPage() {
  return (
    <div className="w-full max-w-2xl rounded-2xl border border-[var(--border-color)] bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm uppercase tracking-[0.14em] text-[var(--text-secondary)]">
        Inline Hover Reveal
      </p>
      <p className="mt-3 text-lg leading-relaxed text-[#111827] sm:text-xl">
        {segments.map((segment, index) =>
          isImageSegment(segment) ? (
            <Peektext
              key={\`\${segment.text}-\${index}\`}
              text={segment.text}
              image={segment.image}
              imageAlt={segment.imageAlt}
            />
          ) : (
            <span key={\`\${segment.text}-\${index}\`}>{segment.text}</span>
          ),
        )}
      </p>
    </div>
  );
}`;

const PROMPT_CONTENT = `Create an inline text component where a tiny image expands on hover. Use Next.js Image and Tailwind classes to transition from w-0 opacity-0 to w-4 opacity-100 in 200ms.`;

function isImageSegment(
  segment: Segment,
): segment is { text: string; image: string; imageAlt: string } {
  return "image" in segment;
}

export default function PeektextPage() {
  return (
    <ComponentShell
      title="Peektext"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="w-full max-w-2xl rounded-2xl border border-[var(--border-color)] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm uppercase tracking-[0.14em] text-[var(--text-secondary)]">
          Inline Hover Reveal
        </p>
        <p className="mt-3 text-lg leading-relaxed text-[#111827] sm:text-xl">
          {segments.map((segment, index) =>
            isImageSegment(segment) ? (
              <Peektext
                key={`${segment.text}-${index}`}
                text={segment.text}
                image={segment.image}
                imageAlt={segment.imageAlt}
              />
            ) : (
              <span key={`${segment.text}-${index}`}>{segment.text}</span>
            ),
          )}
        </p>
      </div>
    </ComponentShell>
  );
}
