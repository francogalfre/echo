import { createServerTrpc } from "@/lib/trpc-server";

import { TeamSection } from "./components/team-section";

const TeamSettingsPage = async (): Promise<React.ReactElement> => {
  const api = await createServerTrpc();
  const billingOverview = await api.billing.overview.query();

  return <TeamSection initialBillingOverview={billingOverview} />;
};

export default TeamSettingsPage;
