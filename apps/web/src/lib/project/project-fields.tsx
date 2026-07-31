"use client";

import { Field } from "@echo/ui/components/field";
import { Input } from "@echo/ui/components/input";

import { LogoPicker } from "./logo-picker";
import type { UseCreateProjectReturn } from "./use-create-project";

type ProjectFieldsProps = {
  project: UseCreateProjectReturn;
};

export const ProjectFields = ({ project }: ProjectFieldsProps): React.ReactElement => {
  const { form, logo, onNameChange, onSlugChange } = project;
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
      <LogoPicker
        inputRef={logo.fileInputRef}
        preview={logo.preview}
        error={logo.error}
        onChange={logo.onChange}
      />

      <Field name="name" label="Project name" error={errors.name?.message}>
        <Input
          id="name"
          placeholder="Acme Feedback"
          autoFocus
          {...register("name", { onChange: onNameChange })}
        />
      </Field>

      <Field
        name="slug"
        label="Slug"
        error={errors.slug?.message}
        hint="Used in URLs and API requests. Lowercase letters, numbers and dashes."
      >
        <Input
          id="slug"
          placeholder="acme-feedback"
          {...register("slug", { onChange: onSlugChange })}
        />
      </Field>

      {errors.root ? (
        <p className="text-xs text-destructive">{errors.root.message}</p>
      ) : null}
    </>
  );
};
