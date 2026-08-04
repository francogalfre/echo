import { CodeBlock } from "@echo/ui/components/code-block";
import { Icons } from "@echo/ui/components/icons";

type ApiHeroProps = {
  request: string;
  response: string;
};

export const ApiHero = ({ request, response }: ApiHeroProps): React.ReactElement => (
  <div
    className={[
      "rounded-2xl border border-border p-6 sm:p-8",
      "bg-gradient-to-br from-pastel-violet-bg/70 via-card to-pastel-blue-bg/70",
    ].join(" ")}
  >
    <div className="mb-6 flex items-center gap-2">
      <span className="flex size-6 items-center justify-center rounded-md bg-accent/10 text-accent">
        <Icons.sparkles className="size-3.5" />
      </span>
      <p className="text-xs font-semibold text-muted-foreground">
        Send feedback, get confirmation
      </p>
    </div>

    <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
      <div>
        <p className="mb-2.5 text-[11px] font-semibold text-muted-foreground">Request</p>
        <CodeBlock code={request} language="javascript" />
      </div>

      <div className="flex justify-center text-muted-foreground">
        <Icons.arrowRight className="size-4 rotate-90 lg:rotate-0" />
      </div>

      <div>
        <p className="mb-2.5 text-[11px] font-semibold text-muted-foreground">Response</p>
        <CodeBlock code={response} language="json" />
      </div>
    </div>
  </div>
);
