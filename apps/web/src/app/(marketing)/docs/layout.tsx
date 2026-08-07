import { buttonVariants } from "@echo/ui/components/button-variants";
import Link from "next/link";
import type { ReactNode } from "react";

import { MotionProvider } from "../../dashboard/components/layout/motion-provider";
import { Logo } from "../components/logo";
import { DocsPager } from "./components/docs-pager";
import { DocsSidebar } from "./components/docs-sidebar";
import { DocsTocProvider } from "./components/docs-toc-context";
import { DocsTocSlot } from "./components/docs-toc-slot";

type DocsLayoutProps = {
  children: ReactNode;
};

const DocsLayout = ({ children }: DocsLayoutProps) => {
  return (
    <MotionProvider>
      <div className="flex h-svh flex-col">
        <header className="border-b border-border">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <Link href="/">
              <Logo />
            </Link>
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "outline",
                className: "h-8 px-3 text-xs",
              })}
            >
              Back to app
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto [scrollbar-gutter:stable]">
          <div className="docs-shell-row mx-auto max-w-7xl px-6 py-12">
            <DocsSidebar />
            <DocsTocProvider>
              <div id="docs-content" className="min-w-0 max-w-3xl flex-1 py-4">
                {children}
                <DocsPager />
              </div>
              <DocsTocSlot />
            </DocsTocProvider>
          </div>
        </main>
      </div>
    </MotionProvider>
  );
};

export default DocsLayout;
