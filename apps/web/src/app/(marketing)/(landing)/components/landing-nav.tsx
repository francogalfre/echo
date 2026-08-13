import { buttonVariants } from "@echo/ui/components/button-variants";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";
import Link from "next/link";

import { Logo } from "../../components/logo";
import { MotionButtonLink } from "./motion-button-link";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
] as const;

export const LandingNav = (): React.ReactElement => {
  return (
    <header className="relative z-20">
      <nav
        aria-label="Main"
        className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6"
      >
        <Link href="/#" aria-label="Echo home" className="shrink-0">
          <Logo theme="dark" />
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-muted/80"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/docs"
            className="text-sm text-muted transition-colors hover:text-muted/80"
          >
            Docs
          </Link>
        </div>

        <MotionButtonLink
          href="/dashboard"
          className={cn(
            buttonVariants({ size: "sm" }),
            "group h-9 shrink-0 rounded-full bg-card pr-3.5 pl-4 text-foreground [a]:hover:bg-card/90 hover:shadow-none",
          )}
        >
          Go to dashboard
          <Icons.arrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </MotionButtonLink>
      </nav>
    </header>
  );
};
