import { auth } from "@echo/auth";
import { db } from "@echo/db";
import { organization } from "@echo/db/schema/auth";
import {
  ORGANIZATION_BUCKET,
  organizationLogoPath,
  organizationLogoUrl,
} from "@echo/db/storage";
import { env } from "@echo/env/server";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";

const EXTENSION_BY_TYPE = new Map<string, string>([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/svg+xml", "svg"],
]);

const MAX_LOGO_BYTES = 1024 * 1024; // 1 MB, matches the bucket limit

export const projects = new Hono();

projects.post("/logo", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return c.json({ error: "Storage is not configured" }, 500);
  }

  const form = await c.req.formData();
  const organizationId = form.get("organizationId");
  const file = form.get("file");

  if (typeof organizationId !== "string" || !(file instanceof File)) {
    return c.json({ error: "Missing organizationId or file" }, 400);
  }

  const extension = EXTENSION_BY_TYPE.get(file.type);

  if (!extension) {
    return c.json({ error: "Unsupported file type" }, 400);
  }

  if (file.size > MAX_LOGO_BYTES) {
    return c.json({ error: "File too large (max 1MB)" }, 400);
  }

  const membership = await db.query.member.findFirst({
    where: (m) => and(eq(m.organizationId, organizationId), eq(m.userId, session.user.id)),
  });

  if (!membership) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const filename = `logo.${extension}`;
  const path = organizationLogoPath(organizationId, filename);

  const upload = await fetch(
    `${env.SUPABASE_URL}/storage/v1/object/${ORGANIZATION_BUCKET}/${path}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": file.type,
        "x-upsert": "true",
      },
      body: await file.arrayBuffer(),
    },
  );

  if (!upload.ok) {
    return c.json({ error: "Upload failed" }, 502);
  }

  const url = organizationLogoUrl(env.SUPABASE_URL, organizationId, filename);
  await db
    .update(organization)
    .set({ logo: url })
    .where(eq(organization.id, organizationId));

  return c.json({ url });
});
