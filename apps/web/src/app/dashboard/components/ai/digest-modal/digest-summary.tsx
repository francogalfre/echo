import { Skeleton } from "@echo/ui/components/skeleton";
import { Icons } from "@echo/ui/components/icons";
import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import type { DigestOutput } from "@echo/ai";

export function IssuesContent({ digest }: { digest: DigestOutput }): React.ReactElement {
  return (
    <div className="flex flex-col">
      {digest.topIssues.length > 0 ? (
        <Stagger className="flex flex-col gap-2" stagger={0.04}>
          {digest.topIssues.map((issue, index) => (
            <StaggerItem key={`${index}-${issue}`}>
              <div className="flex items-start gap-3 rounded-lg bg-card/60 px-3.5 py-3 ring-1 ring-foreground/10">
                <span className="mt-0.5 shrink-0 text-xs tabular-nums text-muted-foreground/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-foreground">{issue}</p>
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
        <div className="rounded-lg bg-accent/5 px-4 py-3.5 ring-1 ring-accent/15">
          <p className="text-xs text-muted-foreground">What users love</p>
          <p className="mt-1 text-sm text-foreground">{digest.positiveHighlight}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No sentiment data yet.</p>
      )}
    </div>
  );
}

export function SuggestionsContent({
  digest,
}: {
  digest: DigestOutput;
}): React.ReactElement | null {
  if (!digest.suggestions || digest.suggestions.length === 0) return null;

  return (
    <div className="flex flex-col">
      <Stagger className="flex flex-col gap-2" stagger={0.04}>
        {digest.suggestions.map((item, index) => (
          <StaggerItem key={`${index}-${item.title}`}>
            <div className="flex items-start gap-3 rounded-lg bg-card/60 px-3.5 py-3 ring-1 ring-foreground/10">
              <Icons.sparkles className="mt-0.5 size-3.5 shrink-0 text-accent" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-[13px] text-muted-foreground">{item.detail}</p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

export function DigestSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-lg px-3.5 py-3 ring-1 ring-foreground/10"
        >
          <Skeleton className="h-3 w-4 shrink-0" />
          <Skeleton className="h-3.5 w-full" />
        </div>
      ))}
    </div>
  );
}
