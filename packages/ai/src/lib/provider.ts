import { env } from "@echo/env/server";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { LanguageModel } from "ai";

const openrouter = createOpenRouter({ apiKey: env.OPENROUTER_API_KEY });

export function openrouterModel(modelId: string): LanguageModel {
  return openrouter.chat(modelId);
}
