import { buttonVariants } from "@echo/ui/components/button-variants";
import { FadeIn } from "@echo/ui/components/fade-in";
import Link from "next/link";

import { TrustRow } from "./trust-row";

export const FinalCta = (): React.ReactElement => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <FadeIn>
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card px-6 py-16 text-center">
          <div className="flex flex-col items-center gap-3">
            <h2 className="max-w-lg text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Start collecting feedback in minutes
            </h2>
            <p className="max-w-md text-muted-foreground text-pretty">
              Install the widget or call the API — every submission gets AI sentiment from
              the first day, free.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className={buttonVariants({
                size: "lg",
                className: "h-11 px-6 text-sm shadow-sm",
              })}
            >
              Start for free
            </Link>
            <Link
              href="/docs"
              className={buttonVariants({
                variant: "ghost",
                size: "lg",
                className: "h-11 px-6 text-sm",
              })}
            >
              Read the docs
            </Link>
          </div>
          <TrustRow />
        </div>
      </FadeIn>
    </section>
  );
};
