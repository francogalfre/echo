"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { toast } from "@echo/ui/components/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProjectFields } from "@/lib/project/project-fields";
import { useCreateProject } from "@/lib/project/use-create-project";

import { UpgradeDialog } from "./upgrade-dialog";

export const projectLimitReason =
  "You've reached your project limit. Pro includes up to 5 projects.";

type CreateProjectModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CreateProjectModal = ({
  open,
  onOpenChange,
}: CreateProjectModalProps): React.ReactElement => {
  const router = useRouter();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const project = useCreateProject({
    onCreated: () => {
      project.reset();
      onOpenChange(false);
      router.refresh();
      toast.success("Project created");
    },
    onLimitReached: () => {
      onOpenChange(false);
      setUpgradeOpen(true);
    },
  });
  const { isSubmitting } = project.form.formState;

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-[opacity] duration-200 data-closed:opacity-0 data-open:opacity-100" />
          <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/10 outline-none transition-[scale,opacity] duration-200 data-closed:scale-95 data-closed:opacity-0 data-open:scale-100 data-open:opacity-100">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <Dialog.Title className="text-lg font-semibold tracking-tight">
                  New project
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                  A project is where your feedback lives. You can rename it anytime.
                </Dialog.Description>
              </div>
              <Dialog.Close
                aria-label="Close"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icons.cancelCircle className="size-5" />
              </Dialog.Close>
            </div>

            <form onSubmit={project.submit} noValidate className="space-y-5">
              <ProjectFields project={project} />

              <Button type="submit" disabled={isSubmitting} className="h-10 w-full text-sm">
                {isSubmitting ? (
                  <Icons.loading className="size-4 animate-spin" />
                ) : (
                  "Create project"
                )}
              </Button>
            </form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>

      <UpgradeDialog
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        reason={projectLimitReason}
      />
    </>
  );
};
