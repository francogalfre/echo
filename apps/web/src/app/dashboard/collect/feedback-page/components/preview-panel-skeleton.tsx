"use client";

import { Skeleton } from "@echo/ui/components/skeleton";

export const PreviewPanelSkeleton = (): React.ReactElement => (
  <div className="overflow-hidden rounded-2xl border border-border">
    <div className="rounded-t-2xl border-b border-border bg-muted/40 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex shrink-0 gap-1.5">
          <Skeleton className="size-3 rounded-full" />
          <Skeleton className="size-3 rounded-full" />
          <Skeleton className="size-3 rounded-full" />
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="size-6 rounded-md" />
          <Skeleton className="size-6 rounded-md" />
        </div>

        <Skeleton className="h-7 flex-1 rounded-lg" />
      </div>
    </div>

    <div className="rounded-b-2xl border-t-0 border-border bg-white px-10 py-8 dark:bg-card">
      <Skeleton className="mb-5 size-10 rounded-lg" />

      <div className="space-y-2">
        <Skeleton className="h-6 w-2/3 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-4/5 rounded-md" />
      </div>

      <div className="mt-7 space-y-4">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>

        <div className="space-y-1.5">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        <Skeleton className="mt-3 h-5 w-20 rounded-md" />
      </div>
    </div>
  </div>
);
