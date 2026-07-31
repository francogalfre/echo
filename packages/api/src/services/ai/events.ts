import { db } from "@echo/db";
import { aiEvents } from "@echo/db/schema/ai-events";

export type AiEventInput = {
  readonly organizationId: string;
  readonly feature: string;
  readonly agent: string;
  readonly model: string;
  readonly promptVersion: number;
  readonly cacheHit: boolean;
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly costMicroUsd: number;
  readonly latencyMs: number | null;
  readonly status: "ok" | "error";
};

export async function recordAiEvent(input: AiEventInput): Promise<void> {
  await db.insert(aiEvents).values({ id: crypto.randomUUID(), ...input });
}
