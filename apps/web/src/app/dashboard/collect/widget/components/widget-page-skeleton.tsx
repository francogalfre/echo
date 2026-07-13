import { Skeleton } from "@echo/ui/components/skeleton";

export function WidgetPageSkeleton(): React.ReactElement {
  return (
    <div className="space-y-20" aria-hidden="true">
      <section>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="mt-2.5 h-3.5 w-full max-w-md" />
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-1 border-b border-border px-4 py-2.5">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-12 rounded-md" />
          </div>
          <div className="p-6">
            <Skeleton className="h-56 w-full rounded-xl" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-1.5 h-3 w-64" />
        <div className="mt-5 flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
      </section>

      <section>
        <Skeleton className="h-4 w-14" />
        <Skeleton className="mt-2.5 h-3.5 w-full max-w-sm" />
        <div className="mt-6 space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5">
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
  );
}
