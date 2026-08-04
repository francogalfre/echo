import { Badge } from "@echo/ui/components/badge";

import type { ApiKeyEntry } from "../hooks/use-api-keys";
import { KeysSection } from "./keys-section";
import { TABLE_HEAD_CELL } from "./table-styles";

type AuthSectionProps = {
  keys: ApiKeyEntry[];
  onRoll: (id: string) => void;
  onRevoke: (id: string) => void;
  rollingId: string | null;
  revokingId: string | null;
};

type KeyType = {
  prefix: string;
  access: string;
  accessStyle: string;
  usage: string;
};

const KEY_TYPES: readonly KeyType[] = [
  {
    prefix: "echo_pk_",
    access: "Read-only",
    accessStyle: "bg-pastel-blue-bg text-pastel-blue-text",
    usage: "Safe for client-side code. Authenticates GET requests.",
  },
  {
    prefix: "echo_sk_",
    access: "Read & write",
    accessStyle: "bg-pastel-violet-bg text-pastel-violet-text",
    usage: "Server-side only, never expose it. Authenticates POST requests.",
  },
];

export const AuthSection = ({
  keys,
  onRoll,
  onRevoke,
  rollingId,
  revokingId,
}: AuthSectionProps): React.ReactElement => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-semibold tracking-tight">Authentication</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Every request needs an{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground">
          Authorization: Bearer &lt;key&gt;
        </code>{" "}
        header. Using the wrong key type for an operation returns a 403.
      </p>
    </div>

    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-left">
            <th className={TABLE_HEAD_CELL}>Key</th>
            <th className={TABLE_HEAD_CELL}>Access</th>
            <th className={TABLE_HEAD_CELL}>Usage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {KEY_TYPES.map((type) => (
            <tr key={type.prefix} className="transition-colors hover:bg-muted/30">
              <td className="px-4 py-3 font-mono text-xs text-foreground">
                {type.prefix}…
              </td>
              <td className="px-4 py-3">
                <Badge className={type.accessStyle}>{type.access}</Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{type.usage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <KeysSection
      keys={keys}
      onRoll={onRoll}
      onRevoke={onRevoke}
      rollingId={rollingId}
      revokingId={revokingId}
    />
  </div>
);
