"use client";

import { Button } from "@echo/ui/components/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { authClient } from "@/lib/auth-client";

import { inviteStepSchema, type InviteStepValues } from "../../schemas";
import { OnboardingActions, OnboardingCard } from "../onboarding-card";

const defaultValues: InviteStepValues = { email: "", role: "member" };

type InviteStepProps = {
  onContinue: () => void;
};

export const InviteStep = ({ onContinue }: InviteStepProps): React.ReactElement => {
  const [invited, setInvited] = useState<readonly string[]>([]);
  const form = useForm<InviteStepValues>({
    resolver: zodResolver(inviteStepSchema),
    defaultValues,
  });
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    form.clearErrors("root");

    if (invited.includes(values.email)) {
      form.setError("email", { message: "That teammate is already invited" });
      return;
    }

    const { error } = await authClient.organization.inviteMember(values);

    if (error) {
      form.setError("root", { message: error.message ?? "Could not send the invitation." });
      return;
    }

    setInvited((current) => [...current, values.email]);
    reset(defaultValues);
  });

  return (
    <OnboardingCard
      title="Invite your team"
      description="Feedback is easier to act on together. Add teammates now, or do it later from settings."
    >
      <form id="invite-teammate" onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <Field name="email" label="Email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                autoComplete="off"
                placeholder="teammate@company.com"
                {...register("email")}
              />
            </Field>
          </div>

          <Field name="role" label="Role" error={errors.role?.message}>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="role" className="w-32">
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
        </div>

        {errors.root ? (
          <p className="text-xs text-destructive">{errors.root.message}</p>
        ) : null}

        {invited.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {invited.map((email) => (
              <li
                key={email}
                className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
              >
                <Icons.circleCheck className="size-3 text-accent" />
                {email}
              </li>
            ))}
          </ul>
        ) : null}
      </form>

      <OnboardingActions>
        <Button
          type="submit"
          form="invite-teammate"
          variant="outline"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Icons.loading className="size-4 animate-spin" />
          ) : (
            <Icons.mail data-icon="inline-start" className="size-4" />
          )}
          Send invitation
        </Button>

        <Button size="lg" onClick={onContinue}>
          {invited.length > 0 ? "Continue" : "Skip for now"}
          <Icons.arrowRight data-icon="inline-end" className="size-4" />
        </Button>
      </OnboardingActions>
    </OnboardingCard>
  );
};
