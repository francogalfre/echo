"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { useState } from "react";

import { useAtProjectLimit } from "../../../hooks/use-project-limit";
import {
  CreateProjectModal,
  projectLimitReason,
} from "../../../components/dialogs/create-project-modal";
import { UpgradeDialog } from "../../../components/dialogs/upgrade-dialog";

export function NewProjectButton(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const atProjectLimit = useAtProjectLimit();

  return (
    <>
      <Button
        size="lg"
        onClick={() => (atProjectLimit ? setUpgradeOpen(true) : setOpen(true))}
      >
        <Icons.circlePlus data-icon="inline-start" className="size-4" />
        New project
      </Button>
      <CreateProjectModal open={open} onOpenChange={setOpen} />
      <UpgradeDialog
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        reason={projectLimitReason}
      />
    </>
  );
}
