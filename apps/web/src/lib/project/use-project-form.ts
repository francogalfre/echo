"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";

import { slugify } from "@/lib/slug";

import { createProjectSchema, type CreateProjectValues } from "./schema";
import { useLogoUpload, type UseLogoUploadReturn } from "./use-logo-upload";

export type UseProjectFormReturn = {
  form: UseFormReturn<CreateProjectValues>;
  logo: UseLogoUploadReturn;
  reset: () => void;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSlugChange: () => void;
};

export const useProjectForm = (): UseProjectFormReturn => {
  const logo = useLogoUpload();
  const slugEdited = useRef(false);
  const form = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: "", slug: "" },
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

  return { form, logo, reset, onNameChange, onSlugChange };
};
