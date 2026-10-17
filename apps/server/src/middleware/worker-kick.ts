import { waitUntil } from "@vercel/functions";
import type { MiddlewareHandler } from "hono";

import { runWorkerOnce } from "../worker";

const minIntervalMs = 30_000;
const budgetMs = 120_000;

let running = false;
let lastRunAt = 0;

function kickWorker(): void {
  if (running) return;
  running = true;
  lastRunAt = Date.now();

  const task = runWorkerOnce({
    concurrency: 5,
    workerId: `req-${crypto.randomUUID().slice(0, 8)}`,
    budgetMs,
  })
    .catch((error: unknown) => console.error("[echo:worker] kick failed", error))
    .finally(() => {
      running = false;
    });

  waitUntil(task);
}

export const workerKick: MiddlewareHandler = async (c, next) => {
  await next();

  const isSubmit = c.req.method === "POST" && c.req.path.startsWith("/api/feedback");
  if (isSubmit || Date.now() - lastRunAt >= minIntervalMs) kickWorker();
};
