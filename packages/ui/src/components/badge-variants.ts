import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5",
    "text-[11px] font-medium whitespace-nowrap transition-colors",
    "[&_svg]:pointer-events-none [&_svg]:size-3",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "border-transparent bg-secondary text-secondary-foreground",
        accent: "border-accent/20 bg-accent/10 text-accent-strong dark:text-accent",
        success: "border-success/20 bg-success/10 text-success-strong dark:text-success",
        warning:
          "border-warning/25 bg-warning/15 text-warning-foreground dark:text-warning",
        destructive: "border-destructive/20 bg-destructive/10 text-destructive",
        info: "border-info/20 bg-info/10 text-info",
        outline: "border-border bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
