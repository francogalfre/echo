"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@echo/ui/components/dropdown-menu";
import { Icons } from "@echo/ui/components/icons";

export const Notifications = (): React.ReactElement => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground outline-none transition-colors hover:bg-foreground/5 hover:text-foreground">
        <Icons.bell className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="end" className="w-80 p-0 shadow-md">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-medium text-foreground">Notifications</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Icons.bell className="size-5" />
          </span>
          <p className="text-sm font-medium text-foreground">You&apos;re all caught up</p>
          <p className="text-xs text-muted-foreground">
            New notifications will show up here.
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
