import { createServerTrpc } from "@/lib/trpc-server";

import { mapItem, type FeedbackFilters } from "../hooks/use-feedback";
import { FeedbackList } from "./feedback-list";

type FeedbackListDataProps = {
  readonly filters: FeedbackFilters;
};

export async function FeedbackListData({
  filters,
}: FeedbackListDataProps): Promise<React.ReactElement> {
  const api = await createServerTrpc();

  const [list, counts] = await Promise.all([
    api.feedback.list.query({
      sentiment: filters.sentiment === "all" ? undefined : filters.sentiment,
      source: filters.source === "all" ? undefined : filters.source,
      search: filters.search || undefined,
      limit: 50,
      offset: 0,
    }),
    api.feedback.counts.query(),
  ]);

  return (
    <FeedbackList
      initialItems={list.items.map(mapItem)}
      initialHasMore={list.hasMore}
      initialCounts={counts}
      initialFilters={filters}
    />
  );
}
