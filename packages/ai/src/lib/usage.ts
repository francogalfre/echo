import type { LanguageModelUsage, ProviderMetadata } from "ai";

export type TokenUsage = {
  readonly inputTokens: number;
  readonly outputTokens: number;
};

export type AgentUsage = {
  readonly model: string;
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly costMicroUsd: number;
  readonly cacheHit: boolean;
};

export function normalizeUsage(usage: LanguageModelUsage): TokenUsage {
  return {
    inputTokens: usage.inputTokens ?? 0,
    outputTokens: usage.outputTokens ?? 0,
  };
}

function extractOpenRouterCostUsd(
  providerMetadata: ProviderMetadata | undefined,
): number | undefined {
  const openrouter = providerMetadata?.openrouter;
  if (!openrouter || typeof openrouter !== "object") return undefined;

  const usage = (openrouter as Record<string, unknown>).usage;
  if (!usage || typeof usage !== "object") return undefined;

  const cost = (usage as Record<string, unknown>).cost;
  return typeof cost === "number" ? cost : undefined;
}

function extractCacheHit(usage: LanguageModelUsage): boolean {
  return (usage.inputTokenDetails?.cacheReadTokens ?? 0) > 0;
}

export function buildAgentUsage(input: {
  readonly model: string;
  readonly usage: LanguageModelUsage;
  readonly providerMetadata: ProviderMetadata | undefined;
}): AgentUsage {
  const tokens = normalizeUsage(input.usage);
  const providerCostUsd = extractOpenRouterCostUsd(input.providerMetadata);
  const costMicroUsd =
    providerCostUsd !== undefined ? Math.round(providerCostUsd * 1_000_000) : 0;

  return {
    model: input.model,
    inputTokens: tokens.inputTokens,
    outputTokens: tokens.outputTokens,
    costMicroUsd,
    cacheHit: extractCacheHit(input.usage),
  };
}
