"use client";

import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@echo/ui/components/popover";

export const Notifications = (): React.ReactElement => {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="Notifications"
        className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground outline-none transition-colors hover:border-foreground/20 hover:text-foreground"
      >
        <Icons.bell className="size-4" />
      </PopoverTrigger>

      <PopoverContent side="bottom" align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium text-foreground">Notifications</p>
        </div>
        <EmptyState
          icon={<Icons.bell />}
          title="You're all caught up"
          description="New notifications will show up here."
          className="py-10"
        />
      </PopoverContent>
    </Popover>
  );
};
