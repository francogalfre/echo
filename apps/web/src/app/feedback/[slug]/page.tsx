import { FadeIn } from "@echo/ui/components/fade-in";
import { cn } from "@echo/ui/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";

import { trpc } from "@/lib/trpc";

import { FeedbackCards } from "./components/feedback-cards";
import { FeedbackForm } from "./components/feedback-form";

type PageProps = { params: Promise<{ slug: string }> };

const FeedbackPage = async ({ params }: PageProps): Promise<React.ReactElement> => {
  const { slug } = await params;
  const page = await trpc.publicFeedback.getPage.query({ slug });

  if (!page) notFound();

  const { org, config, feedback } = page;
  const hasBanner = config.enableCoverBanner;
  const showCards = config.showFeedback && feedback.length > 0;

  const bannerStyle = config.coverBannerUrl
    ? {
        backgroundImage: `url("${config.coverBannerUrl}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : { background: config.backgroundColor };

  return (
    <main className="min-h-svh bg-background">
      {hasBanner && (
        <FadeIn className="h-52 w-full sm:h-72 lg:h-80" style={bannerStyle}>
          <></>
        </FadeIn>
      )}

      <div
        className={cn(
          "relative mx-auto w-full px-5 pb-24 sm:px-8",
          showCards ? "max-w-5xl" : "max-w-2xl",
        )}
      >
        {!hasBanner && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64"
            style={{
              background: `radial-gradient(600px circle at 15% 0%, ${config.accentColor}14, transparent 70%)`,
            }}
          />
        )}

        <div
          className={cn(
            showCards && "grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px]",
          )}
        >
          <div className={cn(showCards && "lg:sticky lg:top-12")}>
            <FadeIn delay={0.05}>
              {org.logo && (
                <Image
                  src={org.logo}
                  alt={`${org.name} logo`}
                  width={96}
                  height={96}
                  unoptimized={org.logo.startsWith("data:")}
                  className={cn(
                    "relative z-10 size-16 rounded-2xl object-cover sm:size-20",
                    hasBanner ? "-mt-8 sm:-mt-10" : "mt-16",
                  )}
                />
              )}

              <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {config.title || org.name}
              </h1>

              {config.description && (
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {config.description}
                </p>
              )}
            </FadeIn>

            <FadeIn delay={0.12} className="mt-8">
              <FeedbackForm
                slug={slug}
                accentColor={config.accentColor}
                enableEmail={config.enableEmail}
                enableRating={config.enableRating}
              />
            </FadeIn>
          </div>

          {showCards && (
            <FadeIn delay={0.2} className="lg:pt-24">
              <FeedbackCards items={feedback} accentColor={config.accentColor} />
            </FadeIn>
          )}
        </div>

        <p className="mt-12 text-center text-xs text-muted-foreground">Powered by echo</p>
      </div>
    </main>
  );
};

export default FeedbackPage;
