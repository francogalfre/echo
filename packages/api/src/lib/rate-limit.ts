import { createHash } from "crypto";

import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

type Allowed = { allowed: true };
type Blocked = { allowed: false; silent: boolean; message: string };
export type GuardResult = Allowed | Blocked;

const ipLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "echo:rl:ip",
});

const slugLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(500, "1 h"),
  prefix: "echo:rl:slug",
});

function hashContent(ip: string, content: string): string {
  return createHash("sha256").update(`${ip}:${content.trim().toLowerCase()}`).digest("hex");
}

export async function guardSubmission(
  ip: string,
  slug: string,
  content: string,
): Promise<GuardResult> {
  if (!redis || !ipLimiter || !slugLimiter) return { allowed: true };

  const [ipResult, slugResult] = await Promise.all([
    ipLimiter.limit(ip),
    slugLimiter.limit(slug),
  ]);

  if (!ipResult.success) {
    return {
      allowed: false,
      silent: false,
      message: "Too many submissions. Please wait before trying again.",
    };
  }

  if (!slugResult.success) {
    return {
      allowed: false,
      silent: false,
      message: "This page is receiving too many submissions right now.",
    };
  }

  const dedupKey = `echo:dedup:${hashContent(ip, content)}`;
  const isNew = await redis.set(dedupKey, "1", { nx: true, ex: 86400 });

  if (isNew === null) {
    return { allowed: false, silent: true, message: "" };
  }

  return { allowed: true };
}
