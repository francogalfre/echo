"use client";

import { toast } from "@echo/ui/components/toast";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { authClient, useSession } from "@/lib/auth-client";
import { createProject } from "@/lib/project/create-project";
import { useProjectForm } from "@/lib/project/use-project-form";

import { useOnboardingSteps, type OnboardingStep } from "../hooks/use-onboarding-steps";
import type { InviteValues, TeamSize } from "../schemas";
import { OnboardingSkeleton } from "./onboarding-skeleton";
import { AppearanceStep } from "./steps/appearance-step";
import { InviteStep } from "./steps/invite-step";
import { ProjectStep } from "./steps/project-step";
import { TeamStep } from "./steps/team-step";
import { WelcomeStep } from "./steps/welcome-step";

const sendInvites = async (invites: readonly InviteValues[]): Promise<number> => {
  const results = await Promise.all(
    invites.map(async (invite) => {
      const { error } = await authClient.organization.inviteMember(invite);
      return error !== null && error !== undefined;
    }),
  );

  return results.filter(Boolean).length;
};

export const OnboardingFlow = (): React.ReactElement => {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const { data: organizations, isPending: organizationsPending } =
    authClient.useListOrganizations();

  const project = useProjectForm();
  const [teamSize, setTeamSize] = useState<TeamSize | null>(null);
  const [invites, setInvites] = useState<readonly InviteValues[]>([]);
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);

  const steps = useMemo<readonly OnboardingStep[]>(
    () =>
      teamSize === "solo"
        ? ["welcome", "project", "team", "appearance"]
        : ["welcome", "project", "team", "invite", "appearance"],
    [teamSize],
  );
  const { step, index, count, next, back } = useOnboardingSteps(steps);

  const entryChecked = useRef(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (sessionPending || organizationsPending || entryChecked.current) return;
    entryChecked.current = true;

    if (!session) {
      setLeaving(true);
      router.replace("/login");
      return;
    }

    if ((organizations?.length ?? 0) > 0) {
      setLeaving(true);
      router.replace("/dashboard");
    }
  }, [sessionPending, organizationsPending, session, organizations, router]);

  const addInvite = useCallback((invite: InviteValues): void => {
    setInvites((current) => [...current, invite]);
  }, []);

  const removeInvite = useCallback((email: string): void => {
    setInvites((current) => current.filter((invite) => invite.email !== email));
  }, []);

  const finish = async (): Promise<void> => {
    setFinishing(true);
    setFinishError(null);

    const result = await createProject(project.form.getValues(), project.logo.upload);

    if (!result.success) {
      setFinishing(false);
      setFinishError(
        result.limitReached
          ? "You've reached your project limit. Remove a project or upgrade to Pro."
          : result.message,
      );
      return;
    }

    if (!result.logoUploaded) {
      toast.warning("Project created, but the logo couldn't be uploaded.");
    }

    if (invites.length > 0) {
      const failed = await sendInvites(invites);
      if (failed > 0) {
        toast.warning(`${failed} of ${invites.length} invitations couldn't be sent.`);
      }
    }

    setLeaving(true);
    router.replace("/dashboard");
  };

  if (sessionPending || organizationsPending || leaving) return <OnboardingSkeleton />;

  return (
    <div
      key={step}
      className="animate-in fade-in slide-in-from-bottom-3 duration-300 ease-out"
    >
      {step === "welcome" ? (
        <WelcomeStep stepIndex={index} stepCount={count} onContinue={next} />
      ) : null}

      {step === "project" ? (
        <ProjectStep
          project={project}
          stepIndex={index}
          stepCount={count}
          onBack={back}
          onContinue={next}
        />
      ) : null}

      {step === "team" ? (
        <TeamStep
          teamSize={teamSize}
          onTeamSizeChange={setTeamSize}
          stepIndex={index}
          stepCount={count}
          onBack={back}
          onContinue={next}
        />
      ) : null}

      {step === "invite" ? (
        <InviteStep
          invites={invites}
          onAdd={addInvite}
          onRemove={removeInvite}
          stepIndex={index}
          stepCount={count}
          onBack={back}
          onContinue={next}
        />
      ) : null}

      {step === "appearance" ? (
        <AppearanceStep
          stepIndex={index}
          stepCount={count}
          error={finishError}
          finishing={finishing}
          onBack={back}
          onFinish={finish}
        />
      ) : null}
    </div>
  );
};
