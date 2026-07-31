import type { ReactNode } from "react";

type OnboardingCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export const OnboardingCard = ({
  title,
  description,
  children,
}: OnboardingCardProps): React.ReactElement => (
  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
    <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
      {title}
    </h1>
    <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
    {children}
  </div>
);

type OnboardingActionsProps = {
  children: ReactNode;
};

export const OnboardingActions = ({
  children,
}: OnboardingActionsProps): React.ReactElement => (
  <div className="mt-8 flex items-center justify-end gap-2">{children}</div>
);
