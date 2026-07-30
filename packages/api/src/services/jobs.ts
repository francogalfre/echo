import { db } from "@echo/db";
import { jobs, jobSchedules } from "@echo/db/schema/jobs";
import { and, asc, eq, inArray, lte, sql } from "drizzle-orm";

export type JobRow = typeof jobs.$inferSelect;
export type JobScheduleRow = typeof jobSchedules.$inferSelect;

export type NewJob = {
  kind: string;
  payload: Record<string, unknown>;
  organizationId?: string;
  dedupeKey?: string;
  priority?: number;
  maxAttempts?: number;
  runAt?: Date;
};

const BASE_BACKOFF_MS = 30_000;
const MAX_BACKOFF_MS = 60 * 60 * 1000;

function backoffDelayMs(attempts: number): number {
  const jitter = 0.5 + Math.random() * 0.5;
  return Math.min(MAX_BACKOFF_MS, BASE_BACKOFF_MS * 2 ** attempts * jitter);
}

export async function claimJobs(workerId: string, limit: number): Promise<JobRow[]> {
  const claimableIds = db
    .select({ id: jobs.id })
    .from(jobs)
    .where(and(eq(jobs.status, "pending"), lte(jobs.runAt, new Date())))
    .orderBy(asc(jobs.priority), asc(jobs.runAt))
    .limit(limit)
    .for("update", { skipLocked: true });

  return db
    .update(jobs)
    .set({
      status: "running",
      lockedAt: new Date(),
      lockedBy: workerId,
      attempts: sql`${jobs.attempts} + 1`,
    })
    .where(inArray(jobs.id, claimableIds))
    .returning();
}

export async function completeJob(jobId: string): Promise<void> {
  await db
    .update(jobs)
    .set({ status: "completed", completedAt: new Date(), lockedAt: null, lockedBy: null })
    .where(eq(jobs.id, jobId));
}

export async function failJob(
  jobId: string,
  error: string,
  maxAttempts: number,
): Promise<void> {
  const row = await db.query.jobs.findFirst({
    where: eq(jobs.id, jobId),
    columns: { attempts: true },
  });
  if (!row) return;

  const isDead = row.attempts >= maxAttempts;

  await db
    .update(jobs)
    .set({
      status: isDead ? "dead" : "pending",
      runAt: new Date(Date.now() + backoffDelayMs(row.attempts)),
      lockedAt: null,
      lockedBy: null,
      lastError: error,
    })
    .where(eq(jobs.id, jobId));
}

export async function reapStuckJobs(staleSince: Date): Promise<number> {
  const reaped = await db
    .update(jobs)
    .set({ status: "pending", lockedAt: null, lockedBy: null })
    .where(and(eq(jobs.status, "running"), lte(jobs.lockedAt, staleSince)))
    .returning({ id: jobs.id });

  return reaped.length;
}

export async function insertJob(input: NewJob): Promise<{ enqueued: boolean }> {
  const inserted = await db
    .insert(jobs)
    .values({
      id: crypto.randomUUID(),
      organizationId: input.organizationId,
      kind: input.kind,
      payload: input.payload,
      dedupeKey: input.dedupeKey,
      priority: input.priority ?? 100,
      maxAttempts: input.maxAttempts ?? 5,
      runAt: input.runAt ?? new Date(),
    })
    .onConflictDoNothing({
      target: [jobs.kind, jobs.dedupeKey],
      where: sql`${jobs.dedupeKey} is not null and ${jobs.status} in ('pending', 'running')`,
    })
    .returning({ id: jobs.id });

  return { enqueued: inserted.length > 0 };
}

export async function dueSchedules(): Promise<JobScheduleRow[]> {
  return db.query.jobSchedules.findMany({
    where: and(eq(jobSchedules.enabled, true), lte(jobSchedules.nextRunAt, new Date())),
  });
}

export async function advanceSchedule(
  kind: string,
  intervalSeconds: number,
): Promise<void> {
  await db
    .update(jobSchedules)
    .set({ nextRunAt: new Date(Date.now() + intervalSeconds * 1000) })
    .where(eq(jobSchedules.kind, kind));
}

export async function ensureSchedule(kind: string, intervalSeconds: number): Promise<void> {
  await db
    .insert(jobSchedules)
    .values({
      id: crypto.randomUUID(),
      kind,
      intervalSeconds,
      nextRunAt: new Date(),
    })
    .onConflictDoNothing({ target: jobSchedules.kind });
}
