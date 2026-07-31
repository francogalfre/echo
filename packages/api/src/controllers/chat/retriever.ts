import type { DigestOutput, FeedbackRetriever, SearchHit } from "@echo/ai";

import {
  countFeedbackByTag,
  countFeedbackSentiment,
  feedbackTimeSeries,
  listFeedbackByIds,
  searchFeedbackFts,
  type FeedbackSearchRow,
} from "../../services/chat/retrieval";
import { getDigest } from "../../services/feedback/digest";

function toSearchHits(rows: readonly FeedbackSearchRow[]): SearchHit[] {
  return rows.map((row) => ({
    id: row.id,
    excerpt: row.content,
    sentiment: row.sentiment,
    tags: row.tags ?? [],
    createdAt: row.createdAt.toISOString(),
  }));
}

export function buildFeedbackRetriever(organizationId: string): FeedbackRetriever {
  return {
    search: async (query, limit, sentiment) =>
      toSearchHits(
        await searchFeedbackFts(organizationId, query, limit, sentiment ?? null),
      ),

    countBySentiment: async () => {
      const rows = await countFeedbackSentiment(organizationId);
      const counts: Record<string, number> = {};
      for (const row of rows) counts[row.sentiment ?? "unspecified"] = row.count;
      return counts;
    },

    tagBreakdown: (sentiment) => countFeedbackByTag(organizationId, sentiment ?? null),

    byId: async (ids) => toSearchHits(await listFeedbackByIds(organizationId, ids)),

    timeSeries: (bucket, limit) => feedbackTimeSeries(organizationId, bucket, limit),

    readDigest: async () => {
      const record = await getDigest(organizationId);
      if (!record) return null;

      return {
        executiveSummary: record.digest.executiveSummary,
        topIssues: record.digest.topIssues,
        themes: record.digest.themes,
        positiveHighlight: record.digest.positiveHighlight,
        generatedAt: record.generatedAt.toISOString(),
      };
    },
  };
}

export function summarizeDigestForPrompt(digest: DigestOutput): string {
  const issues = digest.topIssues.slice(0, 5).join("; ") || "none flagged";

  return (
    `${digest.executiveSummary} ` +
    `Top issues: ${issues}. Positive highlight: ${digest.positiveHighlight}`
  );
}

export function createBudget(maxChars: number): (chars: number) => boolean {
  let spent = 0;

  return (chars: number) => {
    if (spent + chars > maxChars) return false;
    spent += chars;
    return true;
  };
}
