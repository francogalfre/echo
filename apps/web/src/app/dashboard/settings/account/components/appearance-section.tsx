import { ThemeSelector } from "@/utils/theme-selector";

import { SettingsCard } from "../../components/settings-card";
import { SettingsRow } from "../../components/settings-row";

export const AppearanceSection = (): React.ReactElement => {
  return (
    <SettingsCard>
      <h2 className="text-sm font-medium text-foreground">Appearance</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Choose how Echo looks on this device.
      </p>

      <div className="mt-6">
        <SettingsRow label="Interface theme" description="Select or sync with your system.">
          <ThemeSelector />
        </SettingsRow>
      </div>
    </SettingsCard>
  );
};
