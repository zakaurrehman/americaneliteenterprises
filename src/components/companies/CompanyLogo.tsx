import Image from "next/image";
import { logos } from "@/content/logos";

/** URL-safe id of a company; logo files are named after it. */
export function companySlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Initials used as a typographic identity where no logo could be found. */
export function monogram(name: string) {
  const words = name
    .replace(/^American Elite\s*(–\s*)?/i, "")
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const source = words.length ? words : name.split(/\s+/);
  return source
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const sizes = {
  sm: { box: "h-7 w-10 rounded-md p-0.5", text: "text-[0.6rem]" },
  md: { box: "h-9 w-14 rounded-lg p-1", text: "text-[0.65rem]" },
  lg: { box: "h-20 w-36 rounded-xl p-2", text: "text-base" },
  xl: { box: "h-24 w-44 rounded-xl p-2.5", text: "text-xl" },
};

/**
 * A company's own logo, taken from its website, on a white tile so every logo
 * keeps its original colours. Decorative: the company name is always shown
 * next to it. Falls back to initials where no logo could be found.
 */
export function CompanyLogo({
  name,
  size = "lg",
  highlight = false,
}: {
  name: string;
  size?: keyof typeof sizes;
  /** Accent-tinted fallback, for core group entities. */
  highlight?: boolean;
}) {
  const logo = logos[companySlug(name)];
  const s = sizes[size];
  if (!logo) {
    return (
      <span
        aria-hidden
        className={`flex shrink-0 items-center justify-center border font-display font-semibold tracking-wide ${s.box} ${s.text} ${
          highlight ? "border-accent/40 bg-accent/10 text-accent" : "border-line bg-tint text-fg-muted"
        }`}
      >
        {monogram(name)}
      </span>
    );
  }
  return (
    <span className={`flex shrink-0 items-center justify-center border border-line bg-white ${s.box}`}>
      <Image
        src={logo.src}
        alt=""
        width={logo.width}
        height={logo.height}
        // Already small WebP files (≤400×200); serving them as-is avoids
        // re-encoding dozens of logos on a page's first visit.
        unoptimized
        className="h-full w-full object-contain"
      />
    </span>
  );
}
