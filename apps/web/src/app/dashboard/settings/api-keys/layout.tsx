import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getActiveRole } from "../../lib/get-active-role";

type ApiKeysSettingsLayoutProps = {
  children: ReactNode;
};

const ApiKeysSettingsLayout = async ({
  children,
}: ApiKeysSettingsLayoutProps): Promise<React.ReactElement> => {
  const role = await getActiveRole();
  if (role === "member") redirect("/dashboard/settings/account");

  return <>{children}</>;
};

export default ApiKeysSettingsLayout;
