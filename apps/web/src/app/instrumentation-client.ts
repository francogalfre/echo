import posthog from "posthog-js";

import { env } from "@echo/env/web";

if (env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    defaults: "2026-05-30",
    capture_pageview: false,
    capture_pageleave: true,
    loaded: (ph) => {
      if (env.NEXT_PUBLIC_POSTHOG_HOST) {
        ph.config.api_host = env.NEXT_PUBLIC_POSTHOG_HOST;
      }
    },
  });
}
