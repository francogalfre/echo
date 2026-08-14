import { createServerTrpc } from "@/lib/trpc-server";

import { DashboardClient } from "./dashboard-client";

export async function DashboardOverviewData(): Promise<React.ReactElement> {
  const api = await createServerTrpc();
  const data = await api.dashboard.overview.query({ range: "all" });

  return <DashboardClient initialData={data} />;
}
