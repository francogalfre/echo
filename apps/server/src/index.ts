import { createContext } from "@echo/api/context";
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

const app = new Hono();

app.onError((_err, c) => c.json({ error: "Internal server error" }, 500));

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

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
