"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";

import { env } from "@echo/env/web";

export function PostHogProvider({ children }: { children: ReactNode }): React.ReactElement {
  const key = env.NEXT_PUBLIC_POSTHOG_KEY;

  useEffect(() => {
    if (!key) {
      return;
    }

    if (!posthog.__loaded) {
      posthog.init(key, {
        api_host: env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
        defaults: "2026-05-30",
        capture_pageview: false,
        capture_pageleave: true,
      });
    } else {
    }
  }, [key]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
