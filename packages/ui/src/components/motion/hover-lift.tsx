"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { durations, easings } from "@echo/ui/lib/motion";
import { cn } from "@echo/ui/lib/utils";

type HoverLiftProps = {
  children: ReactNode;
  className?: string;
};

export function HoverLift({ children, className }: HoverLiftProps): React.ReactElement {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("transition-shadow duration-200 hover:shadow-md", className)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: durations.fast, ease: easings.out }}
    >
      {children}
    </motion.div>
  );
}
