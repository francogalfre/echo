import type { ReactNode } from "react";

import { SidebarContent } from "./sidebar-content";

type SidebarProps = {
  usageMeterSlot: ReactNode;
};

export const Sidebar = ({ usageMeterSlot }: SidebarProps): React.ReactElement => {
  return (
    <aside className="fixed hidden h-screen w-64 min-w-64 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
      <SidebarContent usageMeterSlot={usageMeterSlot} />
    </aside>
  );
};

export { MobileSidebar } from "./mobile-sidebar";
