import { generateText } from "ai";

import { AIError } from "../../errors";
import { buildAgentUsage, type AgentUsage } from "../../usage";
import { insightModel } from "./models";
import { buildInsightPrompt, INSIGHT_SYSTEM_PROMPT } from "./prompt";
import type { InsightInput } from "./types";

const TIMEOUT_MS = 30_000;
const MAX_OUTPUT_TOKENS = 512;

export async function generateInsight(
  input: InsightInput,
): Promise<{ insight: string; usage: AgentUsage }> {
  try {
    const result = await generateText({
      model: insightModel,
      system: INSIGHT_SYSTEM_PROMPT,
      prompt: buildInsightPrompt(input),
      temperature: 0.3,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      abortSignal: AbortSignal.timeout(TIMEOUT_MS),
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
  } catch (error) {
    if (error instanceof AIError) throw error;
    throw new AIError("GENERATION_FAILED", "Insight generation failed", { cause: error });
  }
}
