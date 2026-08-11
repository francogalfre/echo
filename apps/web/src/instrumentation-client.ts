import posthog from "posthog-js";

import { env } from "@echo/env/web";

const key = env.NEXT_PUBLIC_POSTHOG_KEY;
const host = env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

if (key) {
  posthog.init(key, {
    api_host: host,
    defaults: "2026-05-30",
    capture_pageview: false,
    capture_pageleave: true,
  });
}
