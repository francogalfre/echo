"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { Icons } from "@echo/ui/components/icons";

type AiThinkingProps = {
  phrases: readonly string[];
  children: React.ReactNode;
};

const PHRASE_INTERVAL_MS = 2000;

export function AiThinking({ phrases, children }: AiThinkingProps): React.ReactElement {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion || phrases.length < 2) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, PHRASE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [shouldReduceMotion, phrases.length]);

  return (
    <div className="flex flex-col gap-4">
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground"
      >
        <motion.span
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent"
          animate={shouldReduceMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <Icons.aiMagic className="size-3.5" />
        </motion.span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={phrases[index]}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          >
            {phrases[index]}
          </motion.span>
        </AnimatePresence>
      </div>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}
