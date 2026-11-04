import Image from "next/image";
import Link from "next/link";
import crest from "../../../public/brand/american-elite-crest.png";

/**
 * Brand logo for the header: the group's traditional crest (crown, gold frame,
 * lion and flag), as used on the original website, beside the name set in
 * classical capitals.
 */
export function Wordmark({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" onClick={onNavigate} className="group flex min-h-11 shrink-0 items-center gap-3">
      <Image
        src={crest}
        alt=""
        sizes="56px"
        loading="eager"
        className="h-12 w-auto transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-105 sm:h-14"
      />
      <span className="sr-only">American Elite Enterprises</span>
      <span aria-hidden className="flex flex-col font-heritage leading-none text-fg">
        <span className="text-[0.95rem] font-bold tracking-[0.08em] sm:text-[1.05rem]">American Elite</span>
        <span className="mt-1 text-[0.62rem] font-semibold tracking-[0.32em] text-fg-muted sm:text-[0.68rem]">
          Enterprises
        </span>
      </span>
    </Link>
  );
}
