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
      "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors duration-300",
      active
        ? "bg-foreground/5 text-foreground"
        : "text-muted-foreground hover:text-foreground",
    ].join(" ")}
  >
    <Icon
      className={[
        "size-4.5 shrink-0 transition-colors duration-300",
        active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
      ].join(" ")}
    />
    {label}
  </Link>
);
