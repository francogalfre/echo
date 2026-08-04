"use client";

import echoIdle from "@echo/assets/character/idle.webp";

import { ProjectFields } from "@/lib/project/project-fields";
import type { UseProjectFormReturn } from "@/lib/project/use-project-form";

import { BackButton, ContinueButton } from "../onboarding-nav";
import { OnboardingShell } from "../onboarding-shell";

type ProjectStepProps = {
  project: UseProjectFormReturn;
  stepIndex: number;
  stepCount: number;
  onBack: () => void;
  onContinue: () => void;
};

export const ProjectStep = ({
  project,
  stepIndex,
  stepCount,
  onBack,
  onContinue,
}: ProjectStepProps): React.ReactElement => {
  const onSubmit = project.form.handleSubmit(() => onContinue());

  return (
    <OnboardingShell
      character={echoIdle}
      caption="Give it a name your team will recognize. You can rename it anytime."
      stepIndex={stepIndex}
      stepCount={stepCount}
      title="Name your project"
      description="This is where your feedback lives. You can change any of it later in settings."
      footer={
        <>
          <BackButton onClick={onBack} />
          <ContinueButton type="submit" form="project-step">
            Continue
          </ContinueButton>
        </>
      }
    >
      <form id="project-step" onSubmit={onSubmit} noValidate className="space-y-7">
        <ProjectFields project={project} inputClassName="h-11 rounded-xl" />
      </form>
    </OnboardingShell>
  );
};
