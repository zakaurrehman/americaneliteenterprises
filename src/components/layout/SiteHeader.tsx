"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { mainNav } from "@/content/site";
import { ArrowRight, ChevronDown } from "@/components/ui/icons";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { Wordmark } from "./Wordmark";

const ease = [0.16, 1, 0.3, 1] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href.replace(/\/$/, ""));
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const hoverOpenedAt = useRef(0);

  // Solid background after scrolling; hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 480 && y > lastY + 4);
      if (y < lastY - 4) setHidden(false);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMega = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setMegaOpen(false);
  }, []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const openWithIntent = () => {
    window.clearTimeout(closeTimer.current);
    if (!megaOpen) hoverOpenedAt.current = Date.now();
    setMegaOpen(true);
  };
  const closeWithGrace = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 220);
  };

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!megaRef.current?.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [megaOpen]);

  const solid = scrolled || megaOpen;
  const navItems = mainNav.filter((item) => item.href !== "/");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 pt-3 transition-transform duration-500 ease-[var(--ease-expo)] ${
          hidden && !megaOpen ? "-translate-y-[120%]" : "translate-y-0"
        }`}
      >
        <a
          href="#main"
          className="sr-only z-[70] rounded-full bg-accent px-4 py-2 font-semibold text-on-accent focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
        >
          Skip to content
        </a>

        <div
          ref={megaRef}
          className="container-x"
          onPointerLeave={closeWithGrace}
          onPointerEnter={() => megaOpen && window.clearTimeout(closeTimer.current)}
          onBlur={(e) => {
            if (!megaRef.current?.contains(e.relatedTarget as Node)) closeMega();
          }}
        >
          <div
            className={`flex h-16 items-center justify-between gap-6 rounded-2xl pl-3 pr-2 transition-[background-color,border-color,box-shadow] duration-500 sm:pl-4 ${
              solid ? "glass-blur" : "border border-transparent"
            }`}
          >
            <Wordmark />

            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-0.5 xl:gap-1">
                <li>
                  <NavLink href="/" active={pathname === "/"}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/about/" active={isActive(pathname, "/about/")}>
                    About
                  </NavLink>
                </li>
                <li>
                  <button
                    ref={triggerRef}
                    type="button"
                    aria-expanded={megaOpen}
                    aria-controls="mega-menu"
                    onClick={() => {
                      // A click that follows a hover-open confirms, not toggles.
                      const justOpened = Date.now() - hoverOpenedAt.current < 600;
                      setMegaOpen((v) => (justOpened ? true : !v));
                    }}
                    onPointerEnter={(e) => e.pointerType === "mouse" && openWithIntent()}
                    className={`relative flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-[0.875rem] font-medium transition-colors ${
                      megaOpen || isActive(pathname, "/companies/")
                        ? "text-fg"
                        : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {isActive(pathname, "/companies/") && <ActivePill />}
                    <span className="relative">Our Companies</span>
                    <ChevronDown
                      width={15}
                      height={15}
                      className={`relative transition-transform duration-500 ${megaOpen ? "rotate-180 text-accent" : ""}`}
                    />
                  </button>
                  {/* Rendered right after its trigger so Tab moves straight into
                      the panel; positioned against the fixed header. */}
                  <AnimatePresence>
                    {megaOpen && (
                      <m.div
                        key="mega"
                        className="container-x absolute inset-x-0 top-full pt-2"
                        initial={{ opacity: 0, y: -10, scale: 0.985 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.99 }}
                        transition={{ duration: 0.35, ease }}
                      >
                        <MegaMenu id="mega-menu" onNavigate={closeMega} />
                      </m.div>
                    )}
                  </AnimatePresence>
                </li>
                {navItems.slice(1).map((item) => (
                  <li key={item.href}>
                    <NavLink href={item.href} active={isActive(pathname, item.href)}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                href="/contact/"
                data-magnetic
                className="group sheen hidden min-h-11 items-center gap-2 rounded-xl bg-accent px-4 text-[0.875rem] font-semibold text-on-accent transition-colors hover:bg-accent-deep sm:inline-flex"
              >
                Get in touch
                <ArrowRight width={16} height={16} className="arrow-nudge" />
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                className="glass inline-flex size-11 flex-col items-center justify-center gap-1.5 rounded-xl lg:hidden"
              >
                <span className="h-px w-5 bg-fg" />
                <span className="h-px w-5 bg-fg" />
                <span className="ml-2 h-px w-3 bg-accent" />
                <span className="sr-only">Open menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && <MobileMenu key="mobile" onClose={closeMobile} />}
      </AnimatePresence>
    </>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative flex min-h-11 items-center rounded-full px-3.5 text-[0.875rem] font-medium transition-colors ${
        active ? "text-fg" : "text-fg-muted hover:text-fg"
      }`}
    >
      {active && <ActivePill />}
      <span className="relative">{children}</span>
    </Link>
  );
}

/** Pill behind the active nav item; slides between items via layoutId. */
function ActivePill() {
  return (
    <m.span
      layoutId="nav-active"
      aria-hidden
      className="absolute inset-0 rounded-full border border-line bg-tint-strong"
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
    >
      <span className="absolute -bottom-px left-1/2 h-px w-6 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent to-transparent" />
    </m.span>
  );
}
