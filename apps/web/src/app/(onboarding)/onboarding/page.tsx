import { Suspense } from "react";

import { OnboardingFlow } from "./components/onboarding-flow";
import { OnboardingSkeleton } from "./components/onboarding-skeleton";

const OnboardingPage = (): React.ReactElement => (
  <Suspense fallback={<OnboardingSkeleton />}>
    <OnboardingFlow />
  </Suspense>
);

export default OnboardingPage;
