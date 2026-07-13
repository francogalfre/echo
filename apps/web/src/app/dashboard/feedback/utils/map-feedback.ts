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
  return { ...item, createdAt: new Date(item.createdAt) };
}
