"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, m } from "motion/react";
import { useRef, useState } from "react";
import { companiesIn, sectorHref, sectors } from "@/content/portfolio";
import { CompanyLogo } from "@/components/companies/CompanyLogo";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Interactive sector explorer (WAI-ARIA tabs): choose a sector to see its
 * summary and every company in it. Arrow keys, Home and End move between tabs.
 */
export function SectorExplorer() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const sector = sectors[active];
  const list = companiesIn(sector.slug);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const last = sectors.length - 1;
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowUp" || e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
      <div
        role="tablist"
        aria-label="Sectors"
        aria-orientation="vertical"
        className="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1 [scrollbar-width:none] lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0"
      >
        {sectors.map((s, i) => {
          const selected = i === active;
          return (
            <button
              key={s.slug}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`sector-tab-${s.slug}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="sector-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={`group relative flex min-h-12 shrink-0 items-center justify-between gap-6 rounded-xl px-4 text-left transition-colors duration-300 lg:min-h-14 ${
                selected ? "text-fg" : "text-fg-muted hover:bg-tint hover:text-fg"
              }`}
            >
              {selected && (
                <m.span
                  layoutId="sector-tab"
                  aria-hidden
                  className="glass absolute inset-0 rounded-xl"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                >
                  <span className="absolute inset-y-3 left-0 hidden w-0.5 rounded-full bg-accent shadow-[0_0_12px_rgb(28_53_112/0.8)] lg:block" />
                </m.span>
              )}
              <span className="relative flex items-baseline gap-3">
                <span className={`font-mono text-[0.7rem] ${selected ? "text-accent" : "text-fg-subtle"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[0.95rem] font-medium lg:text-base">{s.name}</span>
              </span>
              <span className="relative hidden font-mono text-xs text-fg-subtle lg:inline">
                {companiesIn(s.slug).length}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="sector-panel"
        role="tabpanel"
        aria-labelledby={`sector-tab-${sector.slug}`}
        className="glass relative isolate min-h-[32rem] overflow-hidden rounded-3xl lg:col-span-8"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <m.div
            key={sector.slug}
            className="absolute inset-0 -z-10"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            <Image
              src={sector.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover opacity-40 [filter:grayscale(0.5)_contrast(1.1)]"
              style={{ objectPosition: sector.focus }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-page via-page/85 to-page/40" />
          </m.div>
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={sector.slug}
            className="flex h-full flex-col p-6 sm:p-9"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.45, ease }}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="label-mono text-[0.68rem] text-accent">
                  Sector {String(active + 1).padStart(2, "0")} / {sectors.length}
                </p>
                <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.01em] sm:text-4xl">
                  {sector.name}
                </h3>
              </div>
              <p className="text-right">
                <span className="block font-display text-4xl font-semibold tracking-tight text-accent-gradient sm:text-5xl">
                  {list.length}
                </span>
                <span className="text-sm text-fg-muted">{list.length === 1 ? "business" : "businesses"}</span>
              </p>
            </div>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">{sector.summary}</p>

            <ul className="mt-8 flex flex-wrap gap-2">
              {list.map((company) => {
                const cls =
                  "group inline-flex min-h-12 items-center gap-2.5 rounded-xl border border-line bg-page/60 py-1.5 pl-1.5 pr-4 text-sm text-fg/90 transition-colors hover:border-accent/60 hover:text-fg";
                return (
                  <li key={company.name}>
                    {company.profile ? (
                      <Link href={company.profile} className={cls}>
                        <CompanyLogo name={company.name} size="md" highlight />
                        <span className="size-1.5 rounded-full bg-accent" aria-hidden />
                        {company.name}
                        <ArrowRight width={14} height={14} className="arrow-nudge text-fg-subtle group-hover:text-accent" />
                      </Link>
                    ) : (
                      <a href={company.sites[0].url} target="_blank" rel="noopener noreferrer" className={cls}>
                        <CompanyLogo name={company.name} size="md" />
                        {company.name}
                        <ArrowUpRight width={14} height={14} className="arrow-nudge-diag text-fg-subtle group-hover:text-accent" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-10">
              <p className="flex items-center gap-2 text-sm text-fg-subtle">
                <span className="size-1.5 rounded-full bg-accent" aria-hidden /> Group entity with a profile page
              </p>
              <Link
                href={sectorHref(sector.slug)}
                className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-fg px-5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-deep"
              >
                Explore {sector.name}
                <ArrowRight width={16} height={16} className="arrow-nudge" />
              </Link>
            </div>
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
