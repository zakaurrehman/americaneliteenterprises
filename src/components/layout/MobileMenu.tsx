"use client";

import Link from "next/link";
import { m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { companiesIn, sectorHref, sectors } from "@/content/portfolio";
import { mainNav, site } from "@/content/site";
import { ArrowRight, ArrowUpRight, ChevronDown, Close } from "@/components/ui/icons";
import { Wordmark } from "./Wordmark";

const ease = [0.16, 1, 0.3, 1] as const;

/** Full-screen mobile navigation dialog with expandable portfolio groups. */
export function MobileMenu({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [companiesOpen, setCompaniesOpen] = useState(false);
  const [openSector, setOpenSector] = useState<string | null>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panel.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ).filter((el) => el.offsetParent !== null);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [onClose]);

  const [home, ...rest] = mainNav;

  return (
    <m.div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-page text-fg lg:hidden"
      // Fade + slide rather than a clip-path wipe: browsers hit-test against
      // the clipped shape, so a wipe made early taps miss the links.
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease }}
    >
      <div className="container-x flex h-[var(--header-h)] shrink-0 items-center justify-between">
        <Wordmark onNavigate={onClose} />
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          className="-mr-2 inline-flex size-12 items-center justify-center rounded-xl text-fg hover:text-accent"
        >
          <Close width={24} height={24} />
          <span className="sr-only">Close menu</span>
        </button>
      </div>

      <m.nav
        aria-label="Mobile"
        className="container-x flex-1 pb-10 pt-4"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }}
      >
        <ul className="divide-y divide-line border-y border-line">
          {[home].map((item) => (
            <MenuRow key={item.href}>
              <Link href={item.href} onClick={onClose} className={rowLink}>
                {item.label}
              </Link>
            </MenuRow>
          ))}

          <MenuRow>
            <button
              type="button"
              aria-expanded={companiesOpen}
              aria-controls="mobile-companies"
              onClick={() => setCompaniesOpen((v) => !v)}
              className={`${rowLink} w-full`}
            >
              Our Companies
              <ChevronDown
                width={22}
                height={22}
                className={`text-accent transition-transform duration-500 ${companiesOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div id="mobile-companies" hidden={!companiesOpen} className="pb-4">
              <Link
                href="/companies/"
                onClick={onClose}
                className="group mb-2 flex items-center gap-2 py-2 text-sm font-semibold text-accent"
              >
                View the full directory
                <ArrowRight width={16} height={16} className="arrow-nudge" />
              </Link>
              <ul className="space-y-1">
                {sectors.map((sector) => {
                  const open = openSector === sector.slug;
                  const panelId = `mobile-sector-${sector.slug}`;
                  return (
                    <li key={sector.slug} className="rounded-xl border border-line bg-tint">
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => setOpenSector(open ? null : sector.slug)}
                        className="flex min-h-12 w-full items-center justify-between px-4 text-left text-base text-fg/90"
                      >
                        <span>
                          {sector.name}
                          <span className="ml-2 text-xs tabular-nums text-fg-subtle">
                            {companiesIn(sector.slug).length}
                          </span>
                        </span>
                        <ChevronDown
                          width={18}
                          height={18}
                          className={`text-fg-subtle transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                        />
                      </button>
                      <ul id={panelId} hidden={!open} className="px-4 pb-3">
                        <li>
                          <Link
                            href={sectorHref(sector.slug)}
                            onClick={onClose}
                            className="flex min-h-11 items-center gap-2 text-sm font-semibold text-accent"
                          >
                            Explore {sector.name}
                            <ArrowRight width={14} height={14} />
                          </Link>
                        </li>
                        {companiesIn(sector.slug).map((company) => (
                          <li key={company.name}>
                            {company.profile ? (
                              <Link
                                href={company.profile}
                                onClick={onClose}
                                className="flex min-h-11 items-center justify-between gap-3 border-t border-line text-sm text-fg/80"
                              >
                                {company.name}
                                <ArrowRight width={14} height={14} className="shrink-0 text-fg-subtle" />
                              </Link>
                            ) : (
                              <a
                                href={company.sites[0].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex min-h-11 items-center justify-between gap-3 border-t border-line text-sm text-fg/80"
                              >
                                {company.name}
                                <ArrowUpRight width={14} height={14} className="shrink-0 text-fg-subtle" />
                                <span className="sr-only"> (opens in a new tab)</span>
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
          </MenuRow>

          {rest.map((item) => (
            <MenuRow key={item.href}>
              <Link href={item.href} onClick={onClose} className={rowLink}>
                {item.label}
              </Link>
            </MenuRow>
          ))}
        </ul>

        <m.div
          variants={rowVariants}
          className="mt-10 space-y-2 text-sm text-fg-subtle"
        >
          <a href={site.contact.phoneHref} className="block py-1 hover:text-accent">
            {site.contact.phoneDisplay}
          </a>
          <a href={site.contact.emailHref} className="block break-all py-1 hover:text-accent">
            {site.contact.email}
          </a>
        </m.div>
      </m.nav>
    </m.div>
  );
}

const rowLink =
  "flex min-h-16 items-center justify-between font-display text-2xl font-semibold tracking-[-0.01em] text-fg hover:text-accent";

const rowVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

function MenuRow({ children }: { children: React.ReactNode }) {
  return <m.li variants={rowVariants}>{children}</m.li>;
}
