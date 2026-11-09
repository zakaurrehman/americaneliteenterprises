"use client";

import { m, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { milestones } from "@/content/story";

/**
 * Vertical timeline whose gold line draws as the reader scrolls through it.
 * Milestones themselves use the global scroll-reveal.
 */
export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  return (
    <ol ref={ref} className="relative">
      <span
        aria-hidden
        className="absolute bottom-0 left-[11px] top-0 w-px bg-line-strong md:left-1/2 md:-translate-x-1/2"
      />
      <m.span
        aria-hidden
        className="absolute bottom-0 left-[11px] top-0 w-px origin-top bg-gradient-to-b from-accent-soft via-accent to-accent-deep shadow-[0_0_14px_rgb(28_53_112/0.7)] md:left-[calc(50%-0.5px)]"
        style={{ scaleY: reduce ? 1 : progress }}
      />

      {milestones.map((item, i) => {
        const right = i % 2 === 1;
        return (
          <li
            key={item.year}
            className="relative grid pb-10 pl-10 last:pb-0 md:grid-cols-2 md:gap-16 md:pb-16 md:pl-0"
          >
            <span
              aria-hidden
              className="absolute left-0 top-7 flex size-[23px] items-center justify-center rounded-full border border-accent/50 bg-page md:left-1/2 md:-translate-x-1/2"
            >
              <span className="size-[7px] rounded-full bg-accent shadow-[0_0_10px_2px_rgb(28_53_112/0.6)]" />
            </span>

            <div
              data-reveal
              className={`glass spotlight relative rounded-2xl p-6 sm:p-7 ${right ? "md:col-start-2" : "md:col-start-1"}`}
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-display text-3xl font-semibold tracking-tight text-accent-gradient sm:text-4xl">
                  {item.year}
                </p>
                <p className="label-mono rounded-full border border-line px-2.5 py-1 text-[0.62rem] text-fg-subtle">
                  {item.kind === "founder" ? "Founder milestone" : "Group milestone"}
                </p>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-fg-muted">{item.body}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
