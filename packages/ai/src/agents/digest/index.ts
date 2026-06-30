import { generateText } from "ai";
import { z } from "zod";

import { AIError } from "../../errors";
import { digestModel } from "./models";
import { buildDigestPrompt, DIGEST_SYSTEM_PROMPT } from "./prompt";
import type { DigestInput, DigestOutput } from "./types";

const TIMEOUT_MS = 30_000;
const MAX_OUTPUT_TOKENS = 600;

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

function extractJson(text: string): string {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : text.trim();
}

function parseDigest(text: string): DigestOutput {
  try {
    const raw = JSON.parse(extractJson(text));
    return digestSchema.parse(raw);
  } catch {
    throw new AIError("GENERATION_FAILED", "Could not parse digest output");
  }
}

export async function generateDigest(inputs: DigestInput[]): Promise<DigestOutput> {
  if (inputs.length === 0) {
    throw new AIError("GENERATION_FAILED", "No feedback to digest");
  }

  try {
    const { text } = await generateText({
      model: digestModel,
      system: DIGEST_SYSTEM_PROMPT,
      prompt: buildDigestPrompt(inputs),
      temperature: 0.2,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      abortSignal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return parseDigest(text);
  } catch (error) {
    if (error instanceof AIError) throw error;
    throw new AIError("GENERATION_FAILED", "Digest generation failed", { cause: error });
  }
}
