"use client";

import { Icons } from "@echo/ui/components/icons";
import { durations, easings } from "@echo/ui/lib/motion";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useId, useState } from "react";

import type { FaqItem } from "./faq";

const heightTransition = { duration: durations.slow, ease: easings.out };

const panelTransition = {
  height: heightTransition,
  opacity: { duration: durations.base, ease: easings.out },
};

const answerTransition = { duration: durations.slow, ease: easings.out, delay: 0.05 };

const instantTransition = { duration: 0 };

type FaqListProps = {
  items: readonly FaqItem[];
};

export const FaqList = ({ items }: FaqListProps): React.ReactElement => {
  const reduced = useReducedMotion();
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const baseId = useId();

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item, index) => {
        const open = item.question === openQuestion;
        const triggerId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenQuestion(open ? null : item.question)}
                className="group -mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-center justify-between gap-6 rounded-md px-2 py-5 text-left text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <span className="text-pretty transition-opacity group-hover:opacity-70">
                  {item.question}
                </span>
                <m.span
                  className="shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={reduced ? instantTransition : heightTransition}
                >
                  <Icons.chevronDown className="size-4" />
                </m.span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {open ? (
                <m.div
                  key="panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduced ? instantTransition : panelTransition}
                >
                  <m.p
                    className="max-w-2xl pb-6 text-sm text-muted-foreground text-pretty"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={reduced ? instantTransition : answerTransition}
                  >
                    {item.answer}
                  </m.p>
                </m.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
