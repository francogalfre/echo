import { buttonVariants } from "@echo/ui/components/button-variants";
import { Icons } from "@echo/ui/components/icons";
import Link from "next/link";
import type { CSSProperties } from "react";

const glow: CSSProperties = {
  backgroundImage:
    "radial-gradient(ellipse 46% 62% at 50% 108%, color-mix(in oklch, var(--accent) 58%, transparent), transparent 66%)",
  filter: "blur(56px)",
};

export const CallToAction = (): React.ReactElement => {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={glow} />

      <div className="relative mx-auto max-w-6xl px-6 py-28 text-center sm:py-36">
        <h2 className="mx-auto max-w-2xl font-pixel text-3xl leading-[1.1] font-medium text-balance sm:text-5xl">
          Ship what they asked for
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base text-muted-foreground text-pretty">
          Create a project, paste one snippet, and watch the first piece of feedback land
          before your coffee gets cold.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className={buttonVariants({
              size: "lg",
              className: "group h-11 rounded-full px-6 text-sm",
            })}
          >
            Start collecting free
            <Icons.arrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/docs"
            className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Browse the docs
          </Link>
        </div>
      </div>
    </section>
  );
};
