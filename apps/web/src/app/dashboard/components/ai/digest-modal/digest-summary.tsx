import { Skeleton } from "@echo/ui/components/skeleton";
import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import type { DigestOutput } from "@echo/ai";

export function IssuesContent({ digest }: { digest: DigestOutput }): React.ReactElement {
  return (
    <div className="flex flex-col gap-3">
      {digest.topIssues.length > 0 ? (
        <Stagger className="flex flex-col gap-2" stagger={0.04}>
          {digest.topIssues.map((issue) => (
            <StaggerItem key={issue}>
              <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive" />
                <p className="text-sm text-muted-foreground">{issue}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <p className="text-sm text-muted-foreground">No issues detected.</p>
      )}
    </div>
  );
}

export function MoodContent({ digest }: { digest: DigestOutput }): React.ReactElement {
  return (
    <div className="flex flex-col gap-3">
      {digest.positiveHighlight ? (
        <div className="rounded-lg border border-border bg-background p-3">
          <p className="text-xs text-muted-foreground">What users love</p>
          <p className="mt-1 text-sm">{digest.positiveHighlight}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No sentiment data yet.</p>
      )}
    </div>
  );
}

export function DigestSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-lg" />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
          >
            <Skeleton className="mt-0.5 h-5 w-7 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-3.5 w-1/2" />
              <Skeleton className="mt-1.5 h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
