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

const chatStreamLimiter =
  hasRedis && redis
    ? new Ratelimit({
        redis,
        analytics: true,
        limiter: Ratelimit.slidingWindow(15, "1 m"),
        prefix: "echo:rl:chat-stream",
      })
    : null;

const aiTrpcLimiter =
  hasRedis && redis
    ? new Ratelimit({
        redis,
        analytics: true,
        limiter: Ratelimit.slidingWindow(15, "1 m"),
        prefix: "echo:rl:ai-trpc",
      })
    : null;

const aiTrpcProcedures = ["digest.generate", "feedback.insight"];

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

const trustedProxyHops = 1;

function clientIp(c: Context): string {
  const forwarded = c.req.header("x-forwarded-for");

  if (forwarded) {
    const hops = forwarded
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
    const trusted = hops.at(-trustedProxyHops);
    if (trusted) return trusted;
  }

  return c.req.header("x-real-ip") ?? "unknown";
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

export async function guardChatStream(ip: string): Promise<boolean> {
  if (!chatStreamLimiter) return true;

  try {
    const result = await chatStreamLimiter.limit(ip);
    return result.success;
  } catch (error) {
    logRedisFailure("guardChatStream", error);
    return true;
  }
}

export async function chatStreamRateLimit(
  c: Context,
  next: Next,
): Promise<Response | void> {
  const allowed = await guardChatStream(clientIp(c));

  if (!allowed) return c.json({ error: "Too many requests" }, 429);

  await next();
}

export async function guardAiTrpc(ip: string): Promise<boolean> {
  if (!aiTrpcLimiter) return true;

  try {
    const result = await aiTrpcLimiter.limit(ip);
    return result.success;
  } catch (error) {
    logRedisFailure("guardAiTrpc", error);
    return true;
  }
}

export async function aiTrpcRateLimit(c: Context, next: Next): Promise<Response | void> {
  const path = c.req.path;
  const isAiProcedure = aiTrpcProcedures.some((procedure) => path.includes(procedure));

  if (!isAiProcedure) return next();

  const allowed = await guardAiTrpc(clientIp(c));
  if (!allowed) return c.json({ error: "Too many requests" }, 429);

  await next();
}
