import { AnimatedCounter } from "@echo/ui/components/animated-counter";
import { Badge } from "@echo/ui/components/badge";
import type { DitherColor } from "@echo/ui/components/dither-kit/palette";
import { Sparkline } from "@echo/ui/components/dither-kit/sparkline";
import { Icons } from "@echo/ui/components/icons";

type MetricCardProps = {
  label: string;
  value: number;
  growth: number | null;
  caption: string;
  sparklineData: readonly number[];
  sparklineColor?: DitherColor;
};

function TrendBadge({ growth }: { growth: number | null }): React.ReactElement {
  if (growth === null) {
    return <span className="text-xs text-muted-foreground">--</span>;
  }
  const positive = growth >= 0;
  return (
    <Badge variant={positive ? "success" : "destructive"}>
      {positive ? (
        <Icons.trendUp className="size-3" />
      ) : (
        <Icons.trendDown className="size-3" />
      )}
      {Math.abs(growth)}%
    </Badge>
  );
}

export function MetricCard({
  label,
  value,
  growth,
  caption,
  sparklineData,
  sparklineColor = "purple",
}: MetricCardProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-3 overflow-hidden rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/30">
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex items-baseline gap-2">
          <AnimatedCounter
            value={value}
            className="font-pixel text-3xl font-medium tracking-tight"
          />
          <TrendBadge growth={growth} />
        </div>
        <p className="text-xs text-muted-foreground">{caption}</p>
      </div>
      <Sparkline
        data={[...sparklineData]}
        color={sparklineColor}
        variant="gradient"
        className="h-20 w-full"
      />
    </div>
  );
}
