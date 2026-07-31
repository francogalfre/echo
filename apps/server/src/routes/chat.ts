import { resolveChatOrganization, streamChatTurn } from "@echo/api/controllers/chat";
import { Hono } from "hono";
import { z } from "zod";

import { authenticate } from "@/middleware/auth";

type SessionWithOrg = { activeOrganizationId?: string | null };

const streamRequestSchema = z.object({
  conversationId: z.string().min(1).optional(),
  message: z.string().min(1).max(4000),
});

export const chatRoutes = new Hono();

chatRoutes.post("/stream", async (c) => {
  const session = await authenticate(c);
  if (session instanceof Response) return session;

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const parsed = streamRequestSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "Invalid request body" }, 400);

  const { activeOrganizationId } = session.session as SessionWithOrg;
  const context = await resolveChatOrganization(session.user.id, activeOrganizationId);
  if (!context) return c.json({ error: "No active organization", upgrade: false }, 400);

  const result = await streamChatTurn(
    context.organizationId,
    session.user.id,
    parsed.data.conversationId ?? null,
    parsed.data.message,
  );

  if (!result.success) {
    return c.json({ error: result.error, upgrade: result.upgrade }, result.status);
  }

  return result.response;
});
