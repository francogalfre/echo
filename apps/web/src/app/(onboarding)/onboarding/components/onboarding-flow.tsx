"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { authClient, useSession } from "@/lib/auth-client";

import { useOnboardingSteps } from "../hooks/use-onboarding-steps";
import { OnboardingProgress } from "./onboarding-progress";
import { AppearanceStep } from "./steps/appearance-step";
import { InviteStep } from "./steps/invite-step";
import { OrganizationStep } from "./steps/organization-step";
import { WelcomeStep } from "./steps/welcome-step";

export const OnboardingFlow = (): React.ReactElement => {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const { data: organizations, isPending: organizationsPending } =
    authClient.useListOrganizations();
  const { step, index, next, back } = useOnboardingSteps();

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

  const finish = (): void => {
    setLeaving(true);
    router.replace("/dashboard");
  };

  if (sessionPending || organizationsPending || leaving) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Icons.loading className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {step === "welcome" ? <WelcomeStep onContinue={next} /> : null}
          {step === "organization" ? <OrganizationStep onCreated={next} /> : null}
          {step === "invite" ? <InviteStep onContinue={next} /> : null}
          {step === "appearance" ? (
            <AppearanceStep onFinish={finish} finishing={leaving} />
          ) : null}
        </motion.div>
      </AnimatePresence>

      <OnboardingProgress index={index} />

      {index > 1 ? (
        <div className="mt-4 flex justify-center">
          <Button variant="ghost" size="sm" onClick={back}>
            <Icons.arrowLeft data-icon="inline-start" className="size-3.5" />
            Back
          </Button>
        </div>
      ) : null}
    </div>
  );
};
