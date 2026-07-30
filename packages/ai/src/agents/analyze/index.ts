import { generateObject } from "ai";
import { z } from "zod";

import { AIError } from "../../errors";
import { buildAgentUsage, type AgentUsage } from "../../usage";
import { analyzeModel } from "./models";
import { ANALYZE_SYSTEM_PROMPT, buildAnalyzePrompt } from "./prompt";
import { SENTIMENT_VALUES, VALID_TAGS, type FeedbackAnalysis } from "./types";

const TIMEOUT_MS = 30_000;

const analysisSchema = z.object({
  sentiment: z.enum(SENTIMENT_VALUES),
  tags: z.array(z.enum(VALID_TAGS)).max(3),
});

export async function analyzeFeedback(
  content: string,
): Promise<{ analysis: FeedbackAnalysis; usage: AgentUsage }> {
  try {
    const result = await generateObject({
      model: analyzeModel,
      schema: analysisSchema,
      system: ANALYZE_SYSTEM_PROMPT,
      prompt: buildAnalyzePrompt(content),
      temperature: 0,
      maxOutputTokens: 150,
      abortSignal: AbortSignal.timeout(TIMEOUT_MS),
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
  } catch (error) {
    throw new AIError("GENERATION_FAILED", "Feedback analysis failed", { cause: error });
  }
}
