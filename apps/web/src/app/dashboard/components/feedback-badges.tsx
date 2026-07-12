import { Badge } from "@echo/ui/components/badge";
import { cn } from "@echo/ui/lib/utils";

const PILL_TONE = {
  green: "bg-pastel-green-bg text-pastel-green-text",
  slate: "bg-pastel-slate-bg text-pastel-slate-text",
  rose: "bg-pastel-rose-bg text-pastel-rose-text",
  blue: "bg-pastel-blue-bg text-pastel-blue-text",
  violet: "bg-pastel-violet-bg text-pastel-violet-text",
  amber: "bg-pastel-amber-bg text-pastel-amber-text",
} as const;

type PillTone = keyof typeof PILL_TONE;

const SENTIMENT_TONE: Record<string, PillTone> = {
  positive: "green",
  neutral: "slate",
  negative: "rose",
};

const SOURCE_TONE: Record<string, PillTone> = {
  api: "blue",
  form: "violet",
  widget: "amber",
};

type SentimentBadgeProps = {
  sentiment: string | null;
  className?: string;
};

export function SentimentBadge({
  sentiment,
  className,
}: SentimentBadgeProps): React.ReactElement {
  const value = sentiment ?? "neutral";
  const tone = SENTIMENT_TONE[value] ?? "slate";

  return <Badge className={cn(PILL_TONE[tone], "capitalize", className)}>{value}</Badge>;
}

type SourceBadgeProps = {
  source: string;
  className?: string;
};

export function SourceBadge({ source, className }: SourceBadgeProps): React.ReactElement {
  const tone = SOURCE_TONE[source] ?? "slate";

  return (
    <Badge dot className={cn(PILL_TONE[tone], "capitalize", className)}>
      {source}
    </Badge>
  );
}

type TagPillProps = {
  label: string;
  className?: string;
};

export function TagPill({ label, className }: TagPillProps): React.ReactElement {
  return (
    <Badge className={cn(PILL_TONE.slate, "max-w-[8rem] truncate", className)}>
      {label}
    </Badge>
  );
}
