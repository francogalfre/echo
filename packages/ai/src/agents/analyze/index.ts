import { generateObject } from "ai";
import { z } from "zod";

import { AIError } from "../../errors";
import { analyzeModel } from "./models";
import { ANALYZE_SYSTEM_PROMPT, buildAnalyzePrompt } from "./prompt";
import { SENTIMENT_VALUES, VALID_TAGS, type FeedbackAnalysis } from "./types";

const TIMEOUT_MS = 30_000;

const analysisSchema = z.object({
  sentiment: z.enum(SENTIMENT_VALUES),
  tags: z.array(z.enum(VALID_TAGS)).max(3),
});

export async function analyzeFeedback(content: string): Promise<FeedbackAnalysis> {
  try {
    const { object } = await generateObject({
      model: analyzeModel,
      schema: analysisSchema,
      system: ANALYZE_SYSTEM_PROMPT,
      prompt: buildAnalyzePrompt(content),
      temperature: 0,
      maxOutputTokens: 150,
      abortSignal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return object;
  } catch (error) {
    throw new AIError("GENERATION_FAILED", "Feedback analysis failed", { cause: error });
  }
}
