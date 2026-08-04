import { tool, type ToolSet, type UIMessage } from "ai";
import { z } from "zod";

export type SearchHit = {
  readonly id: string;
  readonly excerpt: string;
  readonly sentiment: string | null;
  readonly tags: readonly string[];
  readonly createdAt: string;
};

export type SeriesPoint = {
  readonly period: string;
  readonly total: number;
  readonly positive: number;
  readonly negative: number;
};

export type CachedDigest = {
  readonly executiveSummary: string;
  readonly topIssues: readonly string[];
  readonly themes: readonly { title: string; count: number; insight: string }[];
  readonly positiveHighlight: string;
  readonly generatedAt: string;
};

export type FeedbackRetriever = {
  readonly search: (
    query: string,
    limit: number,
    sentiment?: string,
  ) => Promise<readonly SearchHit[]>;
  readonly countBySentiment: () => Promise<Readonly<Record<string, number>>>;
  readonly tagBreakdown: (
    sentiment?: string,
  ) => Promise<readonly { tag: string; count: number }[]>;
  readonly byId: (ids: readonly string[]) => Promise<readonly SearchHit[]>;
  readonly timeSeries: (
    bucket: "day" | "week" | "month",
    limit: number,
  ) => Promise<readonly SeriesPoint[]>;
  readonly readDigest: () => Promise<CachedDigest | null>;
};

export type ChatStreamInput = {
  readonly messages: readonly UIMessage[];
  readonly digestSummary: string | null;
  readonly retriever: FeedbackRetriever;
  readonly spendBudget: (chars: number) => boolean;
};

const excerptLimit = 240;
const maxSearchLimit = 20;
const maxByIdCount = 20;
const maxTimeSeriesLimit = 90;

function truncateExcerpt(content: string): string {
  return content.length > excerptLimit ? `${content.slice(0, excerptLimit)}…` : content;
}

function toSearchOutput(hits: readonly SearchHit[]): readonly SearchHit[] {
  return hits.map((hit) => ({ ...hit, excerpt: truncateExcerpt(hit.excerpt) }));
}

function withBudget<T>(
  spendBudget: (chars: number) => boolean,
  output: T,
): T | { truncated: true } {
  const chars = JSON.stringify(output).length;
  if (!spendBudget(chars)) return { truncated: true };
  return output;
}

export function buildFeedbackTools(
  retriever: FeedbackRetriever,
  spendBudget: (chars: number) => boolean,
): ToolSet {
  return {
    searchFeedback: tool({
      description:
        "Full-text search across the organization's feedback. Use this to find feedback " +
        "matching a topic, keyword, or complaint.",
      inputSchema: z.object({
        query: z.string().min(1).max(200),
        sentiment: z.enum(["positive", "neutral", "negative"]).optional(),
        limit: z.number().int().min(1).max(maxSearchLimit).optional(),
      }),
      execute: async ({ query, sentiment, limit }) => {
        const hits = await retriever.search(query, limit ?? 10, sentiment);
        return withBudget(spendBudget, { results: toSearchOutput(hits) });
      },
    }),

    countFeedback: tool({
      description:
        "Count feedback grouped by sentiment, tag, day, or week. Use this for questions " +
        "asking 'how many'.",
      inputSchema: z.object({
        groupBy: z.enum(["sentiment", "tag", "day", "week"]),
        sentiment: z.enum(["positive", "neutral", "negative"]).optional(),
      }),
      execute: async ({ groupBy, sentiment }) => {
        if (groupBy === "sentiment") {
          return withBudget(spendBudget, { counts: await retriever.countBySentiment() });
        }
        if (groupBy === "tag") {
          return withBudget(spendBudget, {
            counts: await retriever.tagBreakdown(sentiment),
          });
        }
        return withBudget(spendBudget, { series: await retriever.timeSeries(groupBy, 30) });
      },
    }),

    getFeedbackById: tool({
      description:
        "Fetch full feedback rows by id, e.g. after a search to quote them exactly.",
      inputSchema: z.object({
        ids: z.array(z.string().min(1)).min(1).max(maxByIdCount),
      }),
      execute: async ({ ids }) => {
        const hits = await retriever.byId(ids);
        return withBudget(spendBudget, { results: toSearchOutput(hits) });
      },
    }),

    getTimeSeries: tool({
      description:
        "Get feedback volume and sentiment split over time, bucketed by day/week/month.",
      inputSchema: z.object({
        bucket: z.enum(["day", "week", "month"]),
        limit: z.number().int().min(1).max(maxTimeSeriesLimit).optional(),
      }),
      execute: async ({ bucket, limit }) => {
        const series = await retriever.timeSeries(bucket, limit ?? 30);
        return withBudget(spendBudget, { series });
      },
    }),

    readDigest: tool({
      description:
        "Read the most recently generated feedback digest (executive summary, themes, " +
        "top issues) if one exists.",
      inputSchema: z.object({}),
      execute: async () => {
        const digest = await retriever.readDigest();
        if (!digest) return { available: false as const };
        return withBudget(spendBudget, { available: true as const, digest });
      },
    }),
  };
}
