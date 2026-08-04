import { Suspense } from "react";

import { SettingsSkeleton } from "../components/settings-skeleton";
import { TeamData } from "./components/team-data";

const TeamSettingsPage = (): React.ReactElement => (
  <Suspense fallback={<SettingsSkeleton />}>
    <TeamData />
  </Suspense>
);

export default TeamSettingsPage;
