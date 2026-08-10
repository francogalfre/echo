import imagotipo from "@echo/assets/imagotipo/accent.png";
import { buttonVariants } from "@echo/ui/components/button-variants";
import { FadeIn } from "@echo/ui/components/fade-in";
import { Icons } from "@echo/ui/components/icons";
import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";

import { createMetadata } from "@/utils/metadata";

export const metadata: Metadata = createMetadata({
  title: "Payment successful",
  noIndex: true,
});

type SuccessPageProps = {
  searchParams: Promise<{ checkout_id?: string; customer_session_token?: string }>;
};

const SuccessPage = async ({
  searchParams,
}: SuccessPageProps): Promise<React.ReactElement> => {
  const { checkout_id: checkoutId } = await searchParams;

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(ellipse_55%_60%_at_50%_-10%,oklch(0.567_0.202_282.7/0.16),transparent_70%)]"
      />
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <FadeIn>
          <Image src={imagotipo} alt="Echo" priority className="mb-10 h-7 w-auto" />
        </FadeIn>
        <FadeIn delay={0.08}>
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icons.circleCheck className="size-6" />
          </span>
        </FadeIn>
        <FadeIn delay={0.14}>
          <h1 className="mt-5 font-pixel text-2xl font-medium tracking-tight text-balance">
            You're on Pro
          </h1>
          <p className="mt-2 max-w-xs text-sm text-pretty text-muted-foreground">
            Your subscription is active. It may take a moment to reflect across your
            dashboard.
          </p>
          {checkoutId ? (
            <p className="mt-2 text-xs text-muted-foreground/70">
              Reference: {checkoutId.slice(0, 8)}…
            </p>
          ) : null}
        </FadeIn>
        <FadeIn delay={0.2}>
          <Link
            href="/dashboard/settings/billing"
            className={buttonVariants({ size: "lg", className: "mt-8 h-10 px-6 text-sm" })}
          >
            Go to billing
          </Link>
        </FadeIn>
      </div>
    </main>
  );
};

export default SuccessPage;
