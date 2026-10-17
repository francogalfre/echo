import { startWorker } from "./worker";

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
