import type { ReactNode } from "react";

import { Sidebar } from "./components/sidebar";

type Props = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: Props): React.ReactElement => {
  return (
    <div className="flex min-h-svh">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-background">{children}</main>
    </div>
  );
};

export default DashboardLayout;
