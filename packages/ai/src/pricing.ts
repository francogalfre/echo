export type ModelPricing = {
  readonly inputPerMillionUsd: number;
  readonly outputPerMillionUsd: number;
};

const MODEL_PRICING: Record<string, ModelPricing> = {
  "openrouter/free": { inputPerMillionUsd: 0, outputPerMillionUsd: 0 },
  "google/gemini-2.5-flash-lite": { inputPerMillionUsd: 0.1, outputPerMillionUsd: 0.4 },
  "google/gemini-2.5-flash": { inputPerMillionUsd: 0.3, outputPerMillionUsd: 2.5 },
};

const FALLBACK_PRICING: ModelPricing = { inputPerMillionUsd: 1, outputPerMillionUsd: 3 };

export function getModelPricing(model: string): ModelPricing {
  return MODEL_PRICING[model] ?? FALLBACK_PRICING;
}
