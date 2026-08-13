import { buttonVariants } from "@echo/ui/components/button-variants";
import { Icons } from "@echo/ui/components/icons";
import Link from "next/link";

export const CallToAction = (): React.ReactElement => {
  return (
    <section className="relative z-10 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-28 text-center sm:py-36">
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
