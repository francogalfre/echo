import { hasRedis, redis } from "@echo/api/lib/redis";
import { Ratelimit } from "@upstash/ratelimit";
import type { Context, Next } from "hono";

const widgetReadLimiter =
  hasRedis && redis
    ? new Ratelimit({
        redis,
        analytics: true,
        limiter: Ratelimit.slidingWindow(20, "1 m"),
        prefix: "echo:rl:widget-read",
      })
    : null;

function logRedisFailure(context: string, error: unknown): void {
  console.error(`redis rate-limit transport error in ${context}, failing open`, error);
}

export async function guardWidgetRead(ip: string, orgSlug: string): Promise<boolean> {
  if (!widgetReadLimiter) return true;

  try {
    const result = await widgetReadLimiter.limit(`${ip}:${orgSlug}`);
    return result.success;
  } catch (error) {
    logRedisFailure("guardWidgetRead", error);
    return true;
  }
}

function clientIp(c: Context): string {
  return (
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ??
    c.req.header("x-real-ip") ??
    "unknown"
  );
}

export async function widgetReadRateLimit(
  c: Context,
  next: Next,
): Promise<Response | void> {
  const orgSlug = c.req.param("orgSlug") ?? "unknown";
  const allowed = await guardWidgetRead(clientIp(c), orgSlug);

  if (!allowed) return c.json({ error: "Too many requests" }, 429);

  await next();
}
