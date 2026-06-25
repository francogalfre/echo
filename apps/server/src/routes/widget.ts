import { submitWidgetFeedback } from "@echo/api/controllers/external-feedback";
import {
  resolveStandaloneComponent,
  resolveShadcnRegistry,
} from "@echo/api/controllers/widget";
import { Hono } from "hono";

import { widgetCors } from "../middleware/cors";
import { createSubmitHandler } from "../lib/submit";
import { getWidgetUrl } from "../lib/widget-url";

export const widgetRoutes = new Hono();

widgetRoutes.use("/*", widgetCors);

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
