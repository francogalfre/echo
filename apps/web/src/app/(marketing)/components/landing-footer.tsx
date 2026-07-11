import type { Route } from "next";
import Link from "next/link";

import { Logo } from "./logo";

type FooterColumn = {
  title: string;
  links: readonly { href: string; label: string }[];
};

const COLUMNS: readonly FooterColumn[] = [
  {
    title: "Product",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/#pricing", label: "Pricing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/terms", label: "Terms" },
    ],
  },
];

export const LandingFooter = (): React.ReactElement => {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 md:flex-row md:justify-between">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Feedback infrastructure for developers.
          </p>
        </div>
        <div className="flex gap-16">
          {COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                {column.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href as Route}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border px-4 py-6 sm:px-6">
        <p className="mx-auto max-w-6xl text-xs text-muted-foreground">© 2026 Echo</p>
      </div>
    </footer>
  );
};
