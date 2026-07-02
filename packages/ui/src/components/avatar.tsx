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
  const tinted =
    hue === undefined
      ? undefined
      : ({
          "--avatar-bg": `oklch(0.6 0.14 ${hue} / 0.16)`,
          "--avatar-fg-light": `oklch(0.45 0.13 ${hue})`,
          "--avatar-fg-dark": `oklch(0.82 0.09 ${hue})`,
        } as React.CSSProperties);

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted",
        "text-[10px] font-semibold text-muted-foreground select-none",
        hue !== undefined &&
          "bg-(--avatar-bg) text-(--avatar-fg-light) dark:text-(--avatar-fg-dark)",
        className,
      )}
      style={{ ...tinted, ...style }}
      {...props}
    >
      {children ?? (name ? initials(name) : null)}
    </AvatarPrimitive.Fallback>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
