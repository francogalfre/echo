import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getActiveRole } from "../lib/get-active-role";

type CollectLayoutProps = {
  children: ReactNode;
};

const CollectLayout = async ({
  children,
}: CollectLayoutProps): Promise<React.ReactElement> => {
  const role = await getActiveRole();
  if (role === "member") redirect("/dashboard");

  return <>{children}</>;
};

export default CollectLayout;
