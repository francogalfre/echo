"use client";

import { useReducedMotion } from "motion/react";
import { useEffect } from "react";
import type LenisInstance from "lenis";

import "lenis/dist/lenis.css";

export const SmoothScroll = (): null => {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      return;
    }

    let cancelled = false;
    let frame = 0;
    let lenis: LenisInstance | undefined = undefined;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) {
        return;
      }

      lenis = new Lenis({
        lerp: 0.065,
        anchors: { offset: -72 },
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
        syncTouch: true,
      });

      frame = requestAnimationFrame(function raf(time: number): void {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, [reduced]);

  return null;
};
