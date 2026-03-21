import Link from "next/link";

type SectionLandingProps = {
  description: string;
  eyebrow: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  title: string;
};

export function SectionLanding({
  description,
  eyebrow,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  title,
}: SectionLandingProps) {
  return (
    <main className="min-h-dvh bg-[#f3f4f6] px-4 py-6 text-[#1f2937] sm:px-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Link
          className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-[14px] font-medium shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
          href="/"
        >
          Back to Dashboard
        </Link>

        <section className="rounded-[20px] border border-[#e5e7eb] bg-white px-6 py-8 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:px-10 sm:py-12">
          <p className="text-[13px] font-semibold uppercase tracking-[0.28em] text-[#6d28d9]">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-2xl text-balance text-[36px] font-semibold leading-tight text-[#111827] sm:text-[48px]">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-[16px] leading-7 text-[#6b7280] sm:text-[18px]">
            {description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center rounded-full bg-[#17171f] px-5 py-3 text-[15px] font-medium text-white shadow-[0_12px_24px_rgba(23,23,31,0.16)]"
              href={primaryHref}
            >
              {primaryLabel}
            </Link>
            {secondaryHref && secondaryLabel ? (
              <Link
                className="inline-flex items-center justify-center rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-5 py-3 text-[15px] font-medium text-[#1f2937]"
                href={secondaryHref}
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
