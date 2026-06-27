"use client";

import { useState } from "react";

type FeedbackItem = {
  id: string;
  authorName: string;
  content: string;
  rating: number | null;
};

type FeedbackCardsProps = {
  items: readonly FeedbackItem[];
  accentColor: string;
};

const RATING_STARS = [1, 2, 3, 4, 5] as const;
const PAGE_SIZE = 4;

export const FeedbackCards = ({
  items,
  accentColor,
}: FeedbackCardsProps): React.ReactElement => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  return (
    <aside>
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-sm font-semibold text-foreground">Recent feedback</p>
        <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-muted-foreground">
          {items.length}
        </span>
      </div>

      <div className="space-y-3">
        {items.slice(0, visibleCount).map((item) => {
          const rating = item.rating;
          return (
            <div
              key={item.id}
              className="rounded-xl border border-black/5 bg-white p-4 dark:bg-card"
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
            </div>
          );
        })}
      </div>

      {items.length > visibleCount && (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          className="mt-3 w-full rounded-lg border border-black/10 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground dark:border-white/10"
        >
          Load more
        </button>
      )}
    </aside>
  );
};
