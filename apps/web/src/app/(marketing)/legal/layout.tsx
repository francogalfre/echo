import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "../components/logo";

type LegalLayoutProps = {
  children: ReactNode;
};

const LegalLayout = ({ children }: LegalLayoutProps) => {
  return (
    <div className="mx-auto max-w-xl px-6 py-20">
      <Link href="/" className="inline-flex">
        <Logo />
      </Link>
      <div className="mt-12">{children}</div>
      <footer className="mt-20 flex items-center gap-4 border-t border-border pt-8 text-xs text-muted-foreground">
        <Link href="/docs" className="hover:text-foreground">
          Docs
        </Link>
        <Link href="/legal/privacy" className="hover:text-foreground">
          Privacy
        </Link>
        <Link href="/legal/terms" className="hover:text-foreground">
          Terms
        </Link>
      </footer>
    </div>
  );
};

export default LegalLayout;
