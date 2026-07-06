"use client";

import { Button } from "@echo/ui/components/button";
import { buttonVariants } from "@echo/ui/components/button-variants";
import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { Skeleton } from "@echo/ui/components/skeleton";
import { staggerContainer } from "@echo/ui/lib/motion";
import { cn } from "@echo/ui/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

import { useFeedback, type FeedbackItem } from "../hooks/use-feedback";
import { addManyToBoard } from "../utils/feedback-actions";
import { FeedbackRow } from "./feedback-row";
import { FeedbackSheet } from "./feedback-sheet";
import { FEEDBACK_TABLE_GRID } from "./feedback-table-grid";
import { FeedbackTableHeader } from "./feedback-table-header";
import {
  FeedbackToolbar,
  type SentimentFilter,
  type SourceFilter,
} from "./feedback-toolbar";

type SheetState = { item: FeedbackItem; autoGenerate: boolean };

function FeedbackListSkeleton(): React.ReactElement {
  return (
    <div>
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          className={cn(FEEDBACK_TABLE_GRID, "border-b border-border py-4 last:border-0")}
        >
          <Skeleton className="size-4 shrink-0 rounded-sm" />
          <Skeleton className="h-3 w-24 shrink-0 rounded" />
          <Skeleton className="h-3 flex-1 rounded" />
          <Skeleton className="h-4 w-14 shrink-0 rounded-full" />
          <Skeleton className="h-4 w-12 shrink-0 rounded-full" />
          <Skeleton className="h-3 w-10 shrink-0 rounded" />
          <Skeleton className="size-4 shrink-0 rounded" />
        </div>
      ))}
    </div>
  );
}

export function FeedbackList(): React.ReactElement {
  const feedbackState = useFeedback();
  const [sentiment, setSentiment] = useState<SentimentFilter>("all");
  const [source, setSource] = useState<SourceFilter>("all");
  const [search, setSearch] = useState("");
  const [sheetState, setSheetState] = useState<SheetState | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const items = feedbackState.status === "ready" ? feedbackState.items : [];

  const counts: Record<SentimentFilter, number> = {
    all: items.length,
    positive: items.filter((item) => item.sentiment === "positive").length,
    neutral: items.filter((item) => item.sentiment === "neutral").length,
    negative: items.filter((item) => item.sentiment === "negative").length,
  };

  const filtered = items.filter((item) => {
    const matchesSentiment = sentiment === "all" || item.sentiment === sentiment;
    const matchesSource = source === "all" || item.source === source;
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.feedback.toLowerCase().includes(query);
    return matchesSentiment && matchesSource && matchesSearch;
  });

  const allSelected =
    filtered.length > 0 && filtered.every((item) => selected.has(item.id));
  const someSelected = selected.size > 0 && !allSelected;

  const clearFilters = (): void => {
    setSentiment("all");
    setSource("all");
    setSearch("");
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
    setSelected(new Set(filtered.map((item) => item.id)));
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
        onSentimentChange={setSentiment}
        source={source}
        onSourceChange={setSource}
        search={search}
        onSearchChange={setSearch}
      />

      <div className="overflow-x-auto overflow-y-hidden rounded-lg bg-card ring-1 ring-foreground/10">
        <div className="min-w-[42rem]">
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

          {feedbackState.status === "ready" && items.length === 0 && (
            <EmptyState
              icon={<Icons.message />}
              title="No feedback yet"
              description="Feedback will appear here once received."
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

          {feedbackState.status === "ready" &&
            items.length > 0 &&
            filtered.length === 0 && (
              <EmptyState
                icon={<Icons.search />}
                title="No matching feedback"
                description="Try a different search term or filter."
                action={
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                }
              />
            )}

          {feedbackState.status === "ready" && filtered.length > 0 && (
            <>
              {selected.size > 0 ? (
                <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
                  <span className="text-xs font-medium">{selected.size} selected</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleBulkAddToBoard}>
                      Add to board
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelected(new Set())}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              ) : (
                <FeedbackTableHeader
                  allSelected={allSelected}
                  someSelected={someSelected}
                  onToggleSelectAll={toggleSelectAll}
                />
              )}

              <motion.div
                role="table"
                variants={staggerContainer(0.03)}
                initial="hidden"
                animate="visible"
              >
                {filtered.map((item) => (
                  <FeedbackRow
                    key={item.id}
                    item={item}
                    selected={selected.has(item.id)}
                    onToggleSelect={toggleSelect}
                    onViewDetails={(selectedItem) =>
                      setSheetState({ item: selectedItem, autoGenerate: false })
                    }
                    onExplainWithAi={(selectedItem) =>
                      setSheetState({ item: selectedItem, autoGenerate: true })
                    }
                  />
                ))}
              </motion.div>
            </>
          )}
        </div>
      </div>

      <FeedbackSheet
        item={sheetState?.item ?? null}
        open={sheetState !== null}
        onOpenChange={(open) => {
          if (!open) setSheetState(null);
        }}
        autoGenerateInsight={sheetState?.autoGenerate ?? false}
      />
    </div>
  );
}
