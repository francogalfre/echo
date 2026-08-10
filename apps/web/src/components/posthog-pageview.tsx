"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { pageview } from "@/lib/posthog";

export function PostHogPageView(): null {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      pageview(pathname);
    }
  }, [pathname]);

  return null;
}
