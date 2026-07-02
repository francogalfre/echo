"use client";

import * as React from "react";
import { formatCount } from "@echo/ui/lib/format";
import { cn } from "@echo/ui/lib/utils";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

type AnimatedCounterProps = {
  value: number;
  format?: (value: number) => string;
  className?: string;
};

function AnimatedCounter({
  value,
  format = formatCount,
  className,
}: AnimatedCounterProps): React.ReactElement {
  const reduced = useReducedMotion();
  const spring = useSpring(reduced ? value : 0, { stiffness: 90, damping: 24 });
  const display = useTransform(spring, (current) => format(Math.round(current)));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span data-slot="animated-counter" className={cn("tabular-nums", className)}>
      {display}
    </motion.span>
  );
}

export { AnimatedCounter };
