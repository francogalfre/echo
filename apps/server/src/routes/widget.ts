import { submitWidgetFeedback } from "@echo/api/controllers/feedback/external";
import {
  resolveStandaloneComponent,
  resolveShadcnRegistry,
} from "@echo/api/controllers/widget";
import { Hono } from "hono";

import { createSubmitHandler } from "@/lib/submit";
import { getWidgetUrl } from "@/lib/widget-url";
import { dashboardCors, widgetCors } from "@/middleware/cors";
import { widgetReadRateLimit } from "@/middleware/rate-limit";

export const widgetRoutes = new Hono();

widgetRoutes.use("/", widgetCors);
widgetRoutes.use("/:orgSlug/component", dashboardCors, widgetReadRateLimit);
widgetRoutes.use("/:orgSlug/registry", dashboardCors, widgetReadRateLimit);

widgetRoutes.post("/", createSubmitHandler(submitWidgetFeedback));

widgetRoutes.get("/:orgSlug/component", async (c) => {
  const result = await resolveStandaloneComponent(
    c.req.param("orgSlug"),
    getWidgetUrl(c.req.raw),
  );

  if (!result.success) return c.json({ error: result.error }, result.status);

  return c.text(result.code, 200, {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Disposition": 'attachment; filename="echo-widget.tsx"',
  });
});

widgetRoutes.get("/:orgSlug/registry", async (c) => {
  const result = await resolveShadcnRegistry(
    c.req.param("orgSlug"),
    getWidgetUrl(c.req.raw),
  );

  if (!result.success) return c.json({ error: result.error }, result.status);

  return c.json(result.registry);
});
