import { uploadOrganizationLogo } from "@echo/api/controllers/organization";
import { Hono } from "hono";

import { authenticate } from "../middleware/auth";

export const projectRoutes = new Hono();

projectRoutes.post("/logo", async (c) => {
  const session = await authenticate(c);
  if (session instanceof Response) return session;

  const form = await c.req.formData();
  const organizationId = form.get("organizationId");
  const file = form.get("file");

  if (typeof organizationId !== "string" || !(file instanceof File)) {
    return c.json({ error: "Missing organizationId or file" }, 400);
  }

  const result = await uploadOrganizationLogo({
    userId: session.user.id,
    organizationId,
    file,
  });

  if (!result.success) return c.json({ error: result.error }, result.status);

  return c.json({ url: result.url });
});
