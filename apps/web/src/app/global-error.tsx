"use client";

import { buttonVariants } from "@echo/ui/components/button-variants";
import { Icons } from "@echo/ui/components/icons";
import Link from "next/link";

import { geistMono, geistSans, instrumentSans } from "@/utils/fonts";

import "../index.css";

type GlobalErrorProps = {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
};

const GlobalError = ({ error, reset }: GlobalErrorProps): React.ReactElement => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSans.variable}`}
      >
        <main className="flex min-h-svh items-center justify-center px-4 py-12">
          <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-lg bg-card px-6 py-10 text-center ring-1 ring-foreground/10">
            <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <Icons.alertCircle className="size-6" />
            </span>
            <div>
              <h1 className="font-display text-xl font-semibold tracking-tight text-balance">
                Something went wrong
              </h1>
              <p className="mt-2 text-sm text-pretty text-muted-foreground">
                An unexpected error stopped this page from loading. Try again, or head back
                home.
              </p>
              {error.digest ? (
                <p className="mt-3 font-mono text-xs text-muted-foreground/70">
                  Error digest: {error.digest}
                </p>
              ) : null}
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={reset}
                className={buttonVariants({ size: "lg", className: "h-10 px-6 text-sm" })}
              >
                Try again
              </button>
              <Link
                href="/"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "h-10 px-6 text-sm",
                })}
              >
                Back to home
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
};

export default GlobalError;
