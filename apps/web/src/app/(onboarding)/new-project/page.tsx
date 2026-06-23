"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { Input } from "@echo/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Field } from "@/components/field";
import { authClient, useSession } from "@/lib/auth-client";
import { slugify } from "@/lib/slug";

import { LogoPicker } from "./components/logo-picker";
import { useLogoUpload } from "./hooks/use-logo-upload";
import { createProjectSchema, type CreateProjectValues } from "./schemas";

const NewProjectPage = (): React.ReactElement => {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const { data: organizations, isPending: organizationsPending } =
    authClient.useListOrganizations();
  const logo = useLogoUpload();
  const slugEdited = useRef(false);

  const form = useForm<CreateProjectValues>({ resolver: zodResolver(createProjectSchema) });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (!sessionPending && !session) router.replace("/login");
  }, [sessionPending, session, router]);

  useEffect(() => {
    if (!organizationsPending && organizations && organizations.length > 0) {
      router.replace("/dashboard");
    }
  }, [organizationsPending, organizations, router]);

  const onSubmit = handleSubmit(async (values) => {
    form.clearErrors("root");
    const { data, error } = await authClient.organization.create({
      name: values.name.trim(),
      slug: values.slug,
    });

    if (error || !data) {
      form.setError("root", { message: error?.message ?? "Could not create the project." });
      return;
    }

    try {
      await logo.upload(data.id);
    } catch {
      toast.warning("Project created, but the logo couldn't be uploaded.");
    }

    await authClient.organization.setActive({ organizationId: data.id });
    router.push("/dashboard");
  });

  const isLoading =
    sessionPending || organizationsPending || (organizations?.length ?? 0) > 0;

  if (isLoading) {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <Icons.loading className="size-5 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Create your project
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This is where your feedback lives. You can rename it anytime.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
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
              {...register("name", {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (!slugEdited.current) setValue("slug", slugify(e.target.value));
                },
              })}
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
              {...register("slug", {
                onChange: () => {
                  slugEdited.current = true;
                },
              })}
            />
          </Field>

          {errors.root ? (
            <p className="text-xs text-destructive">{errors.root.message}</p>
          ) : null}

          <Button type="submit" disabled={isSubmitting} className="h-10 w-full text-sm">
            {isSubmitting ? (
              <Icons.loading className="size-4 animate-spin" />
            ) : (
              "Create project"
            )}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default NewProjectPage;
