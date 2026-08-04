import { Skeleton } from "@echo/ui/components/skeleton";

export function DashboardSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-3">
        <Skeleton className="h-36 rounded-lg" />
        <Skeleton className="h-36 rounded-lg" />
        <Skeleton className="h-36 rounded-lg" />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Skeleton className="h-80 rounded-lg lg:col-span-2" />
        <Skeleton className="h-80 rounded-lg" />
      </div>
      <Skeleton className="h-64 rounded-lg" />
    </div>
  );
}
