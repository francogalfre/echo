import { buttonVariants } from "@echo/ui/components/button-variants";
import Link from "next/link";

import { Logo } from "./logo";

export const LandingNav = (): React.ReactElement => {
  return (
    <header className="sticky top-0 z-40 border-b border-transparent bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Echo home" className="flex items-center">
          <Logo />
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/docs"
            className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Docs
          </Link>
          <Link
            href="/#pricing"
            className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className={buttonVariants({
              variant: "ghost",
              className: "h-9 px-3 text-sm",
            })}
          >
            Log in
          </Link>
          <Link
            href="/register"
            className={buttonVariants({
              className: "h-9 px-4 text-sm",
            })}
          >
            Start for free
          </Link>
        </div>
      </nav>
    </header>
  );
};
