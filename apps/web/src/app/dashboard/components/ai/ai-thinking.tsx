"use client";

import { Diamond } from "@echo/ui/components/diamond";
import { durations, easings } from "@echo/ui/lib/motion";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

type AiThinkingProps = {
  phrases: readonly string[];
  children?: React.ReactNode;
};

const PHRASE_INTERVAL_MS = 2000;

export function AiThinking({ phrases, children }: AiThinkingProps): React.ReactElement {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (phrases.length < 2) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, PHRASE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [phrases.length]);

  return (
    <div className="flex flex-col gap-4">
      <div role="status" aria-live="polite" className="flex items-center gap-3">
        <Diamond className="size-6 text-muted-foreground" />
        {reduced ? (
          <span className="font-pixel text-xs text-muted-foreground">{phrases[index]}</span>
        ) : (
          <AnimatePresence mode="wait">
            <motion.span
              key={phrases[index]}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: durations.base, ease: easings.out }}
              className="font-pixel text-xs text-muted-foreground"
            >
              {phrases[index]}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}
