import { cn } from "@echo/ui/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type SettingsCardProps = ComponentPropsWithoutRef<"div">;

export const SettingsCard = ({
  className,
  ...props
}: SettingsCardProps): React.ReactElement => (
  <div
    className={cn(
      "rounded-2xl bg-card p-6 shadow-xs ring-1 ring-foreground/10 sm:p-8",
      className,
    )}
    {...props}
  />
);
