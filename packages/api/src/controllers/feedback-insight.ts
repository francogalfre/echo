import { generateInsight } from "@echo/ai";

import { FREE_INSIGHT_DAILY_LIMIT, PRO_INSIGHT_DAILY_LIMIT } from "../lib/plan-limits";
import { getUsageCount, incrementUsage } from "../services/ai-usage";
import { getFeedbackById, setFeedbackInsight } from "../services/feedback";
import { getOrgPlan } from "../services/organization";
import type { InsightResult } from "../types";

const INSIGHT_FEATURE = "insight";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function generateFeedbackInsight(
  organizationId: string,
  feedbackId: string,
): Promise<InsightResult> {
  const target = await getFeedbackById(feedbackId, organizationId);
  if (!target) {
    return { success: false, status: 404, error: "Feedback not found" };
  }

  if (target.insight) {
    return { success: true, insight: target.insight, cached: true };
  }

  const plan = await getOrgPlan(organizationId);
  const isPro = plan === "pro";
  const day = todayKey();
  const limit = isPro ? PRO_INSIGHT_DAILY_LIMIT : FREE_INSIGHT_DAILY_LIMIT;

  const used = await getUsageCount(organizationId, INSIGHT_FEATURE, day);
  if (used >= limit) {
    return {
      success: false,
      status: 403,
      error: isPro
        ? `Daily insight limit (${PRO_INSIGHT_DAILY_LIMIT}) reached.`
        : `Daily insight limit reached. Upgrade to Pro for more.`,
    };
  }

  let insight: string;

  try {
    insight = await generateInsight({
      content: target.content,
      sentiment: target.sentiment,
    });
  } catch (error) {
    console.error(`[echo:ai] failed to generate insight for ${feedbackId}`, error);
    return { success: false, status: 502, error: "Could not generate insight, try again." };
  }

  await setFeedbackInsight(feedbackId, insight);
  await incrementUsage(organizationId, INSIGHT_FEATURE, day);

  return { success: true, insight, cached: false };
}
