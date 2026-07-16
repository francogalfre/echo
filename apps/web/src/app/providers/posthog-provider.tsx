"use client";

import { env } from "@echo/env/web";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PostHogJsProvider, usePostHog } from "posthog-js/react";
import { Suspense, useEffect, useRef, useState } from "react";

import { authClient } from "@/lib/auth-client";

const PostHogPageview = (): null => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthogClient = usePostHog();

  useEffect(() => {
    if (!posthogClient) return;

    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    posthogClient.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, posthogClient]);

  return null;
};

const PostHogIdentify = (): null => {
  const { data: session } = authClient.useSession();
  const posthogClient = usePostHog();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!posthogClient) return;

    const user = session?.user;
    if (user && identifiedUserId.current !== user.id) {
      posthogClient.identify(user.id, { email: user.email, name: user.name });
      identifiedUserId.current = user.id;
      return;
    }

    if (!user && identifiedUserId.current) {
      posthogClient.reset();
      identifiedUserId.current = null;
    }
  }, [session, posthogClient]);

  return null;
};

type PostHogProviderProps = {
  readonly children: React.ReactNode;
};

export const PostHogProvider = ({ children }: PostHogProviderProps): React.ReactElement => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const key = env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    posthog.init(key, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      capture_pageview: false,
      capture_pageleave: true,
      person_profiles: "identified_only",
    });
    setInitialized(true);
  }, []);

  if (!initialized) {
    return <>{children}</>;
  }

  return (
    <PostHogJsProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageview />
      </Suspense>
      <PostHogIdentify />
      {children}
    </PostHogJsProvider>
  );
};
