import { buttonVariants } from "@echo/ui/components/button-variants";
import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "../components/logo";
import { DocsSidebar } from "./components/docs-sidebar";

type DocsLayoutProps = {
  children: ReactNode;
};

const DocsLayout = ({ children }: DocsLayoutProps) => {
  return (
    <div className="min-h-svh">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/">
            <Logo />
          </Link>
          <Link
            href="/login"
            className={buttonVariants({
              variant: "outline",
              className: "h-8 px-3 text-xs",
            })}
          >
            Back to app
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-10 lg:flex lg:gap-10">
        <DocsSidebar />
        <div className="min-w-0 max-w-3xl flex-1 py-2">{children}</div>
      </div>
    </div>
  );
};

export default DocsLayout;
