import { badgeVariants, type BadgeVariantProps } from "@echo/ui/components/badge-variants";
import { cn } from "@echo/ui/lib/utils";
import * as React from "react";

function Badge({
  className,
  variant,
  dot = false,
  children,
  ...props
}: React.ComponentProps<"span"> & BadgeVariantProps & { dot?: boolean }) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {dot ? <span aria-hidden className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

export { Badge };
