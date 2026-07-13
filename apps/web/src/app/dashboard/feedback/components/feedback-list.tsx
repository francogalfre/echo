"use client";

import { Button } from "@echo/ui/components/button";
import { buttonVariants } from "@echo/ui/components/button-variants";
import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { toast } from "@echo/ui/components/toast";
import { staggerContainer } from "@echo/ui/lib/motion";
import { cn } from "@echo/ui/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";

import {
  useFeedback,
  type FeedbackCounts,
  type FeedbackFilters,
  type FeedbackItem,
} from "../hooks/use-feedback";
import { useFeedbackItem } from "../hooks/use-feedback-item";
import { addManyToBoard } from "../utils/feedback-actions";
import { FeedbackListSkeleton } from "./feedback-list-skeleton";
import { FeedbackRow } from "./feedback-row";
import { FeedbackSelectionBar } from "./feedback-selection-bar";
import { FeedbackSheet } from "./feedback-sheet";
import { FeedbackTableHeader } from "./feedback-table-header";
import {
  FeedbackToolbar,
  type SentimentFilter,
  type SourceFilter,
} from "./feedback-toolbar";
import { InsightDialog } from "./insight-dialog";

const SENTIMENT_VALUES = [
  "all",
  "positive",
  "neutral",
  "negative",
] as const satisfies readonly SentimentFilter[];

const SOURCE_VALUES = [
  "all",
  "api",
  "form",
  "widget",
] as const satisfies readonly SourceFilter[];

type FeedbackListProps = {
  readonly initialItems: FeedbackItem[];
  readonly initialHasMore: boolean;
  readonly initialCounts: FeedbackCounts;
  readonly initialFilters: FeedbackFilters;
};

export function FeedbackList({
  initialItems,
  initialHasMore,
  initialCounts,
  initialFilters,
}: FeedbackListProps): React.ReactElement {
  const [sentiment, setSentiment] = useQueryState(
    "sentiment",
    parseAsStringLiteral(SENTIMENT_VALUES).withDefault("all"),
  );
  const [source, setSource] = useQueryState(
    "source",
    parseAsStringLiteral(SOURCE_VALUES).withDefault("all"),
  );
  const [search, setSearch] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ throttleMs: 300 }),
  );
  const feedbackState = useFeedback(
    { sentiment, source, search },
    {
      items: initialItems,
      hasMore: initialHasMore,
      counts: initialCounts,
      filters: initialFilters,
    },
  );
  const [openId, setOpenId] = useQueryState("feedback");
  const [insightItem, setInsightItem] = useState<FeedbackItem | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const items = feedbackState.items;
  const counts: Record<SentimentFilter, number> = feedbackState.counts;
  const filtersActive = sentiment !== "all" || source !== "all" || search !== "";

  const localItem = useMemo(
    () => items.find((item) => item.id === openId) ?? null,
    [items, openId],
  );
  const remote = useFeedbackItem(!localItem && openId ? openId : null);
  const openItem = localItem ?? remote.item;

  useEffect(() => {
    if (remote.notFound) {
      void setOpenId(null);
      toast.error("That feedback could not be found");
    }
  }, [remote.notFound, setOpenId]);

  const allSelected = items.length > 0 && items.every((item) => selected.has(item.id));
  const someSelected = selected.size > 0 && !allSelected;

  const clearFilters = (): void => {
    void setSentiment("all");
    void setSource("all");
    void setSearch("");
  };

  const toggleSelect = (id: string): void => {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = (): void => {
    if (allSelected) {
      setSelected(new Set());
      return;
    }
    setSelected(new Set(items.map((item) => item.id)));
  };

  const handleBulkAddToBoard = (): void => {
    const selectedItems = items.filter((item) => selected.has(item.id));
    addManyToBoard(selectedItems);
    setSelected(new Set());
  };

  return (
    <div className="flex flex-col gap-4">
      <FeedbackToolbar
        counts={counts}
        sentiment={sentiment}
        onSentimentChange={(value) => void setSentiment(value)}
        source={source}
        onSourceChange={(value) => void setSource(value)}
        search={search}
        onSearchChange={(value) => void setSearch(value)}
      />

      <div className="overflow-x-auto overflow-y-hidden rounded-lg bg-card ring-1 ring-foreground/10">
        <div className="min-w-[48rem]">
          {feedbackState.status === "loading" && <FeedbackListSkeleton />}

          {feedbackState.status === "error" && (
            <div className="px-4 py-16 text-center">
              <Icons.alertCircle className="mx-auto size-8 text-destructive/50" />
              <p className="mt-2 text-sm font-medium text-foreground">
                Could not load feedback
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Please refresh the page.</p>
            </div>
          )}

          {feedbackState.status === "ready" && counts.all === 0 && (
            <EmptyState
              icon={<Icons.message />}
              title="No feedback yet"
              description="Once people share feedback through your API, form, or widget, it shows up here."
              action={
                <Link
                  href="/dashboard/collect"
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  Start collecting
                </Link>
              }
            />
          )}

          {feedbackState.status === "ready" && counts.all > 0 && items.length === 0 && (
            <EmptyState
              icon={<Icons.search />}
              title="No matching feedback"
              description="Nothing matches your current search or filters. Try adjusting them."
              action={
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          )}

          {feedbackState.status === "ready" && items.length > 0 && (
            <>
              <FeedbackTableHeader
                allSelected={allSelected}
                someSelected={someSelected}
                onToggleSelectAll={toggleSelectAll}
              />

              <motion.div
                role="table"
                variants={staggerContainer(0.03)}
                initial="hidden"
                animate="visible"
              >
                {items.map((item) => (
                  <FeedbackRow
                    key={item.id}
                    item={item}
                    selected={selected.has(item.id)}
                    onToggleSelect={toggleSelect}
                    onViewDetails={(selectedItem) => void setOpenId(selectedItem.id)}
                    onExplainWithAi={(selectedItem) => setInsightItem(selectedItem)}
                  />
                ))}
              </motion.div>

              {feedbackState.hasMore && (
                <div className="flex flex-col items-center gap-2 border-t border-border py-4">
                  <span className="text-xs text-muted-foreground">
                    {filtersActive
                      ? `Showing ${items.length}`
                      : `Showing ${items.length} of ${counts.all}`}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={feedbackState.loadingMore}
                    onClick={feedbackState.loadMore}
                  >
                    {feedbackState.loadingMore && (
                      <Icons.loading className="size-4 animate-spin" />
                    )}
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <FeedbackSelectionBar
        count={selected.size}
        onAddToBoard={handleBulkAddToBoard}
        onClear={() => setSelected(new Set())}
      />

      <FeedbackSheet
        item={openItem}
        open={openItem !== null}
        onOpenChange={(open) => {
          if (!open) void setOpenId(null);
        }}
        onExplainWithAi={(item) => setInsightItem(item)}
      />

      <InsightDialog
        item={insightItem}
        open={insightItem !== null}
        onOpenChange={(open) => !open && setInsightItem(null)}
      />
    </div>
  );
}
