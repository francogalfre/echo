"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { avatarHue, initials } from "@echo/ui/lib/avatar";
import { cn } from "@echo/ui/lib/utils";

function Avatar({ className, ...props }: AvatarPrimitive.Root.Props) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  name,
  style,
  children,
  ...props
}: AvatarPrimitive.Fallback.Props & { name?: string }) {
  const hue = name ? avatarHue(name) : undefined;

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted",
        "text-[10px] font-semibold text-muted-foreground select-none",
        className,
      )}
      style={
        hue === undefined
          ? style
          : {
              backgroundColor: `oklch(0.6 0.14 ${hue} / 0.16)`,
              color: `oklch(0.52 0.14 ${hue})`,
              ...style,
            }
      }
      {...props}
    >
      {children ?? (name ? initials(name) : null)}
    </AvatarPrimitive.Fallback>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
