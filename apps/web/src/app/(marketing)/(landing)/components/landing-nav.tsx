import { buttonVariants } from "@echo/ui/components/button-variants";
import { Icons } from "@echo/ui/components/icons";
import Link from "next/link";

import { Logo } from "../../components/logo";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#integrate", label: "Integrate" },
  { href: "#pricing", label: "Pricing" },
] as const;

export const LandingNav = (): React.ReactElement => {
  return (
    <header className="relative z-20">
      <nav
        aria-label="Main"
        className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6"
      >
        <Link href="/" aria-label="Echo home" className="shrink-0">
          <Logo />
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/docs"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Docs
          </Link>
        </div>

        <Link
          href="/dashboard"
          className={buttonVariants({
            size: "sm",
            className: "group h-9 shrink-0 rounded-full pr-3.5 pl-4",
          })}
        >
          Go to dashboard
          <Icons.arrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </nav>
    </header>
  );
};
