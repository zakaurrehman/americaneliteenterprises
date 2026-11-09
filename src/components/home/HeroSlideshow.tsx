"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "@/components/ui/icons";

export type Slide = { src: string; focus?: string };

const SLIDE_MS = 6500;

/**
 * Cinematic background slideshow for the homepage hero, carried over from
 * the original website: slow cross-fades with a gentle zoom. Decorative —
 * the hero's text carries the meaning. Only the first photo loads with the
 * page; the rest load once the page is idle. Visitors who prefer reduced
 * motion see the first photo only, and anyone can pause it (WCAG 2.2.2).
 */
export function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);
  const current = useRef(0);

  // Load the remaining photos after the page has finished loading.
  useEffect(() => {
    const idle = typeof window.requestIdleCallback === "function";
    let handle = 0;
    const reveal = () => {
      setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      setReady(true);
    };
    const start = () => {
      handle = idle ? window.requestIdleCallback(reveal, { timeout: 2500 }) : window.setTimeout(reveal, 1200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  const running = ready && playing && !reduced;
  useEffect(() => {
    if (!running) return;
    const tick = () => {
      if (document.hidden) return;
      setPrev(current.current);
      current.current = (current.current + 1) % slides.length;
      setIndex(current.current);
    };
    const id = window.setInterval(tick, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [running, slides.length]);

  const visible = ready ? slides : slides.slice(0, 1);

  return (
    <>
      <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden bg-navy-deep">
        {visible.map((slide, i) => {
          const active = i === index;
          const zoom = !reduced && (active || i === prev);
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-[1600ms] ease-[var(--ease-soft)] ${active ? "opacity-100" : "opacity-0"}`}
            >
              <Image
                src={slide.src}
                alt=""
                fill
                sizes="100vw"
                quality={70}
                preload={i === 0}
                className={`object-cover ${zoom ? "animate-[ken-burns_9s_linear_forwards]" : ""}`}
                style={{ objectPosition: slide.focus }}
              />
            </div>
          );
        })}
      </div>

      {ready && !reduced && (
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="absolute bottom-5 right-[var(--gutter)] z-10 inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/30 bg-navy-deep/55 px-4 text-sm text-on-accent backdrop-blur-sm transition-colors hover:border-gold hover:text-gold-soft"
        >
          {playing ? <Pause width={14} height={14} aria-hidden /> : <Play width={14} height={14} aria-hidden />}
          <span>{playing ? "Pause slideshow" : "Play slideshow"}</span>
          <span aria-hidden className="font-heritage text-xs tracking-[0.2em] text-gold-soft">
            {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
        </button>
      )}
    </>
  );
}
