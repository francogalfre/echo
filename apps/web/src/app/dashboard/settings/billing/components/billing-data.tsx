import { createServerTrpc } from "@/lib/trpc-server";

import { BillingSection } from "./billing-section";

export async function BillingData(): Promise<React.ReactElement> {
  const api = await createServerTrpc();
  const data = await api.billing.overview.query();

  return <BillingSection initialData={data} />;
}
