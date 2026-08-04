import { analyzeFeedback } from "@echo/ai";

import { feedbackEnrichPayloadSchema } from "../kinds";
import { recordAiEvent } from "../../services/ai/events";
import { getFeedbackOrganizationId, setFeedbackEnrichment } from "../../services/feedback";

export async function handleFeedbackEnrich(payload: unknown): Promise<void> {
  const { feedbackId, content } = feedbackEnrichPayloadSchema.parse(payload);
  const organizationId = await getFeedbackOrganizationId(feedbackId);
  const startedAt = Date.now();

  try {
    const { analysis, usage } = await analyzeFeedback(content);
    await setFeedbackEnrichment(feedbackId, {
      sentiment: analysis.sentiment,
      tags: analysis.tags,
    });

    if (organizationId) {
      await recordAiEvent({
        organizationId,
        feature: "analyze",
        agent: "analyze",
        model: usage.model,
        promptVersion: 1,
        cacheHit: usage.cacheHit,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        costMicroUsd: usage.costMicroUsd,
        latencyMs: Date.now() - startedAt,
        status: "ok",
      });
    }
  } catch (error) {
    if (organizationId) {
      await recordAiEvent({
        organizationId,
        feature: "analyze",
        agent: "analyze",
        model: "unknown",
        promptVersion: 1,
        cacheHit: false,
        inputTokens: 0,
        outputTokens: 0,
        costMicroUsd: 0,
        latencyMs: Date.now() - startedAt,
        status: "error",
      });
    }

    throw error;
  }
}
