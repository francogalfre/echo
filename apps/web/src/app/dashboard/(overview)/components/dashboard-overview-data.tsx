import { createServerTrpc } from "@/lib/trpc-server";

import { DashboardClient } from "./dashboard-client";

export async function DashboardOverviewData(): Promise<React.ReactElement> {
  const api = await createServerTrpc();
  const data = await api.dashboard.overview.query({ range: "30d" });

  return <DashboardClient initialData={data} />;
}
