"use client";

import { Icons } from "@echo/ui/components/icons";
import { durations, easings } from "@echo/ui/lib/motion";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { trpc } from "@/lib/trpc";

type FeedbackItem = {
  id: string;
  authorName: string;
  content: string;
  rating: number | null;
};

const RATING_STARS = [1, 2, 3, 4, 5] as const;
const PAGE_SIZE = 4;

type RecentFeedbackProps = {
  accentColor: string;
};

export const RecentFeedback = ({
  accentColor,
}: RecentFeedbackProps): React.ReactElement => {
  const [items, setItems] = useState<FeedbackItem[] | null>(null);
  const [hasError, setHasError] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    trpc.feedbackPage.recentFeedback
      .query()
      .then(setItems)
      .catch(() => {
        setHasError(true);
        setItems([]);
      });
  }, []);

  return (
    <aside className="pt-14">
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-sm font-semibold text-foreground">Recent feedback</p>
        {items !== null && items.length > 0 && (
          <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-muted-foreground">
            {items.length}
          </span>
        )}
      </div>

      {items === null && (
        <div className="flex justify-center py-8">
          <Icons.loading className="size-4 animate-spin text-muted-foreground" />
        </div>
      )}

      {hasError && (
        <div className="rounded-xl border border-dashed border-destructive/40 px-4 py-10 text-center">
          <p className="text-sm font-medium text-foreground">Couldn&apos;t load feedback</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Please try again in a moment.
          </p>
        </div>
      )}

      {!hasError && items !== null && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center">
          <p className="text-sm font-medium text-foreground">No feedback yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Responses to your page will show up here.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {items?.slice(0, visibleCount).map((item) => {
          const rating = item.rating;
          return (
            <motion.div
              key={item.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: durations.slow, ease: easings.out }}
              className="rounded-xl border border-border bg-card p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-foreground/15"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {item.authorName.charAt(0).toUpperCase()}
                </span>
                <span className="truncate text-sm font-medium text-foreground">
                  {item.authorName}
                </span>
                {rating !== null && (
                  <span
                    className="ml-auto flex items-center gap-0.5 text-xs"
                    style={{ color: accentColor }}
                  >
                    {RATING_STARS.filter((star) => star <= rating).map((star) => (
                      <span key={star}>★</span>
                    ))}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.content}
              </p>
            </motion.div>
          );
        })}
      </div>

      {items !== null && items.length > visibleCount && (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          className="mt-3 w-full rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Load more
        </button>
      )}
    </aside>
  );
};
