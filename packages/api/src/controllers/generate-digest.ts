import { generateDigest, type DigestOutput } from "@echo/ai";

import { getUsageCount, incrementUsage } from "../services/ai-usage";
import { getDigest, getFeedbackForDigest, upsertDigest } from "../services/digest";
import { getOrgPlan } from "../services/organization";

const DIGEST_FEATURE = "digest";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const PRO_DAILY_LIMIT = 10;

type DigestResult =
  | { success: true; digest: DigestOutput; generatedAt: Date; feedbackCount: number }
  | { success: false; status: 400 | 403 | 502; error: string };

type DigestState = {
  digest: DigestOutput | null;
  generatedAt: Date | null;
  feedbackCount: number;
  canRegenerate: boolean;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getFeedbackDigest(organizationId: string): Promise<DigestState> {
  const [plan, cached] = await Promise.all([
    getOrgPlan(organizationId),
    getDigest(organizationId),
  ]);

  if (!cached) {
    return { digest: null, generatedAt: null, feedbackCount: 0, canRegenerate: true };
  }

  const isPro = plan === "pro";

  let canRegenerate: boolean;
  if (isPro) {
    const used = await getUsageCount(organizationId, DIGEST_FEATURE, todayKey());
    canRegenerate = used < PRO_DAILY_LIMIT;
  } else {
    const ageMs = Date.now() - cached.generatedAt.getTime();
    canRegenerate = ageMs >= WEEK_MS;
  }

  return {
    digest: cached.digest,
    generatedAt: cached.generatedAt,
    feedbackCount: cached.feedbackCount,
    canRegenerate,
  };
}

export async function generateFeedbackDigest(
  organizationId: string,
): Promise<DigestResult> {
  const [plan, cached] = await Promise.all([
    getOrgPlan(organizationId),
    getDigest(organizationId),
  ]);

  const isPro = plan === "pro";
  const day = todayKey();

  if (isPro) {
    const used = await getUsageCount(organizationId, DIGEST_FEATURE, day);
    if (used >= PRO_DAILY_LIMIT) {
      return {
        success: false,
        status: 403,
        error: `Daily digest limit (${PRO_DAILY_LIMIT}) reached. Resets tomorrow.`,
      };
    }
  } else {
    if (cached) {
      const ageMs = Date.now() - cached.generatedAt.getTime();
      if (ageMs < WEEK_MS) {
        return {
          success: false,
          status: 403,
          error: "Free plan allows 1 digest per week. Upgrade to Pro for more.",
        };
      }
    }
  }

  const inputs = await getFeedbackForDigest(organizationId, isPro);

  if (inputs.length === 0) {
    return { success: false, status: 400, error: "No feedback yet to analyze." };
  }

  let digest: DigestOutput;
  try {
    digest = await generateDigest(inputs);
  } catch (error) {
    console.error("[echo:ai] digest generation failed", error);
    return {
      success: false,
      status: 502,
      error: "Could not generate digest, please try again.",
    };
  }

  await Promise.all([
    upsertDigest(organizationId, digest, inputs.length),
    incrementUsage(organizationId, DIGEST_FEATURE, day),
  ]);

  return { success: true, digest, generatedAt: new Date(), feedbackCount: inputs.length };
}
