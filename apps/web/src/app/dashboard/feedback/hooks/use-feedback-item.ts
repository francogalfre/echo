"use client";

import { useEffect, useState } from "react";

import { trpc } from "@/lib/trpc";

import { mapItem, type FeedbackItem } from "./use-feedback";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "found"; item: FeedbackItem }
  | { status: "not-found" };

type UseFeedbackItemResult = {
  item: FeedbackItem | null;
  loading: boolean;
  notFound: boolean;
};

export function useFeedbackItem(id: string | null): UseFeedbackItemResult {
  const [state, setState] = useState<State>({ status: "idle" });

  useEffect(() => {
    if (!id) {
      setState({ status: "idle" });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    trpc.feedback.byId
      .query({ id })
      .then((result) => {
        if (cancelled) return;
        setState(
          result ? { status: "found", item: mapItem(result) } : { status: "not-found" },
        );
      })
      .catch(() => {
        if (!cancelled) setState({ status: "not-found" });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return {
    item: state.status === "found" ? state.item : null,
    loading: state.status === "loading",
    notFound: state.status === "not-found",
  };
}
