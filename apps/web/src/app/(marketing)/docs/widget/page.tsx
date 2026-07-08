import { env } from "@echo/env/web";
import { CodeBlock } from "@echo/ui/components/code-block";
import { Separator } from "@echo/ui/components/separator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Widget · echo docs",
};

const WidgetDocsPage = () => {
  const serverUrl = env.NEXT_PUBLIC_SERVER_URL;
  const registryUrl = `${serverUrl}/api/widget/<project-slug>/registry`;
  const componentUrl = `${serverUrl}/api/widget/<project-slug>/component`;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Widget</h1>
        <p className="mt-3 text-muted-foreground">
          A floating, sentiment-first feedback button you drop into your app. Users pick an
          emoji rating from 1 to 5 and can optionally leave a comment — no separate feedback
          page required.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold tracking-tight">Install via shadcn</h2>
        <p className="mt-2 text-muted-foreground">
          The widget ships as a shadcn registry component, wired to your project's
          publishable key. Replace{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">&lt;project-slug&gt;</code>{" "}
          with your project's slug from the dashboard.
        </p>
        <div className="mt-3">
          <CodeBlock code={`npx shadcn@latest add "${registryUrl}"`} language="bash" />
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold tracking-tight">Standalone component</h2>
        <p className="mt-2 text-muted-foreground">
          Prefer not to use the shadcn CLI? Download a single self-contained component file
          instead:
        </p>
        <div className="mt-3">
          <CodeBlock
            code={`curl -o components/echo-widget.tsx \\\n  "${componentUrl}"`}
            language="bash"
          />
        </div>
      </section>
    </div>
  );
};

export default WidgetDocsPage;
