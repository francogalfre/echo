import { generateChatResponse, type ChatMessage } from "@echo/ai";

import { FREE_CHAT_DAILY_LIMIT, PRO_CHAT_DAILY_LIMIT } from "../lib/plan-limits";
import { getUsageCount, incrementUsage } from "../services/ai-usage";
import { getFeedbackForDigest } from "../services/digest";
import { getOrgPlan } from "../services/organization";

const CHAT_FEATURE = "chat";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

type ChatResult =
  | {
      success: true;
      response: string;
      sources: { excerpt: string; sentiment: string }[];
    }
  | { success: false; status: 403 | 502; error: string };

export async function chatWithAgent(
  organizationId: string,
  messages: readonly ChatMessage[],
): Promise<ChatResult> {
  const plan = await getOrgPlan(organizationId);
  const isPro = plan === "pro";
  const day = todayKey();
  const limit = isPro ? PRO_CHAT_DAILY_LIMIT : FREE_CHAT_DAILY_LIMIT;

  const used = await getUsageCount(organizationId, CHAT_FEATURE, day);
  if (used >= limit) {
    return {
      success: false,
      status: 403,
      error: isPro
        ? `Daily chat limit (${PRO_CHAT_DAILY_LIMIT}) reached.`
        : `Free plan allows ${FREE_CHAT_DAILY_LIMIT} chats per day. Upgrade to Pro for more.`,
    };
  }

  const feedbackContext = await getFeedbackForDigest(organizationId, isPro);

  if (feedbackContext.length === 0) {
    return {
      success: false,
      status: 403,
      error: "No feedback available to chat about.",
    };
  }

  try {
    const result = await generateChatResponse({
      messages,
      feedbackContext: feedbackContext.map((f) => ({
        content: f.content,
        sentiment: f.sentiment ?? "neutral",
        tags: f.tags ?? [],
      })),
    });

    await incrementUsage(organizationId, CHAT_FEATURE, day);

    return {
      success: true,
      response: result.response,
      sources: result.sources.map((s) => ({
        excerpt: s.excerpt,
        sentiment: s.sentiment,
      })),
    };
  } catch (error) {
    console.error("[echo:ai] chat generation failed", error);
    return {
      success: false,
      status: 502,
      error: "Could not generate response, please try again.",
    };
  }
}
