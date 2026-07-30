import { JOB_PAYLOAD_SCHEMAS, type JobKind } from "../jobs/kinds";
import { insertJob } from "../services/jobs";

export async function enqueue(
  kind: JobKind,
  payload: Record<string, unknown>,
  options?: {
    organizationId?: string;
    dedupeKey?: string;
    maxAttempts?: number;
    runAt?: Date;
  },
): Promise<{ enqueued: boolean }> {
  const schema = JOB_PAYLOAD_SCHEMAS[kind];
  const validatedPayload = schema.parse(payload) as Record<string, unknown>;

  return insertJob({
    kind,
    payload: validatedPayload,
    organizationId: options?.organizationId,
    dedupeKey: options?.dedupeKey,
    maxAttempts: options?.maxAttempts,
    runAt: options?.runAt,
  });
}
