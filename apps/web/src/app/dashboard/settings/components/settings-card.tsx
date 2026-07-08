import { cn } from "@echo/ui/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type SettingsCardProps = ComponentPropsWithoutRef<"div">;

export const SettingsCard = ({
  className,
  ...props
}: SettingsCardProps): React.ReactElement => (
  <div
    className={cn("rounded-2xl border border-border bg-card p-6", className)}
    {...props}
  />
);
