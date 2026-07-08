import type { ApiKeys } from "../hooks/use-api-keys";
import { KeysSection } from "./keys-section";

type AuthSectionProps = {
  keys: ApiKeys;
  onRoll: () => void;
  isRolling: boolean;
};

type KeyType = {
  prefix: string;
  access: string;
  usage: string;
};

const KEY_TYPES: readonly KeyType[] = [
  {
    prefix: "echo_pk_",
    access: "Read-only",
    usage: "Safe to expose in client-side code. Used to authenticate GET requests.",
  },
  {
    prefix: "echo_sk_",
    access: "Read & write",
    usage: "Server-side only, never expose it. Required to authenticate POST requests.",
  },
];

export const AuthSection = ({
  keys,
  onRoll,
  isRolling,
}: AuthSectionProps): React.ReactElement => (
  <div className="space-y-5">
    <div>
      <h2 className="text-lg font-semibold tracking-tight">Authentication</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        Authenticate every request with an{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground">
          Authorization: Bearer &lt;key&gt;
        </code>{" "}
        header. Echo issues two key types — using the wrong one for an operation returns a
        403.
      </p>
    </div>

    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-left">
            <th className="px-4 py-2.5 font-medium text-muted-foreground">Key</th>
            <th className="px-4 py-2.5 font-medium text-muted-foreground">Access</th>
            <th className="px-4 py-2.5 font-medium text-muted-foreground">Usage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {KEY_TYPES.map((type) => (
            <tr key={type.prefix}>
              <td className="px-4 py-2.5 font-mono text-xs">{type.prefix}…</td>
              <td className="px-4 py-2.5 text-muted-foreground">{type.access}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{type.usage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <KeysSection keys={keys} onRoll={onRoll} isRolling={isRolling} />
  </div>
);
