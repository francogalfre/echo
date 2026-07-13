import { Skeleton } from "@echo/ui/components/skeleton";

const COLUMNS = [
  { label: "Backlog", cards: 3 },
  { label: "In Progress", cards: 2 },
  { label: "Done", cards: 2 },
] as const;

export function BoardSkeleton(): React.ReactElement {
  return (
    <div className="flex h-full flex-col gap-6" aria-hidden="true">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-24" />
          <Skeleton className="mt-2 h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>

      <div className="grid flex-1 min-h-0 grid-cols-3 gap-4">
        {COLUMNS.map((column) => (
          <div
            key={column.label}
            className="flex h-full flex-col gap-2.5 rounded-xl border border-border bg-muted/30 p-3"
          >
            <div className="flex items-center gap-1.5 px-1">
              <Skeleton className="size-1.5 rounded-full" />
              <Skeleton className="h-3.5 w-20" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              {Array.from({ length: column.cards }, (_, index) => (
                <Skeleton key={index} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
