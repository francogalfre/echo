"use client";

import { Button } from "@echo/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@echo/ui/components/drawer";
import { Icons } from "@echo/ui/components/icons";
import { useState, type ReactNode } from "react";

import { SidebarContent } from "./sidebar-content";

type MobileSidebarProps = {
  usageMeterSlot: ReactNode;
};

export const MobileSidebar = ({
  usageMeterSlot,
}: MobileSidebarProps): React.ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="left">
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Icons.menu className="size-4.5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent
        direction="left"
        showCloseButton={false}
        className="w-72 max-w-[85vw] gap-0 bg-sidebar"
      >
        <DrawerTitle className="sr-only">Navigation</DrawerTitle>
        <SidebarContent usageMeterSlot={usageMeterSlot} onNavigate={() => setOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
};
