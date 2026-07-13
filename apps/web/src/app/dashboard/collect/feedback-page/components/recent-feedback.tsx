"use client";

import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { durations, easings } from "@echo/ui/lib/motion";
import { motion, useReducedMotion } from "motion/react";

export type FeedbackItem = {
  id: string;
  authorName: string;
  content: string;
  rating: number | null;
};

const RATING_STARS = [1, 2, 3, 4, 5] as const;
const PREVIEW_LIMIT = 3;

type RecentFeedbackProps = {
  accentColor: string;
  items: FeedbackItem[];
};

export const RecentFeedback = ({
  accentColor,
  items,
}: RecentFeedbackProps): React.ReactElement => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <aside className="pt-14">
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-sm font-semibold text-foreground">Recent feedback</p>
        {items.length > 0 && (
          <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-muted-foreground">
            {items.length}
          </span>
        )}
      </div>

      {items.length === 0 && (
        <div className="rounded-xl border border-dashed border-border">
          <EmptyState
            icon={<Icons.message />}
            title="No feedback yet"
            description="Responses to your page will show up here."
          />
        </div>
      )}

      <div className="space-y-3">
        {items.slice(0, PREVIEW_LIMIT).map((item) => {
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
                      <Icons.star key={star} className="size-3.5" />
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

      {items.length > PREVIEW_LIMIT && (
        <button
          type="button"
          aria-disabled="true"
          className="mt-3 w-full cursor-default rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground"
        >
          Load more
        </button>
      )}
    </aside>
  );
};
