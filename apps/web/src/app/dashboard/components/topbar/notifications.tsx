"use client";

import { useEffect, useState } from "react";

import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@echo/ui/components/popover";
import { Skeleton } from "@echo/ui/components/skeleton";

import type { NotificationItem } from "@echo/api/types";

import { trpc } from "@/lib/trpc";
import { useAsyncResource } from "@/lib/use-async-resource";

import { NotificationRow } from "./notification-row";

type NotificationsData = {
  items: NotificationItem[];
  unread: number;
};

const POLL_INTERVAL_MS = 60_000;
const SKELETON_COUNT = 3;

function NotificationsSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-2 px-3 py-2.5">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <Skeleton key={index} className="h-12 rounded-md" />
      ))}
    </div>
  );
}

export const Notifications = (): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const { state, refresh } = useAsyncResource<NotificationsData>(() =>
    trpc.notifications.list.query(),
  );

  useEffect(() => {
    const interval = setInterval(() => refresh(), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  const unread = state.status === "ready" ? state.data.unread : 0;

  const handleOpenChange = (nextOpen: boolean): void => {
    setOpen(nextOpen);
    if (!nextOpen || unread === 0) return;
    trpc.notifications.markAllRead.mutate().then(() => refresh());
  };

  const closeMenu = (): void => setOpen(false);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        aria-label="Notifications"
        className="relative flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground outline-none transition-colors hover:border-foreground/20 hover:text-foreground"
      >
        <Icons.bell className="size-4" />
        {unread > 0 ? (
          <span className="absolute top-0.5 right-0.5 size-1.5 rounded-full bg-accent ring-2 ring-background" />
        ) : null}
      </PopoverTrigger>

      <PopoverContent side="bottom" align="end" className="w-80 gap-0 p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-medium text-foreground">Notifications</p>
        </div>

        {state.status === "loading" ? <NotificationsSkeleton /> : null}

        {state.status === "error" ? (
          <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
            <p className="text-xs text-muted-foreground">Failed to load notifications</p>
            <button
              type="button"
              onClick={state.retry}
              className="text-xs font-medium text-foreground underline underline-offset-2"
            >
              Retry
            </button>
          </div>
        ) : null}

        {state.status === "ready" && state.data.items.length === 0 ? (
          <EmptyState
            icon={<Icons.bell />}
            title="You're all caught up"
            description="New notifications will show up here."
            className="py-10"
          />
        ) : null}

        {state.status === "ready" && state.data.items.length > 0 ? (
          <div className="flex max-h-96 flex-col gap-0.5 overflow-y-auto py-1">
            {state.data.items.map((item) => (
              <NotificationRow key={item.id} item={item} onNavigate={closeMenu} />
            ))}
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
};
