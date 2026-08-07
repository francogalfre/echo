import { Skeleton } from "@echo/ui/components/skeleton";

export function ApiPageSkeleton(): React.ReactElement {
  return (
    <div aria-hidden="true">
      <div className="mb-10 flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="mt-5 h-8 w-56" />
          <Skeleton className="mt-3 h-3.5 w-80" />
        </div>
        <Skeleton className="h-11 w-full rounded-lg lg:w-80" />
      </div>

      <div className="mb-14 rounded-lg p-6 ring-1 ring-foreground/10 sm:p-8">
        <Skeleton className="mb-6 h-4 w-56" />
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="hidden size-4 lg:block" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-16">
        <div className="hidden lg:block">
          <Skeleton className="mb-3 h-3 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-full rounded-lg" />
            <Skeleton className="h-7 w-full rounded-lg" />
            <Skeleton className="h-7 w-full rounded-lg" />
            <Skeleton className="h-7 w-full rounded-lg" />
          </div>
        </div>

        <div className="space-y-14">
          <div className="space-y-6">
            <div className="space-y-2.5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3.5 w-full max-w-lg" />
            </div>
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="rounded-lg bg-card p-6 ring-1 ring-foreground/10">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="mt-1.5 h-3 w-72" />
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3.5 w-full max-w-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
