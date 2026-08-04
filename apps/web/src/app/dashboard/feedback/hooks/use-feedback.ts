"use client";

import { useEffect, useRef, useState } from "react";
import type { FeedbackSource, Sentiment } from "@echo/api/types";
import { toast } from "@echo/ui/components/toast";

import { trpc } from "@/lib/trpc";
import { useAsyncResource } from "@/lib/use-async-resource";

import {
  mapItem,
  type FeedbackCounts,
  type FeedbackFilters,
  type FeedbackInitialData,
  type FeedbackItem,
} from "../utils/map-feedback";

type FeedbackPage = {
  items: FeedbackItem[];
  counts: FeedbackCounts;
  hasMore: boolean;
};

type UseFeedbackResult = {
  status: "loading" | "ready" | "error";
  items: FeedbackItem[];
  counts: FeedbackCounts;
  hasMore: boolean;
  loadingMore: boolean;
  pending: boolean;
  loadMore: () => void;
  removeItems: (ids: readonly string[]) => void;
};

const LIMIT = 50;

function toQueryInput(
  filters: FeedbackFilters,
  offset: number,
): {
  sentiment?: Sentiment;
  source?: FeedbackSource;
  search?: string;
  limit: number;
  offset: number;
} {
  return {
    sentiment: filters.sentiment === "all" ? undefined : filters.sentiment,
    source: filters.source === "all" ? undefined : filters.source,
    search: filters.search || undefined,
    limit: LIMIT,
    offset,
  };
}

export function useFeedback(
  filters: FeedbackFilters,
  initial: FeedbackInitialData,
): UseFeedbackResult {
  const { sentiment, source, search } = filters;
  const [loadingMore, setLoadingMore] = useState(false);
  const [appended, setAppended] = useState<FeedbackItem[]>([]);
  const [hasMoreOverride, setHasMoreOverride] = useState<boolean | null>(null);
  const offsetRef = useRef(0);
  const previousStatusRef = useRef<"loading" | "ready" | "error">("ready");

  const { state, refresh } = useAsyncResource<FeedbackPage>(
    async () => {
      const [listResult, countsResult] = await Promise.all([
        trpc.feedback.list.query(toQueryInput({ sentiment, source, search }, 0)),
        trpc.feedback.counts.query({
          source: source === "all" ? undefined : source,
          search: search || undefined,
        }),
      ]);
      return {
        items: listResult.items.map(mapItem),
        counts: countsResult,
        hasMore: listResult.hasMore,
      };
    },
    {
      initialData: {
        items: initial.items,
        counts: initial.counts,
        hasMore: initial.hasMore,
      },
      deps: [sentiment, source, search],
    },
  );

  useEffect(() => {
    offsetRef.current = 0;
    setAppended([]);
    setHasMoreOverride(null);
  }, [sentiment, source, search]);

  useEffect(() => {
    if (state.status === "error" && previousStatusRef.current !== "error") {
      toast.error("Failed to load feedback");
    }
    previousStatusRef.current = state.status;
  }, [state.status]);

  const loadMore = (): void => {
    if (loadingMore || state.status !== "ready") return;
    const currentHasMore = hasMoreOverride ?? state.data.hasMore;
    if (!currentHasMore) return;

    const nextOffset = offsetRef.current + LIMIT;
    setLoadingMore(true);

    trpc.feedback.list
      .query(toQueryInput({ sentiment, source, search }, nextOffset))
      .then((result) => {
        offsetRef.current = nextOffset;
        setHasMoreOverride(result.hasMore);
        setAppended((previous) => [...previous, ...result.items.map(mapItem)]);
      })
      .catch(() => {
        toast.error("Failed to load more feedback");
      })
      .finally(() => {
        setLoadingMore(false);
      });
  };

  const removeItems = (ids: readonly string[]): void => {
    setAppended((previous) => previous.filter((item) => !ids.includes(item.id)));
    refresh();
  };

  return {
    status: state.status,
    items: state.status === "ready" ? [...state.data.items, ...appended] : [],
    counts: state.status === "ready" ? state.data.counts : initial.counts,
    hasMore:
      hasMoreOverride ?? (state.status === "ready" ? state.data.hasMore : initial.hasMore),
    loadingMore,
    pending: state.status === "ready" && state.pending,
    loadMore,
    removeItems,
  };
}
