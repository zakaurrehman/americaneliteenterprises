"use client";

import { LazyMotion } from "motion/react";

// Animation features (including layout animations) load after hydration,
// keeping Motion out of the critical rendering path.
const loadFeatures = () => import("./features").then((mod) => mod.default);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
