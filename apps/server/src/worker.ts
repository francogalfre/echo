import { enqueue } from "@echo/api/controllers/enqueue";
import { ensureDefaultSchedules } from "@echo/api/jobs/bootstrap";
import { JOB_KINDS, type JobKind } from "@echo/api/jobs/kinds";
import { jobRegistry } from "@echo/api/jobs/registry";
import {
  advanceSchedule,
  claimJobs,
  completeJob,
  dueSchedules,
  failJob,
  reapStuckJobs,
  type JobRow,
} from "@echo/api/services/jobs";

const REAP_INTERVAL_MS = 60_000;
const REAP_STALE_MS = 5 * 60 * 1000;
const SHUTDOWN_TIMEOUT_MS = 30_000;

function isJobKind(kind: string): kind is JobKind {
  return (JOB_KINDS as readonly string[]).includes(kind);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function startWorker(options: {
  concurrency: number;
  pollIntervalMs: number;
  workerId: string;
}): Promise<() => Promise<void>> {
  const { concurrency, pollIntervalMs, workerId } = options;

  let stopped = false;
  let lastReapAt = 0;
  const inFlight = new Map<string, Promise<void>>();

  await ensureDefaultSchedules();

  async function executeJob(job: JobRow): Promise<void> {
    try {
      if (!isJobKind(job.kind)) {
        throw new Error(`No handler registered for job kind "${job.kind}"`);
      }
      await jobRegistry[job.kind](job.payload);
      await completeJob(job.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[echo:worker] job ${job.id} (${job.kind}) failed`, error);
      await failJob(job.id, message, job.maxAttempts);
    }
  }

  function dispatch(job: JobRow): void {
    const task = executeJob(job).finally(() => inFlight.delete(job.id));
    inFlight.set(job.id, task);
  }

  async function advanceDueSchedules(): Promise<number> {
    const schedules = await dueSchedules();
    for (const schedule of schedules) {
      if (!isJobKind(schedule.kind)) {
        console.error(`[echo:worker] schedule "${schedule.kind}" is not a known job kind`);
        continue;
      }
      await enqueue(schedule.kind, schedule.payload as Record<string, unknown>);
      await advanceSchedule(schedule.kind, schedule.intervalSeconds);
    }
    return schedules.length;
  }

  async function tick(): Promise<void> {
    if (Date.now() - lastReapAt >= REAP_INTERVAL_MS) {
      lastReapAt = Date.now();
      const reaped = await reapStuckJobs(new Date(Date.now() - REAP_STALE_MS));
      if (reaped > 0) console.warn(`[echo:worker] reaped ${reaped} stuck job(s)`);
    }

    const advancedSchedules = await advanceDueSchedules();

    const capacity = concurrency - inFlight.size;
    const claimed = capacity > 0 ? await claimJobs(workerId, capacity) : [];
    for (const job of claimed) {
      dispatch(job);
    }

    if (claimed.length === 0 && advancedSchedules === 0) {
      const jitter = 0.75 + Math.random() * 0.5;
      await sleep(pollIntervalMs * jitter);
    }
  }

  async function loop(): Promise<void> {
    while (!stopped) {
      try {
        await tick();
      } catch (error) {
        console.error("[echo:worker] tick failed", error);
        await sleep(pollIntervalMs);
      }
    }
  }

  const loopPromise = loop();

  async function stop(): Promise<void> {
    stopped = true;
    await loopPromise;
    await Promise.race([Promise.allSettled(inFlight.values()), sleep(SHUTDOWN_TIMEOUT_MS)]);
  }

  return stop;
}

if (import.meta.main) {
  const workerId = `${process.pid}-${crypto.randomUUID().slice(0, 8)}`;
  const stopPromise = startWorker({
    concurrency: 5,
    pollIntervalMs: 2000,
    workerId,
  });

  console.warn(`[echo:worker] started (${workerId})`);

  let shuttingDown = false;
  async function shutdown(signal: string): Promise<void> {
    if (shuttingDown) return;
    shuttingDown = true;
    console.warn(`[echo:worker] received ${signal}, shutting down`);
    const stop = await stopPromise;
    await stop();
    process.exit(0);
  }

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
}
