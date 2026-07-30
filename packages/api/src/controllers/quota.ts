import {
  FREE_CHAT_DAILY_LIMIT,
  FREE_INSIGHT_DAILY_LIMIT,
  PRO_CHAT_DAILY_LIMIT,
  PRO_DIGEST_DAILY_LIMIT,
  PRO_INSIGHT_DAILY_LIMIT,
} from "../lib/plan-limits";
import { reserveUsage, releaseUsage } from "../services/ai-usage";
import { getOrgPlan } from "../services/organization";

export class QuotaExceededError extends Error {
  readonly upgrade: boolean;

  constructor(message: string, upgrade: boolean) {
    super(message);
    this.name = "QuotaExceededError";
    this.upgrade = upgrade;
  }
}

export type QuotaFeature = "insight" | "digest" | "chat";

export type QuotaDecision =
  | { allowed: true; used: number; limit: number; release: () => Promise<void> }
  | { allowed: false; used: number; limit: number; upgrade: boolean; message: string };

export type IntervalDecision =
  | { allowed: true }
  | { allowed: false; upgrade: boolean; message: string };

type QuotaConfig = {
  freeLimit: number;
  proLimit: number;
  freeMessage: string;
  proMessage: string;
};

const quotaConfig: Record<QuotaFeature, QuotaConfig> = {
  insight: {
    freeLimit: FREE_INSIGHT_DAILY_LIMIT,
    proLimit: PRO_INSIGHT_DAILY_LIMIT,
    freeMessage: "Daily insight limit reached. Upgrade to Pro for more.",
    proMessage: `Daily insight limit (${PRO_INSIGHT_DAILY_LIMIT}) reached.`,
  },
  chat: {
    freeLimit: FREE_CHAT_DAILY_LIMIT,
    proLimit: PRO_CHAT_DAILY_LIMIT,
    freeMessage: `Free plan allows ${FREE_CHAT_DAILY_LIMIT} chats per day. Upgrade to Pro for more.`,
    proMessage: `Daily chat limit (${PRO_CHAT_DAILY_LIMIT}) reached.`,
  },
  digest: {
    freeLimit: 0,
    proLimit: PRO_DIGEST_DAILY_LIMIT,
    freeMessage: "Free plan allows 1 digest per week. Upgrade to Pro for more.",
    proMessage: `Daily digest limit (${PRO_DIGEST_DAILY_LIMIT}) reached. Resets tomorrow.`,
  },
};

export function todayKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export async function enforceQuota(
  organizationId: string,
  feature: QuotaFeature,
): Promise<QuotaDecision> {
  const plan = await getOrgPlan(organizationId);
  const isPro = plan === "pro";
  const day = todayKey();
  const config = quotaConfig[feature];
  const limit = isPro ? config.proLimit : config.freeLimit;

  const { reserved, used } = await reserveUsage(organizationId, feature, day, limit);

  if (!reserved) {
    return {
      allowed: false,
      used,
      limit,
      upgrade: !isPro,
      message: isPro ? config.proMessage : config.freeMessage,
    };
  }

  return {
    allowed: true,
    used,
    limit,
    release: () => releaseUsage(organizationId, feature, day),
  };
}

export async function enforceInterval(
  intervalMs: number,
  lastAt: Date | null,
): Promise<IntervalDecision> {
  if (!lastAt) return { allowed: true };

  const elapsedMs = Date.now() - lastAt.getTime();
  if (elapsedMs >= intervalMs) return { allowed: true };

  return {
    allowed: false,
    upgrade: true,
    message: "Free plan allows 1 digest per week. Upgrade to Pro for more.",
  };
}
