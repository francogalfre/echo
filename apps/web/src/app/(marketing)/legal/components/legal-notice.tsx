import { Icons } from "@echo/ui/components/icons";

export const LegalNotice = (): React.ReactElement => {
  return (
    <div className="mb-10 flex gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
      <Icons.triangleAlert className="mt-0.5 size-4 shrink-0" />
      <p>
        This is a template for illustration only and is not legal advice. Have it reviewed
        by a qualified lawyer before relying on it.
      </p>
    </div>
  );
};
