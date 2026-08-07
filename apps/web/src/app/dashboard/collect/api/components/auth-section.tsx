import { Badge } from "@echo/ui/components/badge";
import { DOCS_TABLE_HEAD_CELL, DocsTable } from "@echo/ui/components/docs/docs-table";
import { DocsSectionHeading } from "@echo/ui/components/docs/docs-section";
import { InlineCode } from "@echo/ui/components/docs/inline-code";

import type { ApiKeyEntry } from "../hooks/use-api-keys";
import { KeysSection } from "./keys-section";

type AuthSectionProps = {
  keys: ApiKeyEntry[];
  onGenerate: () => void;
  generating: boolean;
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
  onGenerate,
  generating,
  onRoll,
  onRevoke,
  rollingId,
  revokingId,
}: AuthSectionProps): React.ReactElement => (
  <div className="space-y-6">
    <DocsSectionHeading
      title="Authentication"
      description={
        <>
          Every request needs an <InlineCode>Authorization: Bearer &lt;key&gt;</InlineCode>{" "}
          header. Using the wrong key type for an operation returns a 403.
        </>
      }
    />

    <DocsTable>
      <thead>
        <tr className="border-b border-border bg-muted/30 text-left">
          <th className={DOCS_TABLE_HEAD_CELL}>Key</th>
          <th className={DOCS_TABLE_HEAD_CELL}>Access</th>
          <th className={DOCS_TABLE_HEAD_CELL}>Usage</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {KEY_TYPES.map((type) => (
          <tr key={type.prefix} className="transition-colors hover:bg-muted/30">
            <td className="px-4 py-3 font-mono text-xs text-foreground">{type.prefix}…</td>
            <td className="px-4 py-3">
              <Badge className={type.accessStyle}>{type.access}</Badge>
            </td>
            <td className="px-4 py-3 text-muted-foreground">{type.usage}</td>
          </tr>
        ))}
      </tbody>
    </DocsTable>

    <KeysSection
      keys={keys}
      onGenerate={onGenerate}
      generating={generating}
      onRoll={onRoll}
      onRevoke={onRevoke}
      rollingId={rollingId}
      revokingId={revokingId}
    />
  </div>
);
