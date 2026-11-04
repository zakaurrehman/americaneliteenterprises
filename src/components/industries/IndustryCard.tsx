import Image from "next/image";
import Link from "next/link";
import { companiesIn, sectorHref, type Sector } from "@/content/portfolio";
import { ArrowRight } from "@/components/ui/icons";

// Asymmetric bento placement on a 12-column grid, in sector order.
export const bentoLayout = [
  "sm:col-span-2 lg:col-span-6 lg:row-span-2", // Healthcare (feature)
  "lg:col-span-6", // Business
  "lg:col-span-3", // Technology
  "lg:col-span-3", // Charities
  "lg:col-span-4", // Legal
  "lg:col-span-4", // Consulting
  "lg:col-span-4", // E-commerce
  "lg:col-span-7", // Education
  "lg:col-span-5", // Inventions
];

/** Sector tile for the bento grid: photo lifts from shadow on hover/focus. */
export function IndustryCard({
  sector,
  index,
  className = "",
  feature = false,
}: {
  sector: Sector;
  index: number;
  className?: string;
  feature?: boolean;
}) {
  const count = companiesIn(sector.slug).length;
  return (
    <Link
      href={sectorHref(sector.slug)}
      data-reveal
      style={{ "--reveal-delay": index % 3 } as React.CSSProperties}
      className={`glass spotlight edge-light group relative isolate flex min-h-[16rem] flex-col justify-end overflow-hidden rounded-3xl p-6 sm:min-h-[19rem] sm:p-8 lg:min-h-0 ${className}`}
    >
      <Image
        src={sector.image}
        alt=""
        fill
        sizes={feature ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"}
        className="-z-10 object-cover opacity-35 transition-[opacity,transform,filter] duration-1000 ease-[var(--ease-expo)] [filter:grayscale(0.7)_contrast(1.1)] group-hover:scale-[1.04] group-hover:opacity-60 group-hover:[filter:grayscale(0)_contrast(1.05)] group-focus-visible:opacity-60"
        style={{ objectPosition: sector.focus }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-page via-page/70 to-page/10" />

      <div className="absolute inset-x-6 top-6 flex items-start justify-between sm:inset-x-8 sm:top-8">
        <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
        <span className="rounded-full border border-line bg-page/60 px-3 py-1 font-mono text-[0.7rem] text-fg/85">
          {count} {count === 1 ? "business" : "businesses"}
        </span>
      </div>

      <h3 className={`font-display font-semibold tracking-[-0.03em] ${feature ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"}`}>
        {sector.name}
      </h3>
      <p className={`mt-3 text-fg-muted text-pretty ${feature ? "max-w-md text-base sm:text-lg" : "max-w-sm text-[0.95rem]"}`}>
        {sector.summary}
      </p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">
        Explore {sector.name}
        <ArrowRight width={16} height={16} className="arrow-nudge" />
      </span>
    </Link>
  );
}
