const STARS = [1, 2, 3, 4, 5] as const;

type Props = { rating: number; accentColor?: string };

export function StarDisplay({
  rating,
  accentColor = "#7C3AED",
}: Props): React.ReactElement {
  return (
    <span className="flex items-center gap-0.5">
      {STARS.map((star) => (
        <svg
          key={star}
          viewBox="0 0 16 16"
          className="size-3.5"
          fill={star <= rating ? accentColor : "currentColor"}
          style={
            star > rating ? { color: "var(--muted-foreground)", opacity: 0.25 } : undefined
          }
        >
          <path d="M8 1l1.9 3.8 4.2.6-3 2.9.7 4.1L8 10.4l-3.8 2 .7-4.1-3-2.9 4.2-.6L8 1z" />
        </svg>
      ))}
    </span>
  );
}
