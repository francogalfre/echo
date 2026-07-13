import { Skeleton } from "@echo/ui/components/skeleton";

import { SettingsCard } from "./settings-card";

function SettingsRowSkeleton(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-3 py-5 first:pt-0 last:pb-0 sm:grid-cols-[280px_minmax(0,1fr)] sm:gap-8">
      <div className="space-y-1.5">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-40" />
      </div>
      <Skeleton className="h-9 w-full max-w-sm rounded-lg" />
    </div>
  );
}

export function SettingsSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-6" aria-hidden="true">
      <SettingsCard>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-1.5 h-3 w-64" />
        <div className="mt-6 divide-y divide-border/60">
          <SettingsRowSkeleton />
          <SettingsRowSkeleton />
          <SettingsRowSkeleton />
        </div>
      </SettingsCard>
      <SettingsCard>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-1.5 h-3 w-64" />
        <div className="mt-6 divide-y divide-border/60">
          <SettingsRowSkeleton />
          <SettingsRowSkeleton />
        </div>
      </SettingsCard>
    </div>
  );
}
