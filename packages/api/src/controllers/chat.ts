import { AGENT_VERSIONS, generateChatResponse, type ChatMessage } from "@echo/ai";

import { enforceQuota } from "./quota";
import { recordAiEvent } from "../services/ai-events";
import { getFeedbackForDigest } from "../services/digest";
import { getOrgPlan } from "../services/organization";

type ChatResult =
  | {
      success: true;
      response: string;
      sources: { excerpt: string; sentiment: string }[];
    }
  | { success: false; status: 403 | 502; error: string; upgrade: boolean };

export async function chatWithAgent(
  organizationId: string,
  messages: readonly ChatMessage[],
): Promise<ChatResult> {
  const isPro = (await getOrgPlan(organizationId)) === "pro";

  const decision = await enforceQuota(organizationId, "chat");
  if (!decision.allowed) {
    return {
      success: false,
      status: 403,
      error: decision.message,
      upgrade: decision.upgrade,
    };
  }

  const feedbackContext = await getFeedbackForDigest(organizationId, isPro);

  if (feedbackContext.length === 0) {
    await decision.release();

    return {
      success: false,
      status: 403,
      error: "No feedback available to chat about.",
      upgrade: false,
    };
  }

  const startedAt = Date.now();

  try {
    const result = await generateChatResponse({
      messages,
      feedbackContext: feedbackContext.map((f) => ({
        content: f.content,
        sentiment: f.sentiment ?? "neutral",
        tags: f.tags ?? [],
      })),
    });

    await recordAiEvent({
      organizationId,
      feature: "chat",
      agent: "chat",
      model: result.usage.model,
      promptVersion: AGENT_VERSIONS.chat,
      cacheHit: result.usage.cacheHit,
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
      costMicroUsd: result.usage.costMicroUsd,
      latencyMs: Date.now() - startedAt,
      status: "ok",
    });

    return {
      success: true,
      response: result.output.response,
      sources: result.output.sources.map((s) => ({
        excerpt: s.excerpt,
        sentiment: s.sentiment,
      })),
    };
  } catch (error) {
    console.error("[echo:ai] chat generation failed", error);
    await decision.release();
    await recordAiEvent({
      organizationId,
      feature: "chat",
      agent: "chat",
      model: "unknown",
      promptVersion: AGENT_VERSIONS.chat,
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
      error: "Could not generate response, please try again.",
      upgrade: false,
    };
  }
}
