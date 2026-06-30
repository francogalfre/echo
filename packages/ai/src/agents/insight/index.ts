import { generateText } from "ai";

import { AIError } from "../../errors";
import { insightModel } from "./models";
import { buildInsightPrompt, INSIGHT_SYSTEM_PROMPT } from "./prompt";
import type { InsightInput } from "./types";

const TIMEOUT_MS = 30_000;
const MAX_OUTPUT_TOKENS = 512;

export async function generateInsight(input: InsightInput): Promise<string> {
  try {
    const { text } = await generateText({
      model: insightModel,
      system: INSIGHT_SYSTEM_PROMPT,
      prompt: buildInsightPrompt(input),
      temperature: 0.3,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      abortSignal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const insight = text.trim();

    if (!insight) {
      throw new AIError("GENERATION_FAILED", "Empty insight output");
    }

    return insight;
  } catch (error) {
    if (error instanceof AIError) throw error;
    throw new AIError("GENERATION_FAILED", "Insight generation failed", { cause: error });
  }
}
