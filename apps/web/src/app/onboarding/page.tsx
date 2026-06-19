"use client";

import { env } from "@echo/env/web";
import { Button } from "@echo/ui/components/button";
import { Input } from "@echo/ui/components/input";
import { Label } from "@echo/ui/components/label";
import { IconLoader2, IconPhotoPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { authClient, useSession } from "@/lib/auth-client";
import { slugify } from "@/lib/slug";

const LOGO_ACCEPT = "image/png,image/jpeg,image/webp,image/svg+xml";
const MAX_LOGO_BYTES = 1024 * 1024;

const OnboardingPage = () => {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const { data: organizations, isPending: organizationsPending } =
    authClient.useListOrganizations();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const onNameChange = (value: string) => {
    setName(value);
    if (!slugEdited) {
      setSlug(slugify(value));
    }
  };

  const onLogoChange = (file: File | undefined) => {
    if (!file) {
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      toast.error("Logo must be 1MB or smaller.");
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const uploadLogo = async (organizationId: string): Promise<void> => {
    if (!logoFile) {
      return;
    }
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

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !slug.trim()) {
      return;
    }

    setSubmitting(true);
    const { data, error } = await authClient.organization.create({
      name: name.trim(),
      slug,
    });

    if (error || !data) {
      toast.error(error?.message ?? "Could not create the project.");
      setSubmitting(false);
      return;
    }

    try {
      await uploadLogo(data.id);
    } catch {
      toast.warning("Project created, but the logo couldn't be uploaded.");
    }

    await authClient.organization.setActive({ organizationId: data.id });
    router.push("/dashboard");
  };

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
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Create your project</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            A project is where your feedback lives. You can add more later.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-xl border border-border bg-card p-6"
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-input bg-muted/30 text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Project logo"
                  className="size-full object-cover"
                />
              ) : (
                <IconPhotoPlus className="size-5" />
              )}
            </button>
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Logo</p>
              <p>PNG, JPG, WebP or SVG. Max 1MB. Optional.</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={LOGO_ACCEPT}
              className="hidden"
              onChange={(event) => onLogoChange(event.target.files?.[0])}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-medium text-foreground">
              Project name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="Acme Feedback"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug" className="text-xs font-medium text-foreground">
              Slug
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={(event) => {
                setSlugEdited(true);
                setSlug(slugify(event.target.value));
              }}
              placeholder="acme-feedback"
            />
            <p className="text-xs text-muted-foreground">
              Used in URLs and API requests. Lowercase letters, numbers and dashes.
            </p>
          </div>

          <Button
            type="submit"
            disabled={submitting || !name.trim() || !slug.trim()}
            className="h-10 w-full text-sm"
          >
            {submitting ? (
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

export default OnboardingPage;
