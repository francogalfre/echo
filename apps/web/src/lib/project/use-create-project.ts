"use client";

import { toast } from "@echo/ui/components/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

import { authClient } from "@/lib/auth-client";
import { slugify } from "@/lib/slug";

import { createProjectSchema, type CreateProjectValues } from "./schema";
import { useLogoUpload, type UseLogoUploadReturn } from "./use-logo-upload";

const organizationLimitCode = "YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS";

type UseCreateProjectOptions = {
  onCreated: (organizationId: string) => void | Promise<void>;
  onLimitReached?: () => void;
};

export type UseCreateProjectReturn = {
  form: UseFormReturn<CreateProjectValues>;
  logo: UseLogoUploadReturn;
  submit: (event?: React.BaseSyntheticEvent) => Promise<void>;
  reset: () => void;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSlugChange: () => void;
};

export const useCreateProject = ({
  onCreated,
  onLimitReached,
}: UseCreateProjectOptions): UseCreateProjectReturn => {
  const logo = useLogoUpload();
  const slugEdited = useRef(false);
  const form = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: "", slug: "" },
  });

  const submit = form.handleSubmit(async (values) => {
    form.clearErrors("root");

    const { data, error } = await authClient.organization.create({
      name: values.name.trim(),
      slug: values.slug,
    });

    if (error || !data) {
      if (error?.code === organizationLimitCode && onLimitReached) {
        onLimitReached();
        return;
      }

      form.setError("root", {
        message: error?.message ?? "Could not create the project.",
      });
      return;
    }

    try {
      await logo.upload(data.id);
    } catch {
      toast.warning("Project created, but the logo couldn't be uploaded.");
    }

    await authClient.organization.setActive({ organizationId: data.id });
    slugEdited.current = false;
    await onCreated(data.id);
  });

  const reset = (): void => {
    form.reset();
    slugEdited.current = false;
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!slugEdited.current) form.setValue("slug", slugify(event.target.value));
  };

  const onSlugChange = (): void => {
    slugEdited.current = true;
  };

  return { form, logo, submit, reset, onNameChange, onSlugChange };
};
