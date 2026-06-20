import { auth } from "@echo/auth";
import { uploadOrganizationLogo } from "@echo/api/controllers/organization";
import { Hono } from "hono";

export const projects = new Hono();

projects.post("/logo", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

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

  if (!result.success) {
    return c.json({ error: result.error }, result.status);
  }

  return c.json({ url: result.url });
});
