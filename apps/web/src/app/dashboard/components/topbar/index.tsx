import type { ReactNode } from "react";

import { MobileSidebar } from "../sidebar/mobile-sidebar";

import { Breadcrumb } from "./breadcrumb";
import { CommandSearch } from "./command-search";
import { Notifications } from "./notifications";

type TopbarProps = {
  usageMeterSlot: ReactNode;
};

export const Topbar = ({ usageMeterSlot }: TopbarProps): React.ReactElement => {
  return (
    <header className="z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-sidebar px-3 sm:gap-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-1">
        <MobileSidebar usageMeterSlot={usageMeterSlot} />
        <Breadcrumb />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <CommandSearch />
        <Notifications />
      </div>
    </header>
  );
};
