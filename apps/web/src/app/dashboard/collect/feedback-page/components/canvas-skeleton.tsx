import { Skeleton } from "@echo/ui/components/skeleton";

export const CanvasSkeleton = (): React.ReactElement => (
  <div className="min-h-full w-full bg-background">
    <Skeleton className="h-48 w-full rounded-none sm:h-64" />
    <div className="mx-auto max-w-2xl px-6 pb-16">
      <Skeleton className="-mt-10 size-16 rounded-2xl sm:-mt-10 sm:size-20" />
      <Skeleton className="mt-5 h-8 w-2/3 rounded-lg" />
      <Skeleton className="mt-3 h-4 w-full rounded-md" />
      <Skeleton className="mt-2 h-4 w-4/5 rounded-md" />

      <div className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-16 rounded-md" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-24 rounded-md" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </div>
  </div>
);
