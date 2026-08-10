import posthog from "posthog-js";

import { env } from "@echo/env/web";

const enabled = !!env.NEXT_PUBLIC_POSTHOG_KEY;

export function capture(event: string, properties?: Record<string, unknown>): void {
  if (!enabled) return;
  posthog.capture(event, properties);
}

export function identify(userId: string, properties?: Record<string, unknown>): void {
  if (!enabled) return;
  posthog.identify(userId, properties);
}

export function reset(): void {
  if (!enabled) return;
  posthog.reset();
}

export function pageview(url?: string): void {
  if (!enabled) return;
  posthog.capture("$pageview", url ? { $current_url: url } : undefined);
}

export function captureChatOpened(): void {
  capture("chat_opened");
}

export function captureChatMessageSent(properties?: { length?: number }): void {
  capture("chat_message_sent", properties);
}

export function captureFeedbackSubmitted(properties?: {
  sentiment?: string;
  source?: string;
}): void {
  capture("feedback_submitted", properties);
}

export function captureUserSignedUp(properties?: { method?: string }): void {
  capture("user_signed_up", properties);
}

export function captureUserLoggedIn(properties?: { method?: string }): void {
  capture("user_logged_in", properties);
}

export function capturePlanUpgraded(properties?: { checkoutId?: string }): void {
  capture("plan_upgraded", properties);
}

export function captureDigestGenerated(properties?: { feedbackCount?: number }): void {
  capture("digest_generated", properties);
}

export function captureInsightGenerated(): void {
  capture("insight_generated");
}
