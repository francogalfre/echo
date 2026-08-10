"use client";

import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@echo/ui/lib/utils";
import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import * as React from "react";

function Drawer({
  direction = "bottom",
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" direction={direction} {...props} />;
}

function DrawerTrigger({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerClose({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerPortal({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn("fixed inset-0 z-50 bg-black/50 backdrop-blur-sm", className)}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  showCloseButton = true,
  direction = "bottom",
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
  showCloseButton?: boolean;
  direction?: "bottom" | "left" | "right";
}) {
  const isSide = direction === "right" || direction === "left";

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "fixed z-50 flex flex-col bg-card text-card-foreground outline-none",
          isSide && "inset-y-0 h-full w-full max-w-[540px] border-border shadow-2xl",
          direction === "right" && "right-0 rounded-l-2xl border-l",
          direction === "left" && "left-0 rounded-r-2xl border-r",
          direction === "bottom" &&
            "inset-x-0 bottom-0 mx-auto max-h-[92vh] w-full max-w-2xl rounded-t-2xl border " +
              "border-b-0 border-border shadow-md ring-1 ring-foreground/10",
          className,
        )}
        {...props}
      >
        {!isSide && (
          <DrawerPrimitive.Handle className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-muted" />
        )}
        {children}
        {showCloseButton && (
          <DrawerPrimitive.Close asChild>
            <Button variant="ghost" className="absolute top-3 right-3" size="icon-sm">
              <Icons.x />
              <span className="sr-only">Close</span>
            </Button>
          </DrawerPrimitive.Close>
        )}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-xs/relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
