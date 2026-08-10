"use client";

import { useSession } from "@/lib/auth-client";
import { identify, reset } from "@/lib/posthog";
import { useEffect } from "react";

export function PostHogAuthSync(): null {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      identify(session.user.id, {
        email: session.user.email ?? undefined,
        name: session.user.name ?? undefined,
      });
    } else {
      reset();
    }
  }, [session]);

  return null;
}
