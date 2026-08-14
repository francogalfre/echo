import { buttonVariants } from "@echo/ui/components/button-variants";
import { Icons } from "@echo/ui/components/icons";
import { cn } from "@echo/ui/lib/utils";

import { MotionButtonLink } from "../motion-button-link";
import { Reveal, RevealItem } from "../reveal";
import { HeroBackdrop } from "./hero-backdrop";

import Link from "next/link";
import Image from "next/image";

import dashboardMock from "../../../../../../public/landing/dashboard-mock.webp";
import heroBackground from "../../../../../../public/landing/hero-background.webp";

export const Hero = (): React.ReactElement => {
  return (
    <section className="relative -mt-20 overflow-hidden pt-32">
      <HeroBackdrop image={heroBackground} />

      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-4 sm:pt-24">
        <Reveal onLoad className="max-w-4xl">
          <RevealItem>
            <h1 className="font-pixel text-[2.25rem] leading-[1.05] font-medium tracking-tight text-pretty sm:text-5xl lg:text-[3.75rem] text-primary-foreground">
              Stop guessing. Start listening.
            </h1>
          </RevealItem>

          <RevealItem>
            <p className="mt-6 max-w-2xl text-base text-muted text-pretty sm:text-lg">
              Collect feedback from a customized page, the REST API, or a drop-in widget.
              Every submission is sentiment-scored and tagged by source as it lands, and
              recurring summaries tell you which complaints are trending.
            </p>
          </RevealItem>

          <RevealItem>
            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <MotionButtonLink
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group h-11 rounded-full bg-card px-6 text-sm text-foreground [a]:hover:bg-card/90 hover:shadow-none",
                )}
              >
                Get started free
              </MotionButtonLink>
              <Link
                href="/docs/getting-started"
                className="rounded-full px-4 py-2 flex items-center text-sm text-muted transition-colors hover:text-muted/90"
              >
                Read the docs
                <Icons.arrowRight className="transition-transform duration-200 group-hover:translate-x-0.5 size-4 mt-0.6" />
              </Link>
            </div>
          </RevealItem>
        </Reveal>

        <Reveal onLoad delay={0.35} className="mt-16 sm:mt-20">
          <RevealItem>
            <Image
              src={dashboardMock}
              alt="The Echo dashboard showing the feedback inbox with sentiment-scored, source-tagged submissions"
              sizes="(max-width: 1152px) 100vw, 1152px"
              loading="eager"
              placeholder="blur"
              className="rounded-[48px] border-8 border-gray-200/80 border-double"
            />
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
};
