"use client";

import { ColorPicker } from "../../feedback-page/components/color-picker";

type CustomizeAccentProps = {
  accentColor: string;
  onAccentColorChange: (color: string) => void;
};

export const CustomizeAccent = ({
  accentColor,
  onAccentColorChange,
}: CustomizeAccentProps): React.ReactElement => {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-sm font-semibold">Customize</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Match the widget to your brand. Updates apply to the preview instantly.
      </p>

      <div className="mt-5 flex items-center gap-3">
        <ColorPicker value={accentColor} onChange={onAccentColorChange} variant="accent" />
        <div>
          <p className="text-sm font-medium">Accent color</p>
          <p className="text-xs text-muted-foreground">
            Used for the toggle button, star ratings, and the submit action.
          </p>
        </div>
      </div>
    </section>
  );
};
