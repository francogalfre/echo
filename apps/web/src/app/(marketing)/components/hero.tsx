import { Badge } from "@echo/ui/components/badge";
import { buttonVariants } from "@echo/ui/components/button-variants";
import { CodeBlock } from "@echo/ui/components/code-block";
import { FadeIn } from "@echo/ui/components/fade-in";
import Link from "next/link";

import { env } from "@echo/env/web";

import { AmbientGlow } from "./ambient-glow";
import { TrustRow } from "./trust-row";

const CURL_SNIPPET = `curl -X POST ${env.NEXT_PUBLIC_SERVER_URL}/api/feedback \\
  -H "Authorization: Bearer echo_sk_your_secret_key" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Jane Smith", "feedback": "Love the product!"}'`;

export const Hero = (): React.ReactElement => {
  return (
    <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28">
      <AmbientGlow />
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <div className="flex flex-col items-start text-left">
          <FadeIn>
            <Badge variant="accent" dot className="mb-5">
              Feedback infrastructure · Developer-first
            </Badge>
          </FadeIn>
          <FadeIn delay={0.06}>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Feedback infrastructure for developers
            </h1>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground text-pretty">
              Collect, classify, and act on user feedback with a drop-in widget, a REST API,
              and a dashboard that turns raw comments into sentiment and summaries.
            </p>
          </FadeIn>
          <FadeIn delay={0.18}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className={buttonVariants({
                  size: "lg",
                  className: "h-11 px-6 text-sm shadow-sm",
                })}
              >
                Start for free
              </Link>
              <Link
                href="/docs"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "h-11 px-6 text-sm",
                })}
              >
                Read the docs
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={0.24}>
            <div className="mt-6">
              <TrustRow />
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={0.2}>
          <CodeBlock code={CURL_SNIPPET} language="bash" className="shadow-md" />
        </FadeIn>
      </div>
    </section>
  );
};
