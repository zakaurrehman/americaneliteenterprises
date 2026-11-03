import Image from "next/image";
import Link from "next/link";
import lockup from "../../../public/brand/american-elite-lockup.png";

/**
 * Brand logo for the header: the metallic horizontal lockup (lion emblem beside
 * the "AMERICAN ELITE / ENTERPRISES" wordmark) from brand/logo-metallic.
 */
export function Wordmark({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" onClick={onNavigate} className="group flex min-h-11 shrink-0 items-center">
      <Image
        src={lockup}
        alt="American Elite Enterprises"
        sizes="(min-width: 640px) 220px, 186px"
        loading="eager"
        className="h-[41px] w-auto transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-[1.03] sm:h-[48px]"
      />
    </Link>
  );
}
