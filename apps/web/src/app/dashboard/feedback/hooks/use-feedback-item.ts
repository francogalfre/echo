"use client";

import { trpc } from "@/lib/trpc";
import { useAsyncResource } from "@/lib/use-async-resource";

import { mapItem, type FeedbackItem } from "../utils/map-feedback";

type UseFeedbackItemResult = {
  item: FeedbackItem | null;
  loading: boolean;
  notFound: boolean;
};

export function useFeedbackItem(id: string | null): UseFeedbackItemResult {
  const { state } = useAsyncResource<FeedbackItem | null>(
    async () => {
      if (!id) return null;
      const result = await trpc.feedback.byId.query({ id });
      return result ? mapItem(result) : null;
    },
    { deps: [id] },
  );

  const readyNotFound = state.status === "ready" && id !== null && state.data === null;

  return {
    item: state.status === "ready" ? state.data : null,
    loading: state.status === "loading",
    notFound: readyNotFound || state.status === "error",
  };
}
