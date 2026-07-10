"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@echo/ui/lib/utils";

type PressProps = {
  children: ReactNode;
  className?: string;
};

export function Press({ children, className }: PressProps): React.ReactElement {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={cn("inline-flex", className)}>{children}</div>;
  }

  return (
    <motion.div className={cn("inline-flex", className)} whileTap={{ scale: 0.96 }}>
      {children}
    </motion.div>
  );
}
