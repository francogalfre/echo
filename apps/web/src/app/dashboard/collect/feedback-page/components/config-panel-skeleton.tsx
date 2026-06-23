"use client";

import { Skeleton } from "@echo/ui/components/skeleton";

const CardSkeleton = ({ rows = 1 }: { rows?: number }): React.ReactElement => (
  <div className="rounded-2xl border border-border bg-card p-5">
    <Skeleton className="mb-4 h-4 w-24 rounded-md" />
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      ))}
    </div>
  </div>
);

export const ConfigPanelSkeleton = (): React.ReactElement => (
  <div className="space-y-3 p-5">
    <CardSkeleton rows={2} />

    <div className="rounded-2xl border border-border bg-card p-5">
      <Skeleton className="mb-4 h-4 w-28 rounded-md" />
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-full" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>
      <div className="mt-4 border-t border-border pt-1">
        <div className="flex items-center justify-between py-3">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-[22px] w-10 rounded-full" />
        </div>
      </div>
    </div>

    <div className="rounded-2xl border border-border bg-card p-5">
      <Skeleton className="mb-4 h-4 w-16 rounded-md" />
      <div className="divide-y divide-border">
        {["Name", "Feedback", "Email", "Star rating"].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-[22px] w-10 rounded-full" />
          </div>
        ))}
      </div>
    </div>

    <div className="rounded-2xl border border-border bg-card p-5">
      <Skeleton className="h-11 w-full rounded-xl" />
    </div>
  </div>
);
