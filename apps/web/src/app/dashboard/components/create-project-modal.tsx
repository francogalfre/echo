"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@echo/ui/components/button";
import { Field } from "@echo/ui/components/field";
import { Icons } from "@echo/ui/components/icons";
import { Input } from "@echo/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { slugify } from "@/lib/slug";
import { LogoPicker } from "@/app/(onboarding)/new-project/components/logo-picker";
import { useLogoUpload } from "@/app/(onboarding)/new-project/hooks/use-logo-upload";
import {
  createProjectSchema,
  type CreateProjectValues,
} from "@/app/(onboarding)/new-project/schemas";

type CreateProjectModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const CreateProjectModal = ({
  open,
  onOpenChange,
}: CreateProjectModalProps): React.ReactElement => {
  const router = useRouter();
  const logo = useLogoUpload();
  const slugEdited = useRef(false);

  const form = useForm<CreateProjectValues>({ resolver: zodResolver(createProjectSchema) });
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = form;

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
    reset();
    slugEdited.current = false;
    onOpenChange(false);
    router.refresh();
    toast.success("Project created");
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-all duration-200 data-closed:opacity-0 data-open:opacity-100" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-xl shadow-black/10 outline-none transition-all duration-200 data-closed:scale-95 data-closed:opacity-0 data-open:scale-100 data-open:opacity-100">
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
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
