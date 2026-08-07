import type { FeedbackListItem } from "./services/feedback";

type Failure<Status extends number> = { success: false; status: Status; error: string };

export type SubmitResult = { success: true; id: string } | Failure<400 | 401 | 403 | 429>;

export type ListResult =
  | { success: true; feedback: FeedbackListItem[] }
  | Failure<401 | 403 | 429>;

export type ComponentResult = { success: true; code: string } | Failure<404>;

export type RegistryResult =
  | { success: true; registry: Record<string, unknown> }
  | Failure<404>;

export type UploadLogoResult =
  | { success: true; url: string }
  | Failure<400 | 403 | 500 | 502>;

export type InsightResult =
  | { success: true; insight: string; cached: boolean }
  | (Failure<403 | 404 | 502> & { upgrade: boolean });

export const SENTIMENT_VALUES = ["positive", "neutral", "negative"] as const;
export type Sentiment = (typeof SENTIMENT_VALUES)[number];

export const FEEDBACK_SOURCE_VALUES = ["api", "form", "widget"] as const;
export type FeedbackSource = (typeof FEEDBACK_SOURCE_VALUES)[number];

export const BOARD_COLUMN_VALUES = ["backlog", "in_progress", "done"] as const;
export type BoardColumn = (typeof BOARD_COLUMN_VALUES)[number];

export const NOTIFICATION_TYPE_VALUES = [
  "feedback.received",
  "plan.upgraded",
  "member.joined",
  "organization.created",
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPE_VALUES)[number];

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  readAt: string | Date | null;
  createdAt: string | Date;
};

export type SeriesGranularity = "day" | "month";
export type StatsRange = "7d" | "30d" | "6m" | "1y" | "all";

export type SeriesPoint = {
  bucket: string;
  positive: number;
  neutral: number;
  negative: number;
};

export type MetricValue = { value: number; growth: number | null };

export type SourceCount = { source: FeedbackSource; count: number };

export type OverviewRecentItem = {
  id: string;
  name: string;
  content: string;
  sentiment: string | null;
  source: string;
  createdAt: string;
};

export type DashboardOverview = {
  metrics: {
    total: MetricValue;
    positive: MetricValue;
    negative: MetricValue;
    thisWeek: MetricValue;
  };
  granularity: SeriesGranularity;
  series: SeriesPoint[];
  trend: SeriesPoint[];
  sources: SourceCount[];
  recent: OverviewRecentItem[];
};

export type { BoardCard, BoardColumns } from "./services/board";
