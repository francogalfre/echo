import { generateText } from "ai";

import { AIError } from "../../errors";
import { openrouterModel } from "../../lib/provider";
import { DEFAULT_MODEL } from "../../lib/model";
import { buildAgentUsage, type AgentUsage } from "../../lib/usage";
import { buildInsightPrompt, INSIGHT_SYSTEM_PROMPT } from "./prompt";

const timeoutMs = 30_000;
const maxOutputTokens = 120;
const maxAttempts = 2;
const retryDelayMs = 500;

export type InsightInput = {
  content: string;
  sentiment?: string | null;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function attemptGeneration(
  input: InsightInput,
): Promise<{ insight: string; usage: AgentUsage }> {
  const result = await generateText({
    model: openrouterModel(DEFAULT_MODEL),
    system: INSIGHT_SYSTEM_PROMPT,
    prompt: buildInsightPrompt(input),
    temperature: 0.3,
    maxOutputTokens,
    abortSignal: AbortSignal.timeout(timeoutMs),
    providerOptions: { openrouter: { usage: { include: true } } },
  });

  const insight = result.text.trim();

  if (!insight) {
    throw new AIError("GENERATION_FAILED", "Empty insight output");
  }

  return {
    insight,
    usage: buildAgentUsage({
      model: result.response.modelId,
      usage: result.usage,
      providerMetadata: result.providerMetadata,
    }),
  };
}

export async function generateInsight(
  input: InsightInput,
): Promise<{ insight: string; usage: AgentUsage }> {
  let lastError: unknown = undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await attemptGeneration(input);
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) await sleep(retryDelayMs);
    }
  }

  if (lastError instanceof AIError) throw lastError;
  throw new AIError("GENERATION_FAILED", "Insight generation failed", { cause: lastError });
}
