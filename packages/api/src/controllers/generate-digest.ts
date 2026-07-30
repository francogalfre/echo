import { AGENT_VERSIONS, generateDigest, type DigestOutput } from "@echo/ai";

import { enforceInterval, enforceQuota, todayKey } from "./quota";
import { FREE_DIGEST_INTERVAL_MS, PRO_DIGEST_DAILY_LIMIT } from "../lib/plan-limits";
import { recordAiEvent } from "../services/ai-events";
import { getUsageCount } from "../services/ai-usage";
import {
  getDigest,
  getFeedbackForDigest,
  hasFeedbackSince,
  insertDigest,
  listDigests,
  type DigestHistoryEntry,
} from "../services/digest";
import { getOrgPlan } from "../services/organization";

type DigestResult =
  | {
      success: true;
      digest: DigestOutput;
      generatedAt: Date;
      feedbackCount: number;
      cached: boolean;
    }
  | { success: false; status: 400 | 403 | 502; error: string; upgrade: boolean };

type DigestState = {
  digest: DigestOutput | null;
  generatedAt: Date | null;
  feedbackCount: number;
  canRegenerate: boolean;
};

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
    const used = await getUsageCount(organizationId, "digest", todayKey());
    canRegenerate = used < PRO_DIGEST_DAILY_LIMIT;
  } else {
    const ageMs = Date.now() - cached.generatedAt.getTime();
    canRegenerate = ageMs >= FREE_DIGEST_INTERVAL_MS;
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
  let releaseQuota: (() => Promise<void>) | null = null;

  if (isPro) {
    const decision = await enforceQuota(organizationId, "digest");
    if (!decision.allowed) {
      return {
        success: false,
        status: 403,
        error: decision.message,
        upgrade: decision.upgrade,
      };
    }
    releaseQuota = decision.release;
  } else {
    const decision = await enforceInterval(
      FREE_DIGEST_INTERVAL_MS,
      cached?.generatedAt ?? null,
    );
    if (!decision.allowed) {
      return {
        success: false,
        status: 403,
        error: decision.message,
        upgrade: decision.upgrade,
      };
    }
  }

  if (cached && !(await hasFeedbackSince(organizationId, cached.generatedAt))) {
    await releaseQuota?.();

    return {
      success: true,
      digest: cached.digest,
      generatedAt: cached.generatedAt,
      feedbackCount: cached.feedbackCount,
      cached: true,
    };
  }

  const inputs = await getFeedbackForDigest(organizationId, isPro);

  if (inputs.length === 0) {
    await releaseQuota?.();

    return {
      success: false,
      status: 400,
      error: "No feedback yet to analyze.",
      upgrade: false,
    };
  }

  const startedAt = Date.now();

  let digest: DigestOutput;
  try {
    const result = await generateDigest(inputs);
    digest = result.digest;

    await Promise.all([
      insertDigest(organizationId, digest, inputs.length),
      recordAiEvent({
        organizationId,
        feature: "digest",
        agent: "digest",
        model: result.usage.model,
        promptVersion: AGENT_VERSIONS.digest,
        cacheHit: result.usage.cacheHit,
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens,
        costMicroUsd: result.usage.costMicroUsd,
        latencyMs: Date.now() - startedAt,
        status: "ok",
      }),
    ]);
  } catch (error) {
    console.error("[echo:ai] digest generation failed", error);
    await releaseQuota?.();
    await recordAiEvent({
      organizationId,
      feature: "digest",
      agent: "digest",
      model: "unknown",
      promptVersion: AGENT_VERSIONS.digest,
      cacheHit: false,
      inputTokens: 0,
      outputTokens: 0,
      costMicroUsd: 0,
      latencyMs: Date.now() - startedAt,
      status: "error",
    });

    return {
      success: false,
      status: 502,
      error: "Could not generate digest, please try again.",
      upgrade: false,
    };
  }

  return {
    success: true,
    digest,
    generatedAt: new Date(),
    feedbackCount: inputs.length,
    cached: false,
  };
}

export async function getDigestHistory(
  organizationId: string,
): Promise<DigestHistoryEntry[]> {
  return listDigests(organizationId);
}
