"use client";

import { AnimatePresence, LayoutGroup, m } from "motion/react";
import { useId, useMemo, useState } from "react";
import { companies, sectors, type SectorSlug } from "@/content/portfolio";
import { Search } from "@/components/ui/icons";
import { CompanyCard } from "./CompanyCard";

type Filter = SectorSlug | "all";

const ease = [0.16, 1, 0.3, 1] as const;

/** Filterable, searchable directory of every company in the portfolio. */
export function CompanyDirectory({ searchable = false }: { searchable?: boolean }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const searchId = useId();

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return companies.filter(
      (c) =>
        (filter === "all" || c.sector === filter) &&
        (!q ||
          c.name.toLowerCase().includes(q) ||
          c.sites.some((s) => s.label.toLowerCase().includes(q)) ||
          c.description?.toLowerCase().includes(q)),
    );
  }, [filter, query]);

  const options: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "All", count: companies.length },
    ...sectors.map((s) => ({
      value: s.slug as Filter,
      label: s.name,
      count: companies.filter((c) => c.sector === s.slug).length,
    })),
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <LayoutGroup id="filters">
          <div
            role="group"
            aria-label="Filter companies by sector"
            className="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {options.map((opt) => {
              const active = filter === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(opt.value)}
                  className={`relative flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-300 ${
                    active
                      ? "border-transparent text-on-accent"
                      : "border-line bg-tint text-fg-muted hover:border-line-strong hover:text-fg"
                  }`}
                >
                  {active && (
                    <m.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-accent shadow-[0_0_24px_-4px_rgb(36_99_234/0.7)]"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">{opt.label}</span>
                  <span className={`relative font-mono text-xs ${active ? "text-on-accent" : "text-fg-subtle"}`}>
                    {opt.count}
                  </span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        {searchable && (
          <div className="relative w-full lg:max-w-xs">
            <label htmlFor={searchId} className="sr-only">
              Search companies
            </label>
            <Search
              width={18}
              height={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle"
            />
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or website"
              className="glass min-h-12 w-full rounded-xl pl-11 pr-4 text-sm text-fg outline-none transition-colors placeholder:text-fg-subtle focus-visible:border-accent"
            />
          </div>
        )}
      </div>

      <p aria-live="polite" className="mt-6 font-mono text-xs text-fg-subtle">
        {`${matches.length} ${matches.length === 1 ? "business" : "businesses"}`}
      </p>

      <m.ul layout className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {matches.map((company) => (
            <m.li
              key={company.name}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease }}
            >
              <CompanyCard company={company} />
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>

      {matches.length === 0 && (
        <p className="mt-6 text-fg-muted">
          No businesses match “{query}”. Try another name or clear the search.
        </p>
      )}

    </div>
  );
}
