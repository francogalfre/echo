import { AGENT_VERSIONS, generateInsight } from "@echo/ai";

import { enforceQuota } from "./quota";
import { recordAiEvent } from "../services/ai-events";
import { getFeedbackById, setFeedbackInsight } from "../services/feedback";
import type { InsightResult } from "../types";

export async function generateFeedbackInsight(
  organizationId: string,
  feedbackId: string,
): Promise<InsightResult> {
  const target = await getFeedbackById(feedbackId, organizationId);
  if (!target) {
    return { success: false, status: 404, error: "Feedback not found", upgrade: false };
  }

  if (target.insight) {
    return { success: true, insight: target.insight, cached: true };
  }

  const decision = await enforceQuota(organizationId, "insight");
  if (!decision.allowed) {
    return {
      success: false,
      status: 403,
      error: decision.message,
      upgrade: decision.upgrade,
    };
  }

  const startedAt = Date.now();

  try {
    const { insight, usage } = await generateInsight({
      content: target.content,
      sentiment: target.sentiment,
    });

    await setFeedbackInsight(feedbackId, insight);
    await recordAiEvent({
      organizationId,
      feature: "insight",
      agent: "insight",
      model: usage.model,
      promptVersion: AGENT_VERSIONS.insight,
      cacheHit: usage.cacheHit,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      costMicroUsd: usage.costMicroUsd,
      latencyMs: Date.now() - startedAt,
      status: "ok",
    });

    return { success: true, insight, cached: false };
  } catch (error) {
    console.error(`[echo:ai] failed to generate insight for ${feedbackId}`, error);
    await decision.release();
    await recordAiEvent({
      organizationId,
      feature: "insight",
      agent: "insight",
      model: "unknown",
      promptVersion: AGENT_VERSIONS.insight,
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
      error: "Could not generate insight, try again.",
      upgrade: false,
    };
  }
}
