import { notFound } from "next/navigation";
import Image from "next/image";

import { trpc } from "@/lib/trpc";
import { FeedbackForm } from "./components/feedback-form";

type PageProps = { params: Promise<{ slug: string }> };

const FeedbackPage = async ({ params }: PageProps): Promise<React.ReactElement> => {
  const { slug } = await params;
  const page = await trpc.publicFeedback.getPage.query({ slug });

  if (!page) notFound();

  const { org, config } = page;

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          {org.logo && (
            <Image
              src={org.logo}
              alt={`${org.name} logo`}
              width={48}
              height={48}
              className="mb-5 size-12 rounded-lg object-cover"
            />
          )}

          <h1 className="text-2xl font-semibold">{config.title || org.name}</h1>

          {config.description && (
            <p className="mt-1.5 text-sm text-muted-foreground">{config.description}</p>
          )}

          <div className="mt-6">
            <FeedbackForm
              slug={slug}
              accentColor={config.accentColor}
              enableEmail={config.enableEmail}
              enableRating={config.enableRating}
            />
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">Powered by echo</p>
      </div>
    </main>
  );
};

export default FeedbackPage;
