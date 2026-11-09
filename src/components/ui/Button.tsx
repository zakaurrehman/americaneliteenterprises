import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "./icons";

type Variant = "primary" | "glass" | "solid" | "gold" | "outline-light";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-deep shadow-[0_0_0_1px_rgb(28_53_112/0.4),0_10px_40px_-10px_rgb(28_53_112/0.55)] sheen",
  glass: "glass text-fg hover:border-line-strong hover:bg-tint-strong",
  solid: "bg-fg text-on-accent hover:bg-accent-deep",
  // For dark backgrounds (photo hero, navy bands).
  gold: "bg-gold text-navy-deep hover:bg-gold-soft shadow-[0_0_0_1px_rgb(201_162_74/0.5),0_12px_40px_-12px_rgb(201_162_74/0.6)] sheen",
  "outline-light": "border border-white/45 bg-white/5 text-on-accent backdrop-blur-sm hover:border-gold hover:bg-white/10",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  magnetic?: boolean;
  className?: string;
};

/** Link styled as a button. External links open in a new tab safely. */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
  magnetic = false,
  className = "",
}: Props) {
  const classes = `group inline-flex min-h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-xl px-6 py-3 text-[0.9375rem] font-semibold tracking-tight transition-[background-color,border-color,transform] duration-300 active:scale-[0.98] ${variants[variant]} ${className}`;
  const Icon = external ? ArrowUpRight : ArrowRight;
  const icon = (
    <Icon
      width={18}
      height={18}
      className={external ? "arrow-nudge-diag" : "arrow-nudge"}
    />
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        data-magnetic={magnetic || undefined}
      >
        {children}
        {icon}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  const isProtocol = /^(tel|mailto):/.test(href);
  if (isProtocol) {
    return (
      <a href={href} className={classes} data-magnetic={magnetic || undefined}>
        {children}
        {icon}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} data-magnetic={magnetic || undefined}>
      {children}
      {icon}
    </Link>
  );
}
