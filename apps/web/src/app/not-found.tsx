import imagotipo from "@echo/assets/imagotipo/accent.png";
import { buttonVariants } from "@echo/ui/components/button-variants";
import { FadeIn } from "@echo/ui/components/fade-in";
import { Icons } from "@echo/ui/components/icons";
import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";

import { createMetadata } from "@/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "Page not found",
  noIndex: true,
});

const NotFoundPage = (): React.ReactElement => {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(ellipse_55%_60%_at_50%_-10%,oklch(0.567_0.202_282.7/0.14),transparent_70%)]"
      />
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <FadeIn>
          <Image src={imagotipo} alt="Echo" priority className="mb-10 h-7 w-auto" />
        </FadeIn>
        <FadeIn delay={0.08}>
          <span className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Icons.search className="size-6" />
          </span>
        </FadeIn>
        <FadeIn delay={0.14}>
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight text-balance">
            Page not found
          </h1>
          <p className="mt-2 max-w-xs text-sm text-pretty text-muted-foreground">
            The page you're looking for doesn't exist or may have moved.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className={buttonVariants({ size: "lg", className: "h-10 px-6 text-sm" })}
            >
              Back to home
            </Link>
            <Link
              href="/docs"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "h-10 px-6 text-sm",
              })}
            >
              Read the docs
            </Link>
          </div>
        </FadeIn>
      </div>
    </main>
  );
};

export default NotFoundPage;
