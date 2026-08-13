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
      lerp: 0.065,
      anchors: { offset: -72 },
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      syncTouch: true,
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
