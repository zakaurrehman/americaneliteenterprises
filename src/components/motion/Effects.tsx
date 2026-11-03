"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __aeReady?: boolean;
  }
}

/**
 * Site-wide interaction layer, mounted once in the root layout.
 *
 * - Scroll reveals: adds `.is-in` to `[data-reveal]` elements as they enter
 *   the viewport (also picks up elements added by client navigation).
 * - Spotlight: updates `--mx/--my` on `.spotlight` elements under the pointer.
 * - Magnetic: nudges `[data-magnetic]` elements toward a fine pointer.
 *
 * Keeping this in one delegated module lets sections stay Server Components.
 */
export function Effects() {
  useEffect(() => {
    window.__aeReady = true;
    const root = document.documentElement;
    root.classList.add("js");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const observeAll = (scope: ParentNode) => {
      scope
        .querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)")
        .forEach((el) => io.observe(el));
    };
    observeAll(document);

    const mo = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches("[data-reveal]")) io.observe(node);
          observeAll(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    let lastEvent: PointerEvent | null = null;
    let activeMagnet: HTMLElement | null = null;

    const update = () => {
      frame = 0;
      const e = lastEvent;
      if (!e) return;
      const target = e.target as Element | null;

      const spot = target?.closest<HTMLElement>(".spotlight");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }

      if (reducedMotion) return;
      const magnet = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (activeMagnet && activeMagnet !== magnet) {
        activeMagnet.style.removeProperty("--tx");
        activeMagnet.style.removeProperty("--ty");
      }
      activeMagnet = magnet;
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.35;
        magnet.style.setProperty("--tx", `${dx.toFixed(1)}px`);
        magnet.style.setProperty("--ty", `${dy.toFixed(1)}px`);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      lastEvent = e;
      if (!frame) frame = requestAnimationFrame(update);
    };

    if (finePointer) {
      document.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    return () => {
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("pointermove", onPointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
