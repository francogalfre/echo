import { generateText } from "ai";
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

function extractJson(text: string): string {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : text.trim();
}

function parseAnalysis(text: string): FeedbackAnalysis {
  try {
    const raw = JSON.parse(extractJson(text));
    return analysisSchema.parse(raw);
  } catch {
    throw new AIError("GENERATION_FAILED", `Could not parse analysis output: "${text}"`);
  }
}

export async function analyzeFeedback(content: string): Promise<FeedbackAnalysis> {
  try {
    const result = await generateText({
      model: analyzeModel,
      system: ANALYZE_SYSTEM_PROMPT,
      prompt: buildAnalyzePrompt(content),
      temperature: 0,
      maxOutputTokens: 150,
      abortSignal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return parseAnalysis(result.text);
  } catch (error) {
    if (error instanceof AIError) throw error;
    throw new AIError("GENERATION_FAILED", "Feedback analysis failed", { cause: error });
  }
}
