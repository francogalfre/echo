"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { useState } from "react";

import { CreateProjectModal } from "../../../components/create-project-modal";

export function NewProjectButton(): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="lg" onClick={() => setOpen(true)}>
        <Icons.circlePlus data-icon="inline-start" className="size-4" />
        New project
      </Button>
      <CreateProjectModal open={open} onOpenChange={setOpen} />
    </>
  );
}
