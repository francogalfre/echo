import type { Variants } from "motion/react";

export const durations = { fast: 0.15, base: 0.2, slow: 0.3 } as const;

export const easings = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.base, ease: easings.out } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.base, ease: easings.out },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.fast, ease: easings.out },
  },
};

export function staggerContainer(stagger = 0.04): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger } },
  };
}
