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

const INSIGHT_FEATURE = "insight";
const DIGEST_FEATURE = "digest";
const CHAT_FEATURE = "chat";

export type BillingOverview = {
  plan: string;
  feedback: { used: number; limit: number | null };
  insights: { used: number; limit: number };
  digests: { used: number | null; limit: number | null; lastGeneratedAt: Date | null };
  projects: { used: number; limit: number };
  chat: { used: number; limit: number };
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getBillingOverview(
  organizationId: string,
  userId: string,
): Promise<BillingOverview> {
  const day = todayKey();

  const [plan, feedbackUsed, insightsUsed, cachedDigest, projectsUsed, chatUsed] =
    await Promise.all([
      getOrgPlan(organizationId),
      countFeedbackThisMonth(organizationId),
      getUsageCount(organizationId, INSIGHT_FEATURE, day),
      getDigest(organizationId),
      countOwnedOrganizations(userId),
      getUsageCount(organizationId, CHAT_FEATURE, day),
    ]);

  const isPro = plan === "pro";
  const digestsUsed = isPro
    ? await getUsageCount(organizationId, DIGEST_FEATURE, day)
    : null;

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
