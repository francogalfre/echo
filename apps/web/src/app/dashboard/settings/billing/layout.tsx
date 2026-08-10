import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getActiveRole } from "../../lib/get-active-role";

type BillingSettingsLayoutProps = {
  children: ReactNode;
};

const BillingSettingsLayout = async ({
  children,
}: BillingSettingsLayoutProps): Promise<React.ReactElement> => {
  const role = await getActiveRole();
  if (role === "member") redirect("/dashboard/settings/account");

  return <>{children}</>;
};

export default BillingSettingsLayout;
