import { env } from "@echo/env/web";
import { CodeBlock } from "@echo/ui/components/code-block";
import { FadeIn } from "@echo/ui/components/fade-in";
import { Icons } from "@echo/ui/components/icons";

const INSTALL_SNIPPET = `npx shadcn@latest add "${env.NEXT_PUBLIC_SERVER_URL}/api/widget/<project-slug>/registry"`;

const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"] as const;

export const Showcase = (): React.ReactElement => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <div className="flex flex-col items-start text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Drop it in, not around it
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Install the widget as a shadcn component, wired to your project&apos;s
              publishable key. It ships as source you own, styled with your own Tailwind
              tokens.
            </p>
            <div className="mt-6 w-full">
              <CodeBlock code={INSTALL_SNIPPET} language="bash" />
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium">How would you rate your experience?</p>
            <div className="mt-3 flex gap-1 text-accent" aria-hidden="true">
              {STAR_KEYS.map((key) => (
                <Icons.star key={key} className="size-5" />
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
              Tell us more (optional)
            </div>
            <div className="mt-4 flex justify-end">
              <span className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground">
                Send feedback
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
