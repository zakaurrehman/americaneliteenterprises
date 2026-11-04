"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { companiesIn, sectorHref, sectors, totalCompanies } from "@/content/portfolio";
import { CompanyLogo } from "@/components/companies/CompanyLogo";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";

/**
 * Portfolio mega menu. Each sector link is immediately followed in the DOM by
 * its company list, so keyboard users tab from a sector into its companies and
 * then on to the next sector. Hover or focus activates a sector; only the
 * active list is rendered visible (others are `hidden`).
 */
export function MegaMenu({ id, onNavigate }: { id: string; onNavigate: () => void }) {
  const [active, setActive] = useState(0);

  return (
    <div id={id} className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_80px_-20px_rgb(15_23_42/0.14)]">
      <div className="p-6 xl:p-8">
        {/* Fixed row heights: switching to a longer or shorter company list
            must not move the sector links under the pointer. */}
        <div
          className="grid grid-cols-[15rem_1fr] gap-x-8 xl:grid-cols-[16rem_1fr_15rem]"
          style={{ gridTemplateRows: `repeat(${sectors.length}, 2.75rem)` }}
        >
          {sectors.map((sector, i) => {
            const list = companiesIn(sector.slug);
            const isActive = i === active;
            return (
              <div key={sector.slug} className="contents">
                <Link
                  href={sectorHref(sector.slug)}
                  onClick={onNavigate}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  style={{ gridRow: i + 1, gridColumn: 1 }}
                  aria-current={isActive ? "true" : undefined}
                  className={`group flex items-center justify-between rounded-xl px-3 text-[0.9rem] transition-colors duration-200 ${
                    isActive ? "bg-tint-strong text-fg" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  <span className="flex items-baseline gap-3">
                    <span className={`font-mono text-[0.7rem] ${isActive ? "text-accent" : "text-fg-subtle"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {sector.name}
                  </span>
                  <span className="font-mono text-xs text-fg-subtle">{list.length}</span>
                </Link>

                <div
                  hidden={!isActive}
                  style={{ gridRow: `1 / span ${sectors.length}`, gridColumn: 2 }}
                >
                  <div className="flex items-end justify-between gap-6 border-b border-line pb-4">
                    <div>
                      <p className="label-mono text-accent">{sector.name}</p>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-muted">
                        {sector.summary}
                      </p>
                    </div>
                    <Link
                      href={sectorHref(sector.slug)}
                      onClick={onNavigate}
                      className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-accent hover:text-accent-deep"
                    >
                      Explore {sector.name}
                      <ArrowRight width={16} height={16} className="arrow-nudge" />
                    </Link>
                  </div>
                  <ul className="mt-3 grid grid-cols-2 gap-x-6">
                    {list.map((company) => {
                      const linkClass =
                        "group flex items-center gap-3 rounded-lg px-2 py-2 text-[0.9rem] text-fg/85 transition-colors hover:bg-tint hover:text-fg";
                      return (
                        <li key={company.name}>
                          {company.profile ? (
                            <Link href={company.profile} onClick={onNavigate} className={linkClass}>
                              <CompanyLogo name={company.name} size="sm" highlight />
                              <span className="mr-auto truncate">{company.name}</span>
                              <ArrowRight width={14} height={14} className="arrow-nudge shrink-0 text-fg-subtle group-hover:text-accent" />
                            </Link>
                          ) : (
                            <a href={company.sites[0].url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                              <CompanyLogo name={company.name} size="sm" />
                              <span className="mr-auto truncate">{company.name}</span>
                              <ArrowUpRight width={14} height={14} className="arrow-nudge-diag shrink-0 text-fg-subtle group-hover:text-accent" />
                              <span className="sr-only"> (opens in a new tab)</span>
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div
                  hidden={!isActive}
                  aria-hidden
                  style={{ gridRow: `1 / span ${sectors.length}`, gridColumn: 3 }}
                  className="relative hidden overflow-hidden rounded-xl xl:block"
                >
                  <Image
                    src={sector.image}
                    alt=""
                    fill
                    sizes="240px"
                    className="object-cover opacity-70 [filter:grayscale(0.6)_contrast(1.1)]"
                    style={{ objectPosition: sector.focus }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-page via-page/30 to-transparent" />
                  <p className="absolute bottom-4 left-4 font-display text-4xl font-semibold text-fg">
                    {list.length}
                    <span className="ml-2 font-sans text-sm font-normal text-fg-muted">
                      {list.length === 1 ? "business" : "businesses"}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-5 text-sm">
          <p className="text-fg-muted">
            {totalCompanies} businesses and initiatives across {sectors.length} sectors.
          </p>
          <div className="flex gap-6">
            <Link href="/industries/" onClick={onNavigate} className="group inline-flex items-center gap-2 font-medium text-fg hover:text-accent">
              All industries
              <ArrowRight width={16} height={16} className="arrow-nudge" />
            </Link>
            <Link href="/companies/" onClick={onNavigate} className="group inline-flex items-center gap-2 font-medium text-accent hover:text-accent-deep">
              Full company directory
              <ArrowRight width={16} height={16} className="arrow-nudge" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
