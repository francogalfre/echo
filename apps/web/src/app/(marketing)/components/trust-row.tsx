import { Icons } from "@echo/ui/components/icons";

const TRUST_ITEMS = ["Free forever", "No credit card", "AI sentiment included"] as const;

export const TrustRow = (): React.ReactElement => {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
      {TRUST_ITEMS.map((item) => (
        <span key={item} className="flex items-center gap-1.5">
          <Icons.check className="size-3.5 text-accent" />
          {item}
        </span>
      ))}
    </div>
  );
};
