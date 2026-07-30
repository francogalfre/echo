import { createContext } from "@echo/api/context";
import { hasRedis } from "@echo/api/lib/redis";
import { appRouter } from "@echo/api/routers/index";
import { auth } from "@echo/auth";
import { env } from "@echo/env/server";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { feedbackRoutes } from "./routes/feedback";
import { projectRoutes } from "./routes/projects";
import { widgetRoutes } from "./routes/widget";
import { startWorker } from "./worker";

if (env.NODE_ENV === "production" && !hasRedis) {
  throw new Error(
    "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production",
  );
}

if (!hasRedis) {
  console.warn("Redis is not configured — rate limiting is disabled");
}

if (env.WORKER_ENABLED) {
  void startWorker({
    concurrency: 5,
    pollIntervalMs: 2000,
    workerId: `dev-${process.pid}`,
  }).then(() => console.warn("[echo:worker] embedded worker started"));
}

const app = new Hono();

app.onError((_err, c) => c.json({ error: "Internal server error" }, 500));

app.use(logger());

const dashboardCors = cors({
  origin: env.CORS_ORIGIN,
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

app.use("/trpc/*", dashboardCors);
app.use("/api/auth/*", dashboardCors);
app.use("/api/projects/*", dashboardCors);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api/projects", projectRoutes);
app.route("/api/feedback", feedbackRoutes);
app.route("/api/widget", widgetRoutes);

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => createContext({ context }),
  }),
);

app.get("/", (c) => c.text("OK"));

export default app;
