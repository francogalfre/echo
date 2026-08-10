import { generateText } from "ai";

import { AIError } from "../../errors";
import { openrouterModel } from "../../lib/provider";
import { DEFAULT_MODEL } from "../../lib/model";
import { buildAgentUsage, type AgentUsage } from "../../lib/usage";
import { buildInsightPrompt, INSIGHT_SYSTEM_PROMPT } from "./prompt";
import { createGeneration, createTrace, updateGeneration } from "../../lib/tracing";

const timeoutMs = 30_000;
const maxOutputTokens = 400;
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
  const trace = createTrace({
    name: "insight-agent",
    metadata: { model: DEFAULT_MODEL, sentiment: input.sentiment },
    input: { content: input.content.slice(0, 500) },
  });

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

  if (result.finishReason === "length" && !/[.!?]$/.test(insight)) {
    throw new AIError("GENERATION_FAILED", "Insight truncated");
  }

  if (!insight) {
    throw new AIError("GENERATION_FAILED", "Empty insight output");
  }

  const usage = buildAgentUsage({
    model: result.response.modelId,
    usage: result.usage,
    providerMetadata: result.providerMetadata,
  });

  try {
    const generation = createGeneration(trace, {
      name: "insight-generation",
      model: result.response.modelId,
      system: INSIGHT_SYSTEM_PROMPT.slice(0, 200),
      prompt: buildInsightPrompt(input).slice(0, 500),
      output: insight.slice(0, 1000),
      usage: {
        inputTokens: result.usage?.inputTokens,
        outputTokens: result.usage?.outputTokens,
        totalTokens: result.usage?.totalTokens,
      },
      metadata: { temperature: 0.3, maxOutputTokens },
    });
    updateGeneration(generation, insight.slice(0, 1000), {
      inputTokens: result.usage?.inputTokens,
      outputTokens: result.usage?.outputTokens,
      totalTokens: result.usage?.totalTokens,
    });
  } catch {
    // Tracing failures must never block the user
  }

  return { insight, usage };
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
