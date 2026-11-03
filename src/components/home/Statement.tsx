"use client";

import { useEffect, useRef } from "react";

/**
 * A statement whose words light up as it scrolls through the viewport.
 * Words are server-rendered text; this only sets one CSS variable (--p) per
 * frame. Reduced motion (and no JavaScript) shows the full statement.
 */
export function LitStatement({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the top enters the lower 85% of the viewport, 1 when the bottom passes 45%
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.4);
      el.style.setProperty("--p", String(Math.max(0, Math.min(1, p))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    el.style.setProperty("--p", "0");
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <p ref={ref} className={className} style={{ "--n": words.length } as React.CSSProperties}>
      {words.map((word, i) => (
        <span key={i} className="lit-word" style={{ "--i": i } as React.CSSProperties}>
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
