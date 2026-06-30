import { generateDigest } from "@echo/ai";
import type { DigestOutput } from "@echo/ai";

import { getOrgPlan } from "../services/organization";
import { getDigest, getFeedbackForDigest, upsertDigest } from "../services/digest";

const DIGEST_WINDOW_DAYS = 7;
const WEEK_MS = DIGEST_WINDOW_DAYS * 24 * 60 * 60 * 1000;

type DigestResult =
  | { success: true; digest: DigestOutput; generatedAt: Date; feedbackCount: number }
  | { success: false; status: 400 | 403 | 502; error: string };

type DigestState = {
  digest: DigestOutput | null;
  generatedAt: Date | null;
  feedbackCount: number;
  canRegenerate: boolean;
};

function weekAgo(): Date {
  return new Date(Date.now() - WEEK_MS);
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
  const ageMs = Date.now() - cached.generatedAt.getTime();
  const canRegenerate = isPro || ageMs >= WEEK_MS;

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

  if (!isPro && cached) {
    const ageMs = Date.now() - cached.generatedAt.getTime();
    if (ageMs < WEEK_MS) {
      return {
        success: false,
        status: 403,
        error: "Free plan allows 1 digest per week. Upgrade to Pro for unlimited.",
      };
    }
  }

  const inputs = await getFeedbackForDigest(organizationId, weekAgo());

  if (inputs.length === 0) {
    return {
      success: false,
      status: 400,
      error: "No feedback in the last 7 days to analyze.",
    };
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

  await upsertDigest(organizationId, digest, inputs.length);

  return { success: true, digest, generatedAt: new Date(), feedbackCount: inputs.length };
}
