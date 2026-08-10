import { Icons } from "@echo/ui/components/icons";
import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import type { DigestOutput } from "@echo/ai";

import { IssuesContent, MoodContent, SuggestionsContent } from "./digest-summary";
import { ThemesContent } from "./digest-themes";

type SectionHeaderProps = {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

function SectionHeader({ label, icon: Icon }: SectionHeaderProps): React.ReactElement {
  return (
    <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
      {Icon && <Icon className="size-3.5 text-muted-foreground/70" />}
      {label}
    </h3>
  );
}

type AnalysisContentProps = {
  digest: DigestOutput;
};

export function AnalysisContent({ digest }: AnalysisContentProps): React.ReactElement {
  const hasSuggestions = !!digest.suggestions && digest.suggestions.length > 0;

  return (
    <Stagger className="mx-auto flex w-full max-w-3xl flex-col gap-10" stagger={0.06}>
      <StaggerItem className="flex flex-col gap-2">
        <p className="text-[15px] leading-7 text-foreground">{digest.executiveSummary}</p>
      </StaggerItem>

      <StaggerItem className="flex flex-col gap-3">
        <SectionHeader label="Issues" icon={Icons.radar} />
        <IssuesContent digest={digest} />
      </StaggerItem>

      <StaggerItem className="flex flex-col gap-3">
        <SectionHeader label="Themes" icon={Icons.search} />
        <ThemesContent digest={digest} />
      </StaggerItem>

      <StaggerItem className="flex flex-col gap-3">
        <SectionHeader label="What users love" icon={Icons.trendUp} />
        <MoodContent digest={digest} />
      </StaggerItem>

      {hasSuggestions && (
        <StaggerItem className="flex flex-col gap-3">
          <SectionHeader label="Ideas to explore" icon={Icons.sparkles} />
          <SuggestionsContent digest={digest} />
        </StaggerItem>
      )}
    </Stagger>
  );
}
