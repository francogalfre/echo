import { createServerTrpc } from "@/lib/trpc-server";

import { TeamSection } from "./team-section";

export async function TeamData(): Promise<React.ReactElement> {
  const api = await createServerTrpc();
  const billingOverview = await api.billing.overview.query();

  return <TeamSection initialBillingOverview={billingOverview} />;
}
