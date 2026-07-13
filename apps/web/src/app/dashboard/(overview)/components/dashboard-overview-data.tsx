import { createServerTrpc } from "@/lib/trpc-server";

import { DashboardClient } from "./dashboard-client";

export async function DashboardOverviewData(): Promise<React.ReactElement> {
  const api = await createServerTrpc();
  const [data, apiKeys] = await Promise.all([
    api.dashboard.overview.query({ range: "30d" }),
    api.apiKeys.get.query(),
  ]);

  return <DashboardClient initialData={data} hasApiKey={apiKeys !== null} />;
}
