import { auth } from "@echo/auth";
import type { Context as HonoContext } from "hono";

export type CreateContextOptions = {
  context: HonoContext;
};

function extractIp(context: HonoContext): string {
  return (
    context.req.header("cf-connecting-ip") ??
    context.req.header("x-real-ip") ??
    context.req.header("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export async function createContext({ context }: CreateContextOptions): Promise<{
  session: Awaited<ReturnType<typeof auth.api.getSession>>;
  ip: string;
}> {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });

  return {
    session,
    ip: extractIp(context),
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
