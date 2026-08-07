import type { FeedbackSource, Sentiment } from "@echo/api/types";

import { reviveDate } from "@/utils/serialize";

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
  onBoard: boolean;
  createdAt: Date;
};

export type FeedbackCounts = {
  all: number;
  positive: number;
  neutral: number;
  negative: number;
};

export type FeedbackFilters = {
  sentiment: "all" | Sentiment;
  source: "all" | FeedbackSource;
  search: string;
};

export type FeedbackInitialData = {
  items: FeedbackItem[];
  hasMore: boolean;
  counts: FeedbackCounts;
  filters: FeedbackFilters;
};

type SerializedFeedbackItem = Omit<FeedbackItem, "createdAt"> & {
  createdAt: string | Date;
};

export function mapItem(item: SerializedFeedbackItem): FeedbackItem {
  return { ...item, createdAt: reviveDate(item.createdAt) };
}
