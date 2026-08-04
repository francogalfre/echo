import { createServerTrpc } from "@/lib/trpc-server";

import { DashboardClient } from "./dashboard-client";

export async function DashboardOverviewData(): Promise<React.ReactElement> {
  const api = await createServerTrpc();
  const [data, apiKeys, digestState] = await Promise.all([
    api.dashboard.overview.query({ range: "all" }),
    api.apiKeys.get.query(),
    api.digest.get.query(),
  ]);

  return (
    <DashboardClient
      initialData={data}
      hasApiKey={apiKeys.length > 0}
      initialDigest={{
        digest: digestState.digest,
        generatedAt: digestState.generatedAt ? new Date(digestState.generatedAt) : null,
        feedbackCount: digestState.feedbackCount,
      }}
    />
  );
}
