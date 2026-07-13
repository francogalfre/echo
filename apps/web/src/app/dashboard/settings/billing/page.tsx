import { Suspense } from "react";

import { BillingData } from "./components/billing-data";
import { BillingSkeleton } from "./components/billing-section";

const BillingSettingsPage = (): React.ReactElement => (
  <Suspense fallback={<BillingSkeleton />}>
    <BillingData />
  </Suspense>
);

export default BillingSettingsPage;
