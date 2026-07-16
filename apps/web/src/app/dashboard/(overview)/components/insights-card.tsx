import { EmptyState } from "@echo/ui/components/empty-state";
import { Icons } from "@echo/ui/components/icons";
import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import { formatRelativeTime } from "@echo/ui/lib/format";

import type { DigestOutput } from "@echo/ai";

type InsightsCardProps = {
  readonly digest: DigestOutput | null;
  readonly generatedAt: Date | null;
  readonly feedbackCount: number;
};

function InsightsEmptyState(): React.ReactElement {
  return (
    <div className="rounded-lg bg-card p-5 ring-1 ring-foreground/10">
      <EmptyState
        icon={<Icons.aiMagic />}
        title="No insights yet"
        description="Generate an AI summary above to see what users want changed."
      />
    </div>
  );
}

export function InsightsCard({
  digest,
  generatedAt,
  feedbackCount,
}: InsightsCardProps): React.ReactElement {
  const hasTopIssues = digest !== null && digest.topIssues.length > 0;
  const hasThemes = digest !== null && digest.themes.length > 0;

  if (!digest || (!hasTopIssues && !hasThemes)) {
    return <InsightsEmptyState />;
  }

  return (
    <div className="rounded-lg bg-card p-5 ring-1 ring-foreground/10">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-medium">Insights</h2>
        {generatedAt && (
          <p className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {feedbackCount} feedbacks · {formatRelativeTime(generatedAt.toISOString())}
          </p>
        )}
      </div>
      <div className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {hasTopIssues && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              What users want changed
            </p>
            <Stagger className="flex flex-col gap-1.5" stagger={0.05}>
              {digest.topIssues.map((issue) => (
                <StaggerItem
                  key={issue}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive" />
                  {issue}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        )}

        {hasThemes && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Main themes
            </p>
            <Stagger className="flex flex-col gap-2" stagger={0.05}>
              {digest.themes.map((theme) => (
                <StaggerItem
                  key={theme.title}
                  className="flex items-start gap-3 rounded-lg bg-muted/30 p-2.5"
                >
                  <span className="mt-0.5 min-w-[1.75rem] rounded-full bg-muted px-1.5 py-0.5 text-center text-xs font-semibold tabular-nums text-muted-foreground">
                    {theme.count}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{theme.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{theme.insight}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        )}
      </div>
    </div>
  );
}
