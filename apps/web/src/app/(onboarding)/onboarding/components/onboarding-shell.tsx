import { cn } from "@echo/ui/lib/utils";
import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

type StepProgressProps = {
  index: number;
  count: number;
  className?: string;
};

const StepProgress = ({ index, count, className }: StepProgressProps) => (
  <div
    className={cn("flex items-center gap-1.5", className)}
    role="progressbar"
    aria-valuenow={index + 1}
    aria-valuemin={1}
    aria-valuemax={count}
    aria-label="Onboarding progress"
  >
    {Array.from({ length: count }, (_, position) => (
      <span
        key={position}
        className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/10"
      >
        <span
          className={cn(
            "block h-full rounded-full bg-accent transition-[width] duration-500 ease-out",
            position <= index ? "w-full" : "w-0",
          )}
        />
      </span>
    ))}
  </div>
);

type OnboardingShellProps = {
  character: StaticImageData;
  caption: string;
  stepIndex: number;
  stepCount: number;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export const OnboardingShell = ({
  character,
  caption,
  stepIndex,
  stepCount,
  title,
  description,
  children,
  footer,
}: OnboardingShellProps): React.ReactElement => (
  <div className="w-full rounded-[2rem] border border-border bg-card p-2 shadow-xl shadow-black/5">
    <div className="flex flex-col md:min-h-[34rem] md:flex-row">
      <aside className="hidden flex-[0.85] flex-col items-center justify-center gap-7 rounded-[1.5rem] bg-muted/50 p-8 text-center md:flex">
        <Image
          src={character}
          alt=""
          aria-hidden="true"
          priority
          className="size-48 object-contain"
        />
        <p className="max-w-64 text-sm leading-relaxed text-balance text-muted-foreground">
          {caption}
        </p>

        <StepProgress index={stepIndex} count={stepCount} className="mt-4 w-full" />
      </aside>

      <div className="flex flex-1 flex-col p-6 sm:p-10">
        <StepProgress index={stepIndex} count={stepCount} className="mb-8 md:hidden" />

        <header>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </header>

        <div className="mt-8 flex-1">{children}</div>

        <div className="mt-10 flex items-center gap-3">{footer}</div>
      </div>
    </div>
  </div>
);
