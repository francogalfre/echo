import { generateInsight } from "@echo/ai";

import { getUsageCount, incrementUsage } from "../services/ai-usage";
import { getFeedbackById, setFeedbackInsight } from "../services/feedback";
import { getOrgPlan } from "../services/organization";
import type { InsightResult } from "../types";

const INSIGHT_FEATURE = "insight";
const FREE_DAILY_LIMIT = 3;

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
  const isFree = plan !== "pro";
  const day = todayKey();

  if (isFree) {
    const used = await getUsageCount(organizationId, INSIGHT_FEATURE, day);
    if (used >= FREE_DAILY_LIMIT) {
      return {
        success: false,
        status: 403,
        error: "Daily insight limit reached. Upgrade to Pro for unlimited insights.",
      };
    }
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
  if (isFree) {
    await incrementUsage(organizationId, INSIGHT_FEATURE, day);
  }

  return { success: true, insight, cached: false };
}
