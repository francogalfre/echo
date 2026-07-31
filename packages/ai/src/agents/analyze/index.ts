import { generateObject } from "ai";
import { z } from "zod";

import { AIError } from "../../errors";
import { openrouterModel } from "../../lib/provider";
import { DEFAULT_MODEL } from "../../lib/model";
import { buildAgentUsage, type AgentUsage } from "../../lib/usage";
import { ANALYZE_SYSTEM_PROMPT, buildAnalyzePrompt } from "./prompt";

const timeoutMs = 30_000;
const maxOutputTokens = 150;
const maxAttempts = 2;
const retryDelayMs = 500;

const VALID_TAGS = [
  "bug",
  "feature",
  "ux",
  "performance",
  "billing",
  "compliment",
  "support",
] as const;

export type Tag = (typeof VALID_TAGS)[number];

export const SENTIMENT_VALUES = ["positive", "negative", "neutral", "none"] as const;
export type Sentiment = (typeof SENTIMENT_VALUES)[number];

export type FeedbackAnalysis = {
  sentiment: Sentiment;
  tags: Tag[];
};

const analysisSchema = z.object({
  sentiment: z.enum(SENTIMENT_VALUES),
  tags: z.array(z.enum(VALID_TAGS)).max(3),
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function attemptGeneration(
  content: string,
): Promise<{ analysis: FeedbackAnalysis; usage: AgentUsage }> {
  const result = await generateObject({
    model: openrouterModel(DEFAULT_MODEL),
    schema: analysisSchema,
    system: ANALYZE_SYSTEM_PROMPT,
    prompt: buildAnalyzePrompt(content),
    temperature: 0,
    maxOutputTokens,
    abortSignal: AbortSignal.timeout(timeoutMs),
    providerOptions: { openrouter: { usage: { include: true } } },
  });

  return {
    analysis: result.object,
    usage: buildAgentUsage({
      model: result.response.modelId,
      usage: result.usage,
      providerMetadata: result.providerMetadata,
    }),
  };
}

export async function analyzeFeedback(
  content: string,
): Promise<{ analysis: FeedbackAnalysis; usage: AgentUsage }> {
  let lastError: unknown = undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await attemptGeneration(content);
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) await sleep(retryDelayMs);
    }
  }

  if (lastError instanceof AIError) throw lastError;
  throw new AIError("GENERATION_FAILED", "Feedback analysis failed", { cause: lastError });
}
