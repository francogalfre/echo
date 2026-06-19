import imagotipo from "@echo/assets/imagotipo/accent.png";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const AmbientGlow = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(ellipse_55%_60%_at_50%_-10%,oklch(0.567_0.202_282.7_/_0.16),transparent_70%)]"
    />
  );
};

const Wordmark = () => {
  return <Image src={imagotipo} alt="echo" priority className="h-7 w-auto" />;
};

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerLabel: string;
  footerLinkLabel: string;
  footerHref: Route;
}

export const AuthLayout = ({
  title,
  subtitle,
  children,
  footerLabel,
  footerLinkLabel,
  footerHref,
}: AuthLayoutProps) => {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-12">
      <AmbientGlow />
      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Wordmark />
          <h1 className="mt-6 text-2xl font-semibold">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">{children}</div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {footerLabel}{" "}
          <Link
            href={footerHref}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </main>
  );
};
