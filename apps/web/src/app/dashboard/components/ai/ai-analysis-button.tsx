"use client";

import * as React from "react";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";

import { DigestModal } from "./digest-modal";
import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
} from "./expandable-screen";

export function AiAnalysisButton(): React.ReactElement {
  const [open, setOpen] = React.useState(false);

  return (
    <ExpandableScreen open={open} onOpenChange={setOpen}>
      <ExpandableScreenTrigger>
        <Button
          variant="default"
          size="lg"
          className="group h-10 gap-2 px-4 text-sm transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
        >
          <Icons.aiMagic className="size-4 transition-transform duration-200 group-hover:rotate-12" />
          AI Analysis
        </Button>
      </ExpandableScreenTrigger>
      <ExpandableScreenContent className="h-[88vh] max-h-[88vh] w-[92vw] max-w-4xl">
        <DigestModal onOpenChange={setOpen} />
      </ExpandableScreenContent>
    </ExpandableScreen>
  );
}
