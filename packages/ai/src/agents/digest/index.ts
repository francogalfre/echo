import { generateObject } from "ai";
import { z } from "zod";

import { AIError } from "../../errors";
import { openrouterModel } from "../../lib/provider";
import { DEFAULT_MODEL } from "../../lib/model";
import { buildAgentUsage, type AgentUsage } from "../../lib/usage";
import { buildDigestPrompt, DIGEST_SYSTEM_PROMPT } from "./prompt";
import {
  createGeneration,
  createTrace,
  flushTracing,
  updateGeneration,
} from "../../lib/tracing";

const timeoutMs = 20_000;
const maxOutputTokens = 1300;
const maxAttempts = 2;
const retryDelayMs = 500;

export type DigestInput = {
  content: string;
  sentiment?: string | null;
  tags?: string[] | null;
};

export type DigestTheme = {
  title: string;
  count: number;
  insight: string;
};

export type DigestSuggestion = {
  title: string;
  detail: string;
};

export type DigestOutput = {
  executiveSummary: string;
  themes: DigestTheme[];
  topIssues: string[];
  positiveHighlight: string;
  suggestions?: DigestSuggestion[];
};

const digestSchema = z.object({
  executiveSummary: z.string(),
  themes: z
    .array(
      z.object({
        title: z.string(),
        count: z.number(),
        insight: z.string(),
      }),
    )
    .max(5),
  topIssues: z.array(z.string()).max(3),
  positiveHighlight: z.string(),
  suggestions: z.array(z.object({ title: z.string(), detail: z.string() })).max(3),
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function attemptGeneration(
  inputs: DigestInput[],
): Promise<{ digest: DigestOutput; usage: AgentUsage }> {
  const trace = createTrace({
    name: "digest-agent",
    metadata: { model: DEFAULT_MODEL, feedbackCount: inputs.length },
    input: { feedbacks: inputs.map((i) => ({ sentiment: i.sentiment, tags: i.tags })) },
  });

  const result = await generateObject({
    model: openrouterModel(DEFAULT_MODEL),
    schema: digestSchema,
    system: DIGEST_SYSTEM_PROMPT,
    prompt: buildDigestPrompt(inputs),
    temperature: 0.2,
    maxOutputTokens,
    abortSignal: AbortSignal.timeout(timeoutMs),
    providerOptions: {
      openrouter: {
        reasoning: { enabled: false, exclude: true, effort: "none" },
        usage: { include: true },
      },
    },
  });

  const usage = buildAgentUsage({
    model: result.response.modelId,
    usage: result.usage,
    providerMetadata: result.providerMetadata,
  });

  try {
    const generation = createGeneration(trace, {
      name: "digest-generation",
      model: result.response.modelId,
      system: DIGEST_SYSTEM_PROMPT.slice(0, 200),
      prompt: buildDigestPrompt(inputs).slice(0, 500),
      output: result.object.executiveSummary?.slice(0, 500),
      usage: {
        inputTokens: result.usage?.inputTokens,
        outputTokens: result.usage?.outputTokens,
        totalTokens: result.usage?.totalTokens,
      },
      metadata: { temperature: 0.2, maxOutputTokens, feedbackCount: inputs.length },
    });
    updateGeneration(generation, result.object, {
      inputTokens: result.usage?.inputTokens,
      outputTokens: result.usage?.outputTokens,
      totalTokens: result.usage?.totalTokens,
    });
    await flushTracing();
  } catch {
    // Tracing failures must never block the user
  }

  return { digest: result.object, usage };
}

export async function generateDigest(
  inputs: DigestInput[],
): Promise<{ digest: DigestOutput; usage: AgentUsage }> {
  if (inputs.length === 0) {
    throw new AIError("GENERATION_FAILED", "No feedback to digest");
  }

  let lastError: unknown = undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await attemptGeneration(inputs);
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) await sleep(retryDelayMs);
    }
  }

  if (lastError instanceof AIError) throw lastError;
  throw new AIError("GENERATION_FAILED", "Digest generation failed", { cause: lastError });
}
