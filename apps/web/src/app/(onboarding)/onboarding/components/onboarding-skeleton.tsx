import { Skeleton } from "@echo/ui/components/skeleton";

export const OnboardingSkeleton = (): React.ReactElement => (
  <div className="w-full rounded-[2rem] border border-border bg-card p-2">
    <div className="flex flex-col md:min-h-[34rem] md:flex-row">
      <aside className="hidden flex-[0.85] flex-col justify-between rounded-[1.5rem] bg-muted/50 p-8 md:flex">
        <Skeleton className="h-6 w-20 rounded-full" />

        <div className="flex flex-col items-center gap-7 py-8">
          <Skeleton className="size-44 rounded-[1.5rem]" />
          <div className="flex w-full flex-col items-center gap-2">
            <Skeleton className="h-3 w-52 rounded-full" />
            <Skeleton className="h-3 w-40 rounded-full" />
          </div>
        </div>

        <div className="flex gap-1.5">
          {Array.from({ length: 4 }, (_, position) => (
            <Skeleton key={position} className="h-1 flex-1 rounded-full" />
          ))}
        </div>
      </aside>

      <div className="flex flex-1 flex-col p-6 sm:p-10">
        <Skeleton className="h-7 w-56 rounded-full" />
        <Skeleton className="mt-3 h-4 w-72 rounded-full" />

        <div className="mt-10 flex-1 space-y-4">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-2/3 rounded-2xl" />
        </div>

        <div className="mt-10 flex items-center gap-3">
          <Skeleton className="size-11 rounded-xl" />
          <Skeleton className="h-11 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);
