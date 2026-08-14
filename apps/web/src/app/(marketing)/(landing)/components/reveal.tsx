"use client";

import { easings } from "@echo/ui/lib/motion";
import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const container = (delay: number) => ({
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 + delay } },
});

const item = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: easings.out },
  },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  onLoad?: boolean;
  delay?: number;
};

export const Reveal = ({
  children,
  className,
  onLoad = false,
  delay = 0,
}: RevealProps): React.ReactElement => {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      variants={container(delay)}
      initial="hidden"
      {...(onLoad
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: { once: true, margin: "-80px" } })}
    >
      {children}
    </m.div>
  );
};

type RevealItemProps = {
  children: ReactNode;
  className?: string;
};

export const RevealItem = ({
  children,
  className,
}: RevealItemProps): React.ReactElement => {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div className={className} variants={item}>
      {children}
    </m.div>
  );
};
