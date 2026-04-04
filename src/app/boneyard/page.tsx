"use client";

import { useState } from "react";
import type { ResponsiveBones } from "boneyard-js";
import { Skeleton } from "boneyard-js/react";
import ComponentShell from "@/components/ComponentShell";
import blogBones from "./blog.bones.json";

const CODE_CONTENT = `// Source: https://github.com/0xGF/boneyard
// Credit: https://x.com/0xGoodfuture
// Package: https://www.npmjs.com/package/boneyard-js

import { Skeleton } from "boneyard-js/react";
import blogBones from "./blog.bones.json";

<Skeleton
  name="blog"
  loading={loading}
  color="#d6d3d1"
  initialBones={blogBones}
>
  <BlogCard />
</Skeleton>`;

const PROMPT_CONTENT = `Create a Next.js card demo using boneyard-js where a button toggles between real UI and a pixel-perfect skeleton. Include clear attribution to https://github.com/0xGF/boneyard.`;

function BlogCard() {
  return (
    <article className="flex flex-col gap-3 rounded-xl p-4 sm:p-5">
      <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-stone-100 via-stone-200 to-stone-100" />
      <h3 className="text-[15px] font-bold leading-tight text-stone-900">
        We Moved to a Monorepo and It Broke Everything
      </h3>
      <p className="text-[13px] leading-[19px] text-stone-500">
        Three weeks of broken builds, circular deps, and one very long Friday. Here&apos;s what we actually learned.
      </p>
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-300 text-[10px] font-semibold text-stone-700">
          JF
        </div>
        <span className="text-[12px] font-medium text-stone-500">Jake F.</span>
      </div>
    </article>
  );
}

export default function BoneyardPage() {
  const [loading, setLoading] = useState(true);

  return (
    <ComponentShell
      title="Boneyard Skeleton"
      codeContent={CODE_CONTENT}
      promptContent={PROMPT_CONTENT}
    >
      <div className="w-full max-w-xl rounded-2xl border border-stone-200 bg-stone-50 p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-[0.14em] text-stone-500">
            Pixel-Perfect Skeleton Loader
          </p>
          <button
            onClick={() => setLoading((prev) => !prev)}
            className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-100"
          >
            {loading ? "Show UI" : "Show Skeleton"}
          </button>
        </div>

        <p className="mt-2 text-xs text-stone-500">
          Credit:{" "}
          <a
            href="https://github.com/0xGF/boneyard"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-stone-700"
          >
            0xGF/boneyard
          </a>{" "}
          by{" "}
          <a
            href="https://x.com/0xGoodfuture"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-stone-700"
          >
            @0xGoodfuture
          </a>
        </p>

        <div className="mt-4 rounded-xl border border-stone-200 bg-white">
          <Skeleton
            name="blog"
            loading={loading}
            color="#d6d3d1"
            initialBones={blogBones as ResponsiveBones}
          >
            <BlogCard />
          </Skeleton>
        </div>
      </div>
    </ComponentShell>
  );
}
