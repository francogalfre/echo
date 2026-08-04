"use client";

import { useBillingOverview } from "./use-billing-overview";

/**
 * Whether the org has hit its project limit. `false` while billing data is
 * still loading — the server-side check in useCreateProject stays as the
 * source of truth if this client-side gate is ever stale.
 */
export function useAtProjectLimit(): boolean {
  const { state } = useBillingOverview();
  return state.status === "ready" && state.data.projects.used >= state.data.projects.limit;
}
