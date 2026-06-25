import { auth } from "@echo/auth";
import type { Context } from "hono";

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export async function authenticate(c: Context): Promise<NonNullable<Session> | Response> {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "Unauthorized" }, 401);
  return session;
}
