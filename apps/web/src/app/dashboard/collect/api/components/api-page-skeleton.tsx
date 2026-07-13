import { Skeleton } from "@echo/ui/components/skeleton";

export function ApiPageSkeleton(): React.ReactElement {
  return (
    <div className="space-y-16" aria-hidden="true">
      <div className="rounded-2xl border border-border p-6 sm:p-8">
        <Skeleton className="mb-6 h-4 w-56" />
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="hidden size-4 lg:block" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2.5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-full max-w-lg" />
          <Skeleton className="h-3.5 w-2/3 max-w-md" />
        </div>

        <Skeleton className="h-32 w-full rounded-xl" />

        <div className="rounded-2xl border border-border bg-card p-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="mt-1.5 h-3 w-72" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
