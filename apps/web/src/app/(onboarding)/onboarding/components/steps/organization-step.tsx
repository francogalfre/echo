"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";

import { ProjectFields } from "@/lib/project/project-fields";
import { useCreateProject } from "@/lib/project/use-create-project";

import { OnboardingActions, OnboardingCard } from "../onboarding-card";

type OrganizationStepProps = {
  onCreated: () => void;
};

export const OrganizationStep = ({
  onCreated,
}: OrganizationStepProps): React.ReactElement => {
  const project = useCreateProject({ onCreated });
  const { isSubmitting } = project.form.formState;

  return (
    <OnboardingCard
      title="Name your project"
      description="This is where your feedback lives. You can rename it anytime."
    >
      <form onSubmit={project.submit} noValidate className="mt-6 space-y-5">
        <ProjectFields project={project} />

        <OnboardingActions>
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <Icons.loading className="size-4 animate-spin" />
            ) : (
              <>
                Create project
                <Icons.arrowRight data-icon="inline-end" className="size-4" />
              </>
            )}
          </Button>
        </OnboardingActions>
      </form>
    </OnboardingCard>
  );
};
