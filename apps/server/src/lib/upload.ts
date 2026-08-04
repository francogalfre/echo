import type { UploadLogoResult } from "@echo/api/types";
import type { Context } from "hono";

import { authenticate } from "@/middleware/auth";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

type UploadFn = (input: {
  userId: string;
  organizationId: string;
  file: File;
}) => Promise<UploadLogoResult>;

export function createUploadHandler(upload: UploadFn): (c: Context) => Promise<Response> {
  return async (c: Context): Promise<Response> => {
    const session = await authenticate(c);
    if (session instanceof Response) return session;

    const contentLength = Number(c.req.header("content-length") ?? 0);
    if (contentLength > MAX_UPLOAD_BYTES) {
      return c.json({ error: "Request body too large" }, 413);
    }

    const form = await c.req.formData();
    const organizationId = form.get("organizationId");
    const file = form.get("file");

    if (typeof organizationId !== "string" || !(file instanceof File)) {
      return c.json({ error: "Missing organizationId or file" }, 400);
    }

    const result = await upload({ userId: session.user.id, organizationId, file });
    if (!result.success) return c.json({ error: result.error }, result.status);

    return c.json({ url: result.url });
  };
}
