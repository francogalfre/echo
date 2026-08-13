import { Suspense } from "react";

import { ApiKeysData } from "./components/api-keys-data";
import { ApiKeysSkeleton } from "./components/api-keys-section";

const ApiKeysSettingsPage = (): React.ReactElement => (
  <Suspense fallback={<ApiKeysSkeleton />}>
    <ApiKeysData />
  </Suspense>
);

export default ApiKeysSettingsPage;
