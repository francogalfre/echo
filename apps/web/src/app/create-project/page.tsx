"use client";

import { env } from "@echo/env/web";
import { Button } from "@echo/ui/components/button";
import { Input } from "@echo/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2, IconPhotoPlus } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Field } from "@/components/field";
import { authClient, useSession } from "@/lib/auth-client";
import { slugify } from "@/lib/slug";

import { createProjectSchema, type CreateProjectValues } from "./schemas";

const CreateProjectPage = (): React.ReactElement => {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const { data: organizations, isPending: organizationsPending } =
    authClient.useListOrganizations();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectValues>({ resolver: zodResolver(createProjectSchema) });

  useEffect(() => {
    if (!sessionPending && !session) {
      router.replace("/login");
    }
  }, [sessionPending, session, router]);

  useEffect(() => {
    if (!organizationsPending && organizations && organizations.length > 0) {
      router.replace("/dashboard");
    }
  }, [organizationsPending, organizations, router]);

  const onLogoChange = (file: File | undefined): void => {
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setLogoError("Logo must be 1MB or smaller.");
      return;
    }
    setLogoError(null);
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const uploadLogo = async (organizationId: string): Promise<void> => {
    if (!logoFile) return;
    const body = new FormData();
    body.append("organizationId", organizationId);
    body.append("file", logoFile);

    const response = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/projects/logo`, {
      method: "POST",
      credentials: "include",
      body,
    });
    if (!response.ok) {
      throw new Error("Logo upload failed");
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const { data, error } = await authClient.organization.create({
      name: values.name.trim(),
      slug: values.slug,
    });

    if (error || !data) {
      setServerError(error?.message ?? "Could not create the project.");
      return;
    }

    try {
      await uploadLogo(data.id);
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
        <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
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
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-input bg-muted/30 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent/40 hover:text-foreground"
            >
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Project logo"
                  width={64}
                  height={64}
                  className="size-full object-cover"
                />
              ) : (
                <IconPhotoPlus className="size-5" />
              )}
            </button>
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Logo</p>
              <p>PNG, JPG, WebP or SVG. Max 1MB. Optional.</p>
              {logoError ? <p className="text-destructive">{logoError}</p> : null}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={(event) => onLogoChange(event.target.files?.[0])}
            />
          </div>

          <Field name="name" label="Project name" error={errors.name?.message}>
            <Input
              id="name"
              placeholder="Acme Feedback"
              autoFocus
              {...register("name", {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  if (!slugEdited) {
                    setValue("slug", slugify(e.target.value));
                  }
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
                onChange: () => setSlugEdited(true),
              })}
            />
          </Field>

          {serverError ? <p className="text-xs text-destructive">{serverError}</p> : null}

          <Button type="submit" disabled={isSubmitting} className="h-10 w-full text-sm">
            {isSubmitting ? (
              <IconLoader2 className="size-4 animate-spin" />
            ) : (
              "Create project"
            )}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default CreateProjectPage;
