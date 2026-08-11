import { Ratelimit } from "@upstash/ratelimit";

import { sha256 } from "./crypto";
import { redis } from "./redis";
import { logError } from "./logger";

type Allowed = { allowed: true };
type Blocked = { allowed: false; silent: boolean; message: string };
export type GuardResult = Allowed | Blocked;

const ipLimiter = redis
  ? new Ratelimit({
      redis,
      analytics: true,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      prefix: "echo:rl:ip",
    })
  : null;

const slugLimiter = redis
  ? new Ratelimit({
      redis,
      analytics: true,
      limiter: Ratelimit.slidingWindow(500, "1 h"),
      prefix: "echo:rl:slug",
    })
  : null;

const keyLimiter = redis
  ? new Ratelimit({
      redis,
      analytics: true,
      limiter: Ratelimit.slidingWindow(60, "1 m"),
      prefix: "echo:rl:key",
    })
  : null;

const aiOrgLimiter = redis
  ? new Ratelimit({
      redis,
      analytics: true,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      prefix: "echo:rl:ai-org",
    })
  : null;

function hashContent(ip: string, content: string): string {
  return sha256(`${ip}:${content.trim().toLowerCase()}`);
}

function logRedisFailure(context: string, error: unknown): void {
  logError(`redis rate-limit transport error in ${context}, failing open`, error);
}

export async function guardSubmission(
  ip: string,
  slug: string,
  content: string,
): Promise<GuardResult> {
  if (!redis || !ipLimiter || !slugLimiter) return { allowed: true };

  try {
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
  } catch (error) {
    logRedisFailure("guardSubmission.limit", error);
    return { allowed: true };
  }

  try {
    const dedupKey = `echo:dedup:${hashContent(ip, content)}`;
    const isNew = await redis.set(dedupKey, "1", { nx: true, ex: 86400 });

    if (isNew === null) {
      return { allowed: false, silent: true, message: "" };
    }
  } catch (error) {
    logRedisFailure("guardSubmission.set", error);
  }

  return { allowed: true };
}

export async function guardAiOrganization(organizationId: string): Promise<GuardResult> {
  if (!redis || !aiOrgLimiter) return { allowed: true };

  try {
    const result = await aiOrgLimiter.limit(organizationId);

    if (!result.success) {
      return {
        allowed: false,
        silent: false,
        message: "Too many AI requests for this project. Please slow down.",
      };
    }
  } catch (error) {
    logRedisFailure("guardAiOrganization.limit", error);
    return { allowed: true };
  }

  return { allowed: true };
}

export async function guardKeySubmission(key: string): Promise<GuardResult> {
  if (!redis || !keyLimiter) return { allowed: true };

  try {
    const result = await keyLimiter.limit(key);

    if (!result.success) {
      return {
        allowed: false,
        silent: false,
        message: "Too many requests for this API key. Please slow down.",
      };
    }
  } catch (error) {
    logRedisFailure("guardKeySubmission.limit", error);
    return { allowed: true };
  }

  return { allowed: true };
}
