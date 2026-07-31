import { Icons } from "@echo/ui/components/icons";
import { Suspense } from "react";

import { OnboardingFlow } from "./components/onboarding-flow";

const OnboardingPage = (): React.ReactElement => (
  <Suspense
    fallback={
      <div className="flex min-h-64 items-center justify-center">
        <Icons.loading className="size-5 animate-spin text-muted-foreground" />
      </div>
    }
  >
    <OnboardingFlow />
  </Suspense>
);

export default OnboardingPage;
