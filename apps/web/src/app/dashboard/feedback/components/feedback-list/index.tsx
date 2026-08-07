"use client";

import { useEffect, useMemo } from "react";
import { Button } from "@echo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@echo/ui/components/dialog";
import { toast } from "@echo/ui/components/toast";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";

import { useDeleteFeedback } from "../../hooks/use-delete-feedback";
import { useFeedback } from "../../hooks/use-feedback";
import { useFeedbackItem } from "../../hooks/use-feedback-item";
import type {
  FeedbackCounts,
  FeedbackFilters,
  FeedbackItem,
} from "../../utils/map-feedback";
import { addToBoard, removeFromBoard } from "../../utils/feedback-actions";
import { FeedbackDialog } from "../feedback-dialog";
import { FeedbackSelectionBar } from "../feedback-selection-bar";
import {
  FeedbackToolbar,
  type SentimentFilter,
  type SourceFilter,
} from "../feedback-toolbar";
import { FeedbackListBody } from "./feedback-list-body";
import { useFeedbackSelection } from "./use-feedback-selection";

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
  const selection = useFeedbackSelection(
    feedbackState.items,
    feedbackState.removeItems,
    feedbackState.refresh,
  );
  const deleteFeedbackState = useDeleteFeedback(feedbackState.removeItems);

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

  const clearFilters = (): void => {
    void setSentiment("all");
    void setSource("all");
    void setSearch("");
  };

  const handleToggleBoard = (item: FeedbackItem): void => {
    const onSuccess = (): void => {
      feedbackState.refresh();
      remote.refresh();
    };

    if (item.onBoard) {
      removeFromBoard(item, onSuccess);
    } else {
      addToBoard(item, onSuccess);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <FeedbackToolbar
        counts={counts}
        pending={feedbackState.pending}
        sentiment={sentiment}
        onSentimentChange={(value) => void setSentiment(value)}
        source={source}
        onSourceChange={(value) => void setSource(value)}
        search={search}
        onSearchChange={(value) => void setSearch(value)}
      />

      <FeedbackListBody
        status={feedbackState.status}
        items={items}
        counts={counts}
        pending={feedbackState.pending}
        hasMore={feedbackState.hasMore}
        loadingMore={feedbackState.loadingMore}
        loadMore={feedbackState.loadMore}
        filtersActive={filtersActive}
        selected={selection.selected}
        allSelected={selection.allSelected}
        someSelected={selection.someSelected}
        onToggleSelect={selection.toggleSelect}
        onToggleSelectAll={selection.toggleSelectAll}
        onViewDetails={(selectedItem) => void setOpenId(selectedItem.id)}
        onDelete={deleteFeedbackState.requestDelete}
        onToggleBoard={handleToggleBoard}
        onClearFilters={clearFilters}
      />

      <FeedbackSelectionBar
        count={selection.selected.size}
        onAddToBoard={selection.bulkAddToBoard}
        onDelete={() => void selection.bulkDelete()}
        onClear={selection.clear}
      />

      <FeedbackDialog
        item={openItem}
        open={openItem !== null}
        onOpenChange={(open) => {
          if (!open) void setOpenId(null);
        }}
        onRemoveFromBoard={
          openItem?.onBoard ? () => handleToggleBoard(openItem) : undefined
        }
        onAddToBoard={
          openItem && !openItem.onBoard ? () => handleToggleBoard(openItem) : undefined
        }
      />

      <Dialog
        open={deleteFeedbackState.pendingItem !== null}
        onOpenChange={(open) => {
          if (!open) deleteFeedbackState.cancelDelete();
        }}
      >
        <DialogContent className="gap-6 p-8 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Delete feedback from {deleteFeedbackState.pendingItem?.name}?
            </DialogTitle>
            <DialogDescription>
              This permanently deletes the feedback and cannot be undone. If it&apos;s on
              the board, it will be removed from there too.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button
              variant="destructive"
              onClick={() => void deleteFeedbackState.confirmDelete()}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
