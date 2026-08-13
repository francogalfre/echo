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

function isFlatSeries(data: readonly number[]): boolean {
  if (data.length < 3) return true;
  const first = data[0];
  return data.every((point) => point === first);
}

export function MetricCard({
  label,
  value,
  growth,
  sparklineData,
  sparklineColor = "accent",
}: MetricCardProps): React.ReactElement {
  const showSparkline = !isFlatSeries(sparklineData);

  return (
    <div className="group relative flex h-[184px] flex-col gap-2.5 overflow-hidden rounded-lg bg-card p-5 ring-1 ring-foreground/10">
      <div className="relative z-10 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <TrendIndicator growth={growth} />
      </div>
      <AnimatedCounter
        value={value}
        className="relative z-10 font-pixel text-3xl font-medium tracking-tight"
      />
      {showSparkline ? (
        <>
          <Sparkline
            data={[...sparklineData]}
            color={sparklineColor}
            variant="gradient"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-card to-transparent" />
        </>
      ) : (
        <div className="pointer-events-none absolute inset-x-6 bottom-10 h-px bg-foreground/10" />
      )}
      <div className="pointer-events-none absolute inset-0 z-20 bg-foreground/[0.05] opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100" />
    </div>
  );
}
