import { submitWidgetFeedback } from "@echo/api/controllers/external-feedback";
import {
  resolveStandaloneComponent,
  resolveShadcnRegistry,
} from "@echo/api/controllers/widget";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";

export const widgetApi = new Hono();

widgetApi.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
  }),
);

const submitSchema = z.object({
  name: z.string().min(1).max(100),
  feedback: z.string().min(1).max(5000),
  email: z.string().email().optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

function getWidgetUrl(req: Request): string {
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "echo.dev";
  return `${proto}://${host}/api/widget`;
}

widgetApi.post("/", async (c) => {
  const authorization = c.req.header("Authorization");

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const parsed = submitSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid request body" }, 400);
  }

  try {
    const result = await submitWidgetFeedback({ authorization, ...parsed.data });
    if (!result.success) return c.json({ error: result.error }, result.status);
    return c.json({ success: true }, 201);
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

widgetApi.get("/:orgSlug/component", async (c) => {
  const orgSlug = c.req.param("orgSlug");
  const widgetUrl = getWidgetUrl(c.req.raw);

  try {
    const result = await resolveStandaloneComponent(orgSlug, widgetUrl);
    if (!result.success) return c.json({ error: result.error }, result.status);

    return c.text(result.code, 200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'attachment; filename="echo-widget.tsx"',
    });
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});

widgetApi.get("/:orgSlug/registry", async (c) => {
  const orgSlug = c.req.param("orgSlug");
  const widgetUrl = getWidgetUrl(c.req.raw);

  try {
    const result = await resolveShadcnRegistry(orgSlug, widgetUrl);
    if (!result.success) return c.json({ error: result.error }, result.status);
    return c.json(result.registry);
  } catch {
    return c.json({ error: "Internal server error" }, 500);
  }
});
