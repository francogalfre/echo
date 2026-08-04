"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { useState } from "react";

import { DigestModal } from "../../components/ai/digest-modal";

export function DigestButton(): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="lg"
        className="group gap-2 text-sm font-medium shadow-sm transition-shadow hover:shadow-md"
      >
        <Icons.aiMagic className="size-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
        AI Summary
      </Button>
      <DigestModal open={open} onOpenChange={setOpen} />
    </>
  );
}
