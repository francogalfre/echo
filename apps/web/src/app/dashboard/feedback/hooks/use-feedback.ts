"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "@echo/ui/components/toast";

import { trpc } from "@/lib/trpc";

export type FeedbackItem = {
  id: string;
  name: string;
  feedback: string;
  email: string | null;
  rating: number | null;
  source: string;
  sentiment: string | null;
  tags: string[] | null;
  hasInsight: boolean;
  createdAt: Date;
};

export type FeedbackCounts = {
  all: number;
  positive: number;
  neutral: number;
  negative: number;
};

export type FeedbackFilters = {
  sentiment: "all" | "positive" | "neutral" | "negative";
  source: "all" | "api" | "form" | "widget";
  search: string;
};

type State =
  | { status: "loading" }
  | { status: "ready"; items: FeedbackItem[] }
  | { status: "error" };

type UseFeedbackResult = {
  status: State["status"];
  items: FeedbackItem[];
  counts: FeedbackCounts;
  hasMore: boolean;
  loadingMore: boolean;
  loadMore: () => void;
};

const LIMIT = 50;
const DEFAULT_COUNTS: FeedbackCounts = { all: 0, positive: 0, neutral: 0, negative: 0 };

function toQueryInput(
  filters: FeedbackFilters,
  offset: number,
): {
  sentiment?: "positive" | "neutral" | "negative";
  source?: "api" | "form" | "widget";
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

function mapItem(item: {
  id: string;
  name: string;
  feedback: string;
  email: string | null;
  rating: number | null;
  source: string;
  sentiment: string | null;
  tags: string[] | null;
  hasInsight: boolean;
  createdAt: string | Date;
}): FeedbackItem {
  return { ...item, createdAt: new Date(item.createdAt) };
}

export function useFeedback(filters: FeedbackFilters): UseFeedbackResult {
  const { sentiment, source, search } = filters;
  const [state, setState] = useState<State>({ status: "loading" });
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [counts, setCounts] = useState<FeedbackCounts>(DEFAULT_COUNTS);
  const offsetRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let attempt = 0;
    const maxAttempts = 3;
    offsetRef.current = 0;

    const load = (): void => {
      Promise.all([
        trpc.feedback.list.query(toQueryInput({ sentiment, source, search }, 0)),
        trpc.feedback.counts.query(),
      ])
        .then(([listResult, countsResult]) => {
          if (cancelled) return;
          setState({ status: "ready", items: listResult.items.map(mapItem) });
          setHasMore(listResult.hasMore);
          setCounts(countsResult);
        })
        .catch(() => {
          if (cancelled) return;
          attempt += 1;
          if (attempt < maxAttempts) {
            setTimeout(load, attempt * 800);
          } else {
            toast.error("Failed to load feedback");
            setState({ status: "error" });
          }
        });
    };

    setState({ status: "loading" });
    load();

    return () => {
      cancelled = true;
    };
  }, [sentiment, source, search]);

  const loadMore = (): void => {
    if (loadingMore || !hasMore || state.status !== "ready") return;

    const nextOffset = offsetRef.current + LIMIT;
    setLoadingMore(true);

    trpc.feedback.list
      .query(toQueryInput({ sentiment, source, search }, nextOffset))
      .then((result) => {
        offsetRef.current = nextOffset;
        setHasMore(result.hasMore);
        setState((previous) =>
          previous.status === "ready"
            ? { status: "ready", items: [...previous.items, ...result.items.map(mapItem)] }
            : previous,
        );
      })
      .catch(() => {
        toast.error("Failed to load more feedback");
      })
      .finally(() => {
        setLoadingMore(false);
      });
  };

  return {
    status: state.status,
    items: state.status === "ready" ? state.items : [],
    counts,
    hasMore,
    loadingMore,
    loadMore,
  };
}
