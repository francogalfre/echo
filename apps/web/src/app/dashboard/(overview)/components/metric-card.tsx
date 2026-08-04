import { AnimatedCounter } from "@echo/ui/components/animated-counter";
import type { DitherColor } from "@echo/ui/components/dither-kit/palette";
import { Sparkline } from "@echo/ui/components/dither-kit/sparkline";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";

type MetricCardProps = {
  label: string;
  value: number;
  growth: number | null;
  sparklineData: readonly number[];
  sparklineColor?: DitherColor;
};

function TrendIndicator({ growth }: { growth: number | null }): React.ReactElement {
  if (growth === null) {
    return <span className="text-xs text-muted-foreground">--</span>;
  }
  const positive = growth >= 0;
  return (
    <span
      className={cn(
        "flex items-center gap-0.5 text-xs font-medium tabular-nums",
        positive ? "text-success" : "text-destructive",
      )}
    >
      {positive ? (
        <Icons.trendUp className="size-3" />
      ) : (
        <Icons.trendDown className="size-3" />
      )}
      {Math.abs(growth)}%
    </span>
  );
}

export function MetricCard({
  label,
  value,
  growth,
  sparklineData,
  sparklineColor = "accent",
}: MetricCardProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-2.5 overflow-hidden rounded-lg bg-card p-5 ring-1 ring-foreground/10 transition-colors hover:bg-muted/30">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <TrendIndicator growth={growth} />
      </div>
      <AnimatedCounter
        value={value}
        className="font-pixel text-3xl font-medium tracking-tight"
      />
      <div className="mt-1 overflow-hidden rounded-lg">
        <Sparkline
          data={[...sparklineData]}
          color={sparklineColor}
          variant="gradient"
          className="h-32 w-full"
        />
      </div>
    </div>
  );
}
