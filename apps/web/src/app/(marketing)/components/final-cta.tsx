import { buttonVariants } from "@echo/ui/components/button-variants";
import { FadeIn } from "@echo/ui/components/fade-in";
import Link from "next/link";

export const FinalCta = (): React.ReactElement => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <FadeIn>
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card px-6 py-16 text-center">
          <h2 className="max-w-lg text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Start collecting feedback in minutes
          </h2>
          <Link
            href="/register"
            className={buttonVariants({ size: "lg", className: "h-11 px-6 text-sm" })}
          >
            Start for free
          </Link>
        </div>
      </FadeIn>
    </section>
  );
};
