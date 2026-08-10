import posthog from "posthog-js";

import { env } from "@echo/env/web";

const key = env.NEXT_PUBLIC_POSTHOG_KEY;
const host = env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

if (key) {
  // eslint-disable-next-line no-console
  console.log("[PostHog] Initializing with key:", key.slice(0, 8) + "...");

  posthog.init(key, {
    api_host: host,
    defaults: "2026-05-30",
    capture_pageview: false,
    capture_pageleave: true,
    loaded: (ph) => {
      // eslint-disable-next-line no-console
      console.log(
        "[PostHog] Loaded successfully. Distinct ID:",
        ph.get_distinct_id?.() ?? "unknown",
      );
    },
    // @ts-expect-error — on_unable_to_send is not in types but exists in the SDK
    on_unable_to_send: (error: unknown) => {
      // eslint-disable-next-line no-console
      console.warn("[PostHog] Unable to send event:", error);
    },
  });
} else {
  // eslint-disable-next-line no-console
  console.log("[PostHog] Skipped — NEXT_PUBLIC_POSTHOG_KEY not set");
}
