import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getActiveRole } from "../../lib/get-active-role";

type TeamSettingsLayoutProps = {
  children: ReactNode;
};

const TeamSettingsLayout = async ({
  children,
}: TeamSettingsLayoutProps): Promise<React.ReactElement> => {
  const role = await getActiveRole();
  if (role === "member") redirect("/dashboard/settings/account");

  return <>{children}</>;
};

export default TeamSettingsLayout;
