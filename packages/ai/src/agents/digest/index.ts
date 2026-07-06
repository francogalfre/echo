import { generateObject } from "ai";
import { z } from "zod";

import { AIError } from "../../errors";
import { digestModel } from "./models";
import { buildDigestPrompt, DIGEST_SYSTEM_PROMPT } from "./prompt";
import type { DigestInput, DigestOutput } from "./types";

const TIMEOUT_MS = 20_000;
const MAX_OUTPUT_TOKENS = 2000;
const PARALLEL_ATTEMPTS = 4;

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
});

async function attemptGeneration(inputs: DigestInput[]): Promise<DigestOutput> {
  const { object } = await generateObject({
    model: digestModel,
    schema: digestSchema,
    system: DIGEST_SYSTEM_PROMPT,
    prompt: buildDigestPrompt(inputs),
    temperature: 0.2,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    abortSignal: AbortSignal.timeout(TIMEOUT_MS),
    providerOptions: {
      openrouter: {
        reasoning: { enabled: false, exclude: true, effort: "none" },
      },
    },
  });
  return object;
}

export async function generateDigest(inputs: DigestInput[]): Promise<DigestOutput> {
  if (inputs.length === 0) {
    throw new AIError("GENERATION_FAILED", "No feedback to digest");
  }

  try {
    return await Promise.any(
      Array.from({ length: PARALLEL_ATTEMPTS }, () => attemptGeneration(inputs)),
    );
  } catch (error) {
    throw new AIError("GENERATION_FAILED", "Digest generation failed", { cause: error });
  }
}
