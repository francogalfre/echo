import type { ReactNode } from "react";

import { AvatarSetupModal } from "./components/avatar-setup-modal";
import { Sidebar } from "./components/sidebar";

type Props = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: Props): React.ReactElement => {
  return (
    <div className="flex min-h-svh">
      <Sidebar />
      <main className="flex-1 overflow-auto pl-72 bg-background">{children}</main>
      <AvatarSetupModal />
    </div>
  );
};

export default DashboardLayout;
