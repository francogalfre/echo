import type { ReactNode } from "react";

import { AvatarSetupModal } from "./components/avatar-setup-modal";
import { MotionProvider } from "./components/motion-provider";
import { Sidebar } from "./components/sidebar";
import { Topbar } from "./components/topbar";

type Props = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: Props): React.ReactElement => {
  return (
    <MotionProvider>
      <div className="flex h-svh">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col pl-72">
          <Topbar />
          <main className="flex-1 overflow-auto bg-background">{children}</main>
        </div>
        <AvatarSetupModal />
      </div>
    </MotionProvider>
  );
};

export default DashboardLayout;
