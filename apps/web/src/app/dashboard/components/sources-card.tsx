import { Card, CardContent, CardHeader, CardTitle } from "@echo/ui/components/card";
import { formatCount } from "@echo/ui/lib/format";

import type { SourceCount } from "@echo/api/services/dashboard-overview";

const SOURCE_LABELS: Record<SourceCount["source"], string> = {
  api: "API",
  widget: "Widget",
  form: "Form",
};

export function SourcesCard({ sources }: { sources: SourceCount[] }): React.ReactElement {
  const total = sources.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sources</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center gap-5">
        {sources.map((item) => {
          const share = total === 0 ? 0 : Math.round((item.count / total) * 100);
          return (
            <div key={item.source} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{SOURCE_LABELS[item.source]}</span>
                <span className="tabular-nums text-muted-foreground">
                  {formatCount(item.count)} · {share}%
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-500"
                  style={{ width: `${share}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
