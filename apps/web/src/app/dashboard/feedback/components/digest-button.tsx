"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { useState } from "react";

import { DigestModal } from "./digest-modal";

export function DigestButton(): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Icons.aiMagic data-icon="inline-start" className="size-3.5 text-accent" />
        AI Summary
      </Button>
      <DigestModal open={open} onOpenChange={setOpen} />
    </>
  );
}
