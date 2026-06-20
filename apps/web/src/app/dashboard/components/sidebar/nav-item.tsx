import type { Route } from "next";
import Link from "next/link";

import type { NavItem } from "./types";

type NavLinkProps = { item: NavItem; active: boolean };

export const NavLink = ({
  item: { label, href, icon: Icon },
  active,
}: NavLinkProps): React.ReactElement => (
  <Link
    href={href as Route}
    className={[
      "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors duration-100",
      active
        ? "bg-accent/60 font-medium text-foreground"
        : "text-muted-foreground hover:text-foreground",
    ].join(" ")}
  >
    <Icon
      className={[
        "size-4 shrink-0 transition-colors duration-100",
        active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
      ].join(" ")}
    />
    {label}
  </Link>
);
