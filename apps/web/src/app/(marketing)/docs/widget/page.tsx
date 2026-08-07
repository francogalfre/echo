import { env } from "@echo/env/web";
import { CodeBlock } from "@echo/ui/components/code-block";
import type { DocsTocSection } from "@echo/ui/components/docs/docs-toc";
import { InlineCode } from "@echo/ui/components/docs/inline-code";
import { FadeIn } from "@echo/ui/components/fade-in";
import { Separator } from "@echo/ui/components/separator";

import { createMetadata } from "@/utils/metadata";

import { DocsPageHeader } from "../components/docs-page-header";
import { RegisterDocsToc } from "../components/register-docs-toc";

export const metadata = createMetadata({
  title: "Widget",
  description: "Drop a floating, sentiment-first feedback button into your app.",
  path: "/docs/widget",
});

const SECTIONS: readonly DocsTocSection[] = [
  { id: "install-via-shadcn", label: "Install via shadcn" },
  { id: "standalone-component", label: "Standalone component" },
];

const WidgetDocsPage = () => {
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;
  const registryUrl = `${serverUrl}/api/widget/<project-slug>/registry`;
  const componentUrl = `${serverUrl}/api/widget/<project-slug>/component`;

  return (
    <div className="docs-page-stack">
      <RegisterDocsToc sections={SECTIONS} />

      <FadeIn>
        <DocsPageHeader
          title="Widget"
          description="A floating, sentiment-first feedback button you drop into your app. Users pick a star rating from 1 to 5 and can optionally leave a comment — no separate feedback page required."
          breadcrumb={["Reference", "Widget"]}
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <section>
          <h2 id="install-via-shadcn" className="text-xl font-semibold tracking-tight">
            Install via shadcn
          </h2>
          <p className="mt-2 text-muted-foreground">
            The widget ships as a shadcn registry component, wired to your project's
            publishable key. Replace <InlineCode>&lt;project-slug&gt;</InlineCode> with your
            project's slug from the dashboard.
          </p>
          <div className="mt-3">
            <CodeBlock code={`npx shadcn@latest add "${registryUrl}"`} language="bash" />
          </div>
        </section>
      </FadeIn>

      <Separator />

      <FadeIn delay={0.1}>
        <section>
          <h2 id="standalone-component" className="text-xl font-semibold tracking-tight">
            Standalone component
          </h2>
          <p className="mt-2 text-muted-foreground">
            Prefer not to use the shadcn CLI? Download a single self-contained component
            file instead:
          </p>
          <div className="mt-3">
            <CodeBlock
              code={`curl -o components/echo-widget.tsx \\\n  "${componentUrl}"`}
              language="bash"
            />
          </div>
        </section>
      </FadeIn>
    </div>
  );
};

export default WidgetDocsPage;
