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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@echo/ui/components/select";
import { toast } from "@echo/ui/components/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { authClient } from "@/lib/auth-client";

import { inviteMemberSchema, type InviteMemberValues } from "../schemas";

const DEFAULT_VALUES: InviteMemberValues = { email: "", role: "member" };

export function InviteMemberButton(): React.ReactElement {
  const [open, setOpen] = useState(false);
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

  const onSubmit = handleSubmit(async (values) => {
    const { error } = await authClient.organization.inviteMember(values);

    if (error) {
      toast.error(error.message ?? "Could not send the invitation.");
      return;
    }

    toast.success(`Invitation sent to ${values.email}`);
    reset(DEFAULT_VALUES);
    setOpen(false);
  });

  const onOpenChange = (nextOpen: boolean): void => {
    setOpen(nextOpen);
    if (!nextOpen) reset(DEFAULT_VALUES);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={<Button size="lg" />}>
        <Icons.circlePlus data-icon="inline-start" className="size-4" />
        Invite member
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a teammate</DialogTitle>
          <DialogDescription>
            They will get an email with a link to join this workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <Field name="email" label="Email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="teammate@company.com"
              autoFocus
              {...register("email")}
            />
          </Field>

          <Field name="role" label="Role" error={errors.role?.message}>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <Icons.loading className="size-4 animate-spin" />
              ) : (
                "Send invitation"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
