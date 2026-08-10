export type Plan = "free" | "pro";

export function isPro(plan: string | null | undefined): boolean {
  return plan === "pro";
}

export const FREE_FEEDBACK_LIMIT = 300;
export const FREE_INSIGHT_DAILY_LIMIT = 3;
export const PRO_INSIGHT_DAILY_LIMIT = 50;
export const FREE_DIGEST_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;
export const PRO_DIGEST_DAILY_LIMIT = 10;
export const FREE_PROJECT_LIMIT = 1;
export const PRO_PROJECT_LIMIT = 5;
export const FREE_CHAT_WEEKLY_LIMIT = 10;
export const PRO_CHAT_WEEKLY_LIMIT = 50;
