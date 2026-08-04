import { env } from "@echo/env/server";
import { cors } from "hono/cors";

export const dashboardCors = cors({
  origin: env.CORS_ORIGIN,
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

export const widgetCors = cors({
  origin: "*",
  allowMethods: ["POST", "OPTIONS"],
  allowHeaders: ["Authorization", "Content-Type"],
});
