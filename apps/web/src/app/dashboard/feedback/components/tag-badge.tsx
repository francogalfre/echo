type Props = {
  tag: string;
};

const TAG_COLORS: Record<string, string> = {
  bug: "bg-red-500/10 text-red-600",
  feature: "bg-blue-500/10 text-blue-600",
  ux: "bg-violet-500/10 text-violet-600",
  performance: "bg-orange-500/10 text-orange-600",
  billing: "bg-yellow-500/10 text-yellow-700",
  compliment: "bg-emerald-500/10 text-emerald-600",
  support: "bg-sky-500/10 text-sky-600",
};

export function TagBadge({ tag }: Props): React.ReactElement {
  const color = TAG_COLORS[tag] ?? "bg-muted text-muted-foreground";

  return (
    <span
      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${color}`}
    >
      {tag}
    </span>
  );
}
