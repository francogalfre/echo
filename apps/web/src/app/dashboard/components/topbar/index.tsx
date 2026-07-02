import { Breadcrumb } from "./breadcrumb";
import { CommandSearch } from "./command-search";
import { Notifications } from "./notifications";

export const Topbar = (): React.ReactElement => {
  return (
    <header className="z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-sidebar px-5">
      <Breadcrumb />
      <div className="flex items-center gap-2">
        <CommandSearch />
        <Notifications />
      </div>
    </header>
  );
};
