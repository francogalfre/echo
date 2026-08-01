"use client";

import echoIdle from "@echo/assets/character/idle.webp";
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
import { Controller, useForm } from "react-hook-form";

import { inviteSchema, type InviteValues } from "../../schemas";
import { BackButton, ContinueButton } from "../onboarding-nav";
import { OnboardingShell } from "../onboarding-shell";

const defaultValues: InviteValues = { email: "", role: "member" };

type InviteStepProps = {
  invites: readonly InviteValues[];
  onAdd: (invite: InviteValues) => void;
  onRemove: (email: string) => void;
  stepIndex: number;
  stepCount: number;
  onBack: () => void;
  onContinue: () => void;
};

export const InviteStep = ({
  invites,
  onAdd,
  onRemove,
  stepIndex,
  stepCount,
  onBack,
  onContinue,
}: InviteStepProps): React.ReactElement => {
  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues,
  });
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const onSubmit = handleSubmit((values) => {
    if (invites.some((invite) => invite.email === values.email)) {
      form.setError("email", { message: "That teammate is already on the list" });
      return;
    }

    onAdd(values);
    setValue("email", "");
    form.clearErrors();
  });

  return (
    <OnboardingShell
      character={echoIdle}
      caption="Invitations go out once your project is created, so nobody gets an email you didn't mean to send."
      stepIndex={stepIndex}
      stepCount={stepCount}
      title="Invite your team"
      description="Add the people who should see incoming feedback. We'll email them as soon as your project is ready."
      footer={
        <>
          <BackButton onClick={onBack} />
          <ContinueButton onClick={onContinue}>
            {invites.length > 0 ? "Continue" : "Skip for now"}
          </ContinueButton>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <Field name="email" label="Email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                autoComplete="off"
                placeholder="teammate@company.com"
                className="h-11 rounded-xl"
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
                  <SelectTrigger
                    id="role"
                    className="w-32 rounded-xl data-[size=default]:h-11"
                  >
                    <SelectValue className="capitalize" />
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

        <Button type="submit" variant="outline" className="h-10 w-full rounded-xl text-sm">
          <Icons.userAdd data-icon="inline-start" className="size-4" />
          Add to the list
        </Button>
      </form>

      {invites.length > 0 ? (
        <ul className="mt-6 space-y-2">
          {invites.map((invite) => (
            <li
              key={invite.email}
              className="flex items-center gap-3 rounded-xl bg-muted/50 py-2 pr-2 pl-3"
            >
              <Icons.mail className="size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                {invite.email}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {invite.role}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${invite.email}`}
                onClick={() => onRemove(invite.email)}
                className="rounded-lg"
              >
                <Icons.x className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </OnboardingShell>
  );
};
