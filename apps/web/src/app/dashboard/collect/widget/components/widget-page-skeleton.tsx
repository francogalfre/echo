import { Skeleton } from "@echo/ui/components/skeleton";

export function WidgetPageSkeleton(): React.ReactElement {
  return (
    <div aria-hidden="true">
      <div className="mb-10 flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="mt-5 h-8 w-56" />
          <Skeleton className="mt-3 h-3.5 w-80" />
        </div>
        <Skeleton className="h-11 w-full rounded-lg lg:w-80" />
      </div>

      <div className="space-y-14">
        <section>
          <Skeleton className="h-5 w-20" />
          <Skeleton className="mt-1.5 h-3.5 w-full max-w-md" />
          <div className="mt-5 overflow-hidden rounded-lg bg-card ring-1 ring-foreground/10">
            <div className="flex items-center gap-1 border-b border-border px-4 py-2.5">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-12 rounded-md" />
            </div>
            <div className="p-6">
              <Skeleton className="h-56 w-full rounded-xl" />
            </div>
          </div>
        </section>

        <section>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-1.5 h-3.5 w-full max-w-sm" />
          <div className="mt-5 rounded-lg bg-card p-6 ring-1 ring-foreground/10">
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
          </div>
        </section>

        <section>
          <Skeleton className="h-5 w-14" />
          <Skeleton className="mt-1.5 h-3.5 w-full max-w-sm" />
          <div className="mt-5 space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-lg bg-card p-5 ring-1 ring-foreground/10">
                <div className="mb-1 flex items-center gap-2.5">
                  <Skeleton className="size-5 rounded-full" />
                  <Skeleton className="h-3.5 w-32" />
                </div>
                <Skeleton className="mb-4 ml-[30px] h-3 w-72" />
                <Skeleton className="ml-[30px] h-20 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
