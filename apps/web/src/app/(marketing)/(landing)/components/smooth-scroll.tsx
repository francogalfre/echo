"use client";

import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { useEffect } from "react";

import "lenis/dist/lenis.css";

export const SmoothScroll = (): null => {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      lerp: 0.12,
      anchors: { offset: -72 },
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    let frame = requestAnimationFrame(function raf(time: number): void {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
};
