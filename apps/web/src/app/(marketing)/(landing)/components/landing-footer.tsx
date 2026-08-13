import { Icons } from "@echo/ui/components/icons";
import Link from "next/link";
import type { CSSProperties } from "react";

import { Logo } from "../../components/logo";

const glow: CSSProperties = {
  backgroundImage: [
    "radial-gradient(ellipse 42% 34% at 50% 100%, color-mix(in oklch, var(--accent) 62%, transparent), transparent 70%)",
    "radial-gradient(ellipse 68% 62% at 50% 101%, color-mix(in oklch, var(--accent-soft) 46%, transparent), transparent 72%)",
    "radial-gradient(ellipse 110% 100% at 50% 103%, color-mix(in oklch, var(--accent-soft) 26%, transparent), transparent 74%)",
  ].join(", "),
};

const actions = [
  { href: "/docs", label: "Read the docs" },
  { href: "/dashboard", label: "Go to dashboard" },
] as const;

const columns = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#channels", label: "Integrations" },
      { href: "#pricing", label: "Pricing" },
      { href: "#faq", label: "FAQ" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/docs/getting-started", label: "Getting started" },
      { href: "/docs/api", label: "REST API" },
      { href: "/docs/widget", label: "Widget" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/register", label: "Create account" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/terms", label: "Terms" },
    ],
  },
] as const;

export const LandingFooter = (): React.ReactElement => {
  return (
    <footer className="relative isolate overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[150%]"
        style={glow}
      />

      <div className="mx-auto max-w-6xl px-6 pt-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <p className="max-w-md font-pixel text-2xl leading-tight text-balance text-foreground sm:text-3xl">
            Turn feedback into what you build next.
          </p>

          <div className="flex flex-wrap gap-3">
            {actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:border-foreground/20 hover:bg-card"
              >
                {action.label}
                <Icons.arrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-10 border-t border-border pt-10 md:grid-cols-[auto_1fr] md:gap-20">
          <Link href="/" aria-label="Echo home" className="h-6 w-fit">
            <Logo />
          </Link>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4"
          >
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) =>
                    link.href.startsWith("#") ? (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </a>
                      </li>
                    ) : (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Echo. All rights reserved.</p>
        </div>
      </div>

      <div className="relative overflow-clip px-6 sm:pb-0">
        <p className="text-center font-pixel text-[18vw] leading-[0.8] font-medium tracking-tighter text-foreground sm:text-[12rem] lg:text-[14rem]">
          ECHO
        </p>
      </div>
    </footer>
  );
};
