"use client";

import { toast } from "@echo/ui/components/toast";

import { createProject } from "./create-project";
import { useProjectForm, type UseProjectFormReturn } from "./use-project-form";

type UseCreateProjectOptions = {
  onCreated: (organizationId: string) => void | Promise<void>;
  onLimitReached?: () => void;
};

export type UseCreateProjectReturn = UseProjectFormReturn & {
  submit: (event?: React.BaseSyntheticEvent) => Promise<void>;
};

export const useCreateProject = ({
  onCreated,
  onLimitReached,
}: UseCreateProjectOptions): UseCreateProjectReturn => {
  const project = useProjectForm();

  const submit = project.form.handleSubmit(async (values) => {
    project.form.clearErrors("root");

    const result = await createProject(values, project.logo.upload);

    if (!result.success) {
      if (result.limitReached && onLimitReached) {
        onLimitReached();
        return;
      }

      project.form.setError("root", { message: result.message });
      return;
    }

    if (!result.logoUploaded) {
      toast.warning("Project created, but the logo couldn't be uploaded.");
    }

    await onCreated(result.organizationId);
  });

  return { ...project, submit };
};
