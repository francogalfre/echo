"use client";

import { Button } from "@echo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@echo/ui/components/dialog";
import { Field } from "@echo/ui/components/field";
import { Icons } from "@echo/ui/components/icons";
import { Input } from "@echo/ui/components/input";
import { toast } from "@echo/ui/components/toast";
import { cn } from "@echo/ui/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { authClient } from "@/lib/auth-client";

import { inviteMemberSchema, type InviteMemberValues } from "../schemas";
import { RoleIcon } from "./role-icon";

const DEFAULT_VALUES: InviteMemberValues = { email: "", role: "member" };

const ROLE_OPTIONS: readonly {
  value: InviteMemberValues["role"];
  label: string;
  description: string;
}[] = [
  {
    value: "member",
    label: "Member",
    description: "Can view and respond to feedback.",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Can also manage members, keys, and billing.",
  },
];

export function InviteMemberButton(): React.ReactElement | null {
  const [open, setOpen] = useState(false);
  const { data: activeOrg, refetch } = authClient.useActiveOrganization();
  const { data: session } = authClient.useSession();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const viewerRole = activeOrg?.members.find(
    (member) => member.userId === session?.user.id,
  )?.role;
  const canInvite = viewerRole === "owner" || viewerRole === "admin";

  const onSubmit = handleSubmit(async (values) => {
    const { error } = await authClient.organization.inviteMember(values);

    if (error) {
      toast.error(error.message ?? "Could not send the invitation.");
      return;
    }

    toast.success(`Invitation sent to ${values.email}`);
    reset(DEFAULT_VALUES);
    setOpen(false);
    void refetch();
  });

  const onOpenChange = (nextOpen: boolean): void => {
    setOpen(nextOpen);
    if (!nextOpen) reset(DEFAULT_VALUES);
  };

  if (!canInvite) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button size="lg" />}>
        <Icons.circlePlus data-icon="inline-start" className="size-4" />
        Invite member
      </DialogTrigger>

      <DialogContent className="max-w-md gap-7 p-8">
        <DialogHeader className="gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Icons.userAdd className="size-5" />
          </span>
          <DialogTitle className="text-lg">Invite a teammate</DialogTitle>
          <DialogDescription className="text-sm/relaxed">
            {activeOrg
              ? `They'll get an email with a link to join ${activeOrg.name}.`
              : "They will get an email with a link to join this workspace."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          <Field name="email" label="Email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="teammate@company.com"
              autoFocus
              className="h-10"
              {...register("email")}
            />
          </Field>

          <Field name="role" label="Role" error={errors.role?.message}>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <div role="radiogroup" aria-label="Role" className="grid grid-cols-2 gap-2">
                  {ROLE_OPTIONS.map((option) => {
                    const selected = field.value === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => field.onChange(option.value)}
                        className={cn(
                          "flex flex-col items-start gap-2 rounded-lg border p-3.5 text-left transition-colors",
                          selected
                            ? "border-accent/60 bg-accent/5 ring-1 ring-accent/60"
                            : "border-border hover:border-foreground/20",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-7 items-center justify-center rounded-md",
                            selected
                              ? "bg-accent/15 text-accent"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          <RoleIcon role={option.value} className="size-3.5" />
                        </span>
                        <span className="text-sm font-medium text-foreground">
                          {option.label}
                        </span>
                        <span className="text-xs leading-snug text-muted-foreground">
                          {option.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </Field>

          <DialogFooter className="gap-3">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <Icons.loading className="size-4 animate-spin" />
              ) : (
                <>
                  <Icons.mail data-icon="inline-start" className="size-4" />
                  Send invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
