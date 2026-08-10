import { getLangfuse } from "./langfuse";

export type TraceInput = {
  name: string;
  userId?: string;
  organizationId?: string;
  metadata?: Record<string, unknown>;
  input?: unknown;
};

export type GenerationInput = {
  name: string;
  model?: string;
  system?: string;
  messages?: unknown[];
  prompt?: string;
  input?: unknown;
  output?: unknown;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
  metadata?: Record<string, unknown>;
};

function sanitizeMeta(
  raw?: Record<string, unknown>,
): Record<string, string | number | boolean | string[] | null> | undefined {
  if (!raw) return undefined;
  const clean: Record<string, string | number | boolean | string[] | null> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (value === undefined || value === null) continue;
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      Array.isArray(value)
    ) {
      clean[key] = value;
    } else {
      clean[key] = JSON.stringify(value);
    }
  }
  return Object.keys(clean).length > 0 ? clean : undefined;
}

export function createTrace(config: TraceInput) {
  const langfuse = getLangfuse();
  if (!langfuse) return null;

  const metadata = sanitizeMeta(config.metadata) ?? {};
  if (config.organizationId) metadata.organizationId = config.organizationId;

  return langfuse.trace({
    id: crypto.randomUUID(),
    name: config.name,
    userId: config.userId,
    metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    input: config.input,
  });
}

export function createGeneration(
  trace: ReturnType<typeof createTrace>,
  config: GenerationInput,
) {
  if (!trace) return null;

  const modelParameters: Record<string, string | number | boolean | string[] | null> = {};
  if (config.metadata?.temperature !== undefined) {
    modelParameters.temperature = config.metadata.temperature as number;
  }
  if (config.metadata?.maxOutputTokens !== undefined) {
    modelParameters.maxTokens = config.metadata.maxOutputTokens as number;
  }

  return trace.generation({
    name: config.name,
    model: config.model ?? "unknown",
    modelParameters: Object.keys(modelParameters).length > 0 ? modelParameters : undefined,
    input: config.input ?? config.prompt ?? config.messages,
    output: config.output,
    usage: config.usage
      ? {
          input: config.usage.inputTokens ?? 0,
          output: config.usage.outputTokens ?? 0,
          total: config.usage.totalTokens ?? 0,
        }
      : undefined,
    metadata: sanitizeMeta(config.metadata),
  });
}

export function updateGeneration(
  span: ReturnType<typeof createGeneration>,
  output: unknown,
  usage?: GenerationInput["usage"],
) {
  if (!span) return;

  span.end({
    output,
    usage: usage
      ? {
          input: usage.inputTokens ?? 0,
          output: usage.outputTokens ?? 0,
          total: usage.totalTokens ?? 0,
        }
      : undefined,
  });
}

export function scoreTrace(
  trace: ReturnType<typeof createTrace>,
  name: string,
  value: number,
  comment?: string,
) {
  if (!trace) return;

  trace.score({ name, value, comment });
}
