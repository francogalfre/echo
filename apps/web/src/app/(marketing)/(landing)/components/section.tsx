import { cn } from "@echo/ui/lib/utils";
import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export const Section = ({ id, className, children }: SectionProps): React.ReactElement => (
  <section id={id} className={cn("scroll-mt-24 py-24 sm:py-32", className)}>
    <div className="mx-auto max-w-6xl px-6">{children}</div>
  </section>
);

type SectionHeadingProps = {
  title: string;
  description?: string;
  align?: "start" | "center";
};

export const SectionHeading = ({
  title,
  description,
  align = "start",
}: SectionHeadingProps): React.ReactElement => (
  <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
    <h2 className="font-pixel text-3xl font-medium tracking-tight text-balance sm:text-[2.5rem] sm:leading-[1.1]">
      {title}
    </h2>
    {description ? (
      <p
        className={cn(
          "mt-4 max-w-md text-base text-balance text-muted-foreground",
          align === "center" && "mx-auto",
        )}
      >
        {description}
      </p>
    ) : null}
  </div>
);
