"use client";

import { ErrorCard } from "./components/error-card";

type Props = {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
};

const DashboardError = ({ reset }: Props): React.ReactElement => {
  return (
    <ErrorCard
      message="We couldn't load your dashboard. Please try again."
      onRetry={reset}
      className="py-16"
    />
  );
};

export default DashboardError;
