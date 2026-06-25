import { cors } from "hono/cors";

export const widgetCors = cors({
  origin: "*",
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Authorization", "Content-Type"],
});
