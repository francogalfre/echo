import { todayKey } from "./quota";
import {
  FREE_INSIGHT_DAILY_LIMIT,
  FREE_MONTHLY_FEEDBACK_LIMIT,
  FREE_PROJECT_LIMIT,
  PRO_DIGEST_DAILY_LIMIT,
  PRO_INSIGHT_DAILY_LIMIT,
  PRO_PROJECT_LIMIT,
  FREE_CHAT_DAILY_LIMIT,
  PRO_CHAT_DAILY_LIMIT,
} from "../lib/plan-limits";
import { getUsageCount } from "../services/ai-usage";
import { getDigest } from "../services/digest";
import { countFeedbackThisMonth } from "../services/feedback";
import { countOwnedOrganizations, getOrgPlan } from "../services/organization";

export type BillingOverview = {
  plan: string;
  feedback: { used: number; limit: number | null };
  insights: { used: number; limit: number };
  digests: { used: number | null; limit: number | null; lastGeneratedAt: Date | null };
  projects: { used: number; limit: number };
  chat: { used: number; limit: number };
};

export async function getBillingOverview(
  organizationId: string,
  userId: string,
): Promise<BillingOverview> {
  const day = todayKey();

  const [plan, feedbackUsed, insightsUsed, cachedDigest, projectsUsed, chatUsed] =
    await Promise.all([
      getOrgPlan(organizationId),
      countFeedbackThisMonth(organizationId),
      getUsageCount(organizationId, "insight", day),
      getDigest(organizationId),
      countOwnedOrganizations(userId),
      getUsageCount(organizationId, "chat", day),
    ]);

  const isPro = plan === "pro";
  const digestsUsed = isPro ? await getUsageCount(organizationId, "digest", day) : null;

  return {
    plan: plan ?? "free",
    feedback: {
      used: feedbackUsed,
      limit: isPro ? null : FREE_MONTHLY_FEEDBACK_LIMIT,
    },
    insights: {
      used: insightsUsed,
      limit: isPro ? PRO_INSIGHT_DAILY_LIMIT : FREE_INSIGHT_DAILY_LIMIT,
    },
    digests: {
      used: digestsUsed,
      limit: isPro ? PRO_DIGEST_DAILY_LIMIT : null,
      lastGeneratedAt: cachedDigest?.generatedAt ?? null,
    },
    projects: {
      used: projectsUsed,
      limit: isPro ? PRO_PROJECT_LIMIT : FREE_PROJECT_LIMIT,
    },
    chat: {
      used: chatUsed,
      limit: isPro ? PRO_CHAT_DAILY_LIMIT : FREE_CHAT_DAILY_LIMIT,
    },
  };
}
