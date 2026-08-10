import { Stagger, StaggerItem } from "@echo/ui/components/motion/stagger";
import type { DigestOutput } from "@echo/ai";

export function ThemesContent({ digest }: { digest: DigestOutput }): React.ReactElement {
  return (
    <div className="flex flex-col">
      {digest.themes.length > 0 ? (
        <Stagger className="flex flex-col gap-2" stagger={0.04}>
          {digest.themes.map((theme, index) => (
            <StaggerItem key={`${index}-${theme.title}`}>
              <div className="flex flex-col gap-1 rounded-lg bg-card/60 px-3.5 py-3 ring-1 ring-foreground/10">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-foreground">{theme.title}</p>
                  <span className="ml-auto shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-xs tabular-nums text-muted-foreground">
                    {theme.count}
                  </span>
                </div>
                <p className="text-[13px] text-muted-foreground">{theme.insight}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <p className="text-sm text-muted-foreground">No themes identified yet.</p>
      )}
    </div>
  );
}
