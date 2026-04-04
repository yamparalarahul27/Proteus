"use client";

import { useState } from "react";
import Image from "next/image";

type PeektextProps = {
  text: string;
  image: string;
  imageAlt: string;
};

export default function Peektext({ text, image, imageAlt }: PeektextProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="inline-flex cursor-pointer items-center gap-1 border-b border-dashed border-[color-mix(in_srgb,var(--text-secondary)_10%,var(--border-color))] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {text}
      <span
        className={`inline-block overflow-hidden transition-all duration-200 ease-in-out ${
          hovered ? "h-8 w-8 opacity-100" : "h-0 w-0 opacity-0"
        }`}
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
