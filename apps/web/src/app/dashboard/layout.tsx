import type { ReactNode } from "react";

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
        <div className="flex min-w-0 flex-1 flex-col pl-64">
          <Topbar />
          <main className="flex-1 overflow-auto bg-background">{children}</main>
        </div>
      </div>
    </MotionProvider>
  );
};

export default DashboardLayout;
