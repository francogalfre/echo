import { generateText } from "ai";

import { AIError } from "../../errors";
import { chatModel } from "./models";
import { buildChatPrompt, CHAT_SYSTEM_PROMPT } from "./prompt";
import type { ChatInput, ChatOutput } from "./types";

const TIMEOUT_MS = 30_000;
const MAX_OUTPUT_TOKENS = 512;

export async function generateChatResponse(input: ChatInput): Promise<ChatOutput> {
  if (input.feedbackContext.length === 0) {
    throw new AIError("GENERATION_FAILED", "No feedback context available");
  }

  try {
    const { text } = await generateText({
      model: chatModel,
      system: CHAT_SYSTEM_PROMPT,
      prompt: buildChatPrompt(input),
      temperature: 0.7,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      abortSignal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const response = text.trim();

    if (!response) {
      throw new AIError("GENERATION_FAILED", "Empty chat response");
    }

    return {
      response,
      sources: input.feedbackContext.slice(0, 3).map((f) => ({
        excerpt: f.content.slice(0, 100),
        sentiment: f.sentiment,
      })),
    };
  } catch (error) {
    if (error instanceof AIError) throw error;
    throw new AIError("GENERATION_FAILED", "Chat response generation failed", {
      cause: error,
    });
  }
}
