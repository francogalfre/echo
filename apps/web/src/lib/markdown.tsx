import { cn } from "@echo/ui/lib/utils";

export type MarkdownBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export function parseBlocks(text: string): MarkdownBlock[] {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const blocks: MarkdownBlock[] = [];
  for (const line of lines) {
    const isListItem = line.startsWith("- ") || line.startsWith("* ");
    const last = blocks.at(-1);
    if (isListItem && last?.type === "list") {
      last.items.push(line.slice(2).trim());
    } else if (isListItem) {
      blocks.push({ type: "list", items: [line.slice(2).trim()] });
    } else {
      blocks.push({ type: "paragraph", text: line });
    }
  }
  return blocks;
}

function renderInline(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(/\*\*[^*]+\*\*|`[^`]+`/g)) {
    const start = match.index;
    if (start > cursor) nodes.push(text.slice(cursor, start));

    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={`${token}-${start}`}>{token.slice(2, -2)}</strong>);
    } else {
      nodes.push(
        <code key={`${token}-${start}`} className="rounded bg-muted px-1 py-0.5 text-xs">
          {token.slice(1, -1)}
        </code>,
      );
    }
    cursor = start + token.length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));

  return nodes;
}

type MarkdownProps = {
  readonly text: string;
  readonly className?: string;
};

export function Markdown({ text, className }: MarkdownProps): React.ReactElement {
  const blocks = parseBlocks(text);

  return (
    <div className={cn("flex flex-col gap-2 text-sm leading-relaxed", className)}>
      {blocks.map((block) =>
        block.type === "list" ? (
          <ul key={block.items.join("|")} className="list-disc space-y-1 pl-4">
            {block.items.map((item) => (
              <li key={item}>{renderInline(item)}</li>
            ))}
          </ul>
        ) : (
          <p key={block.text}>{renderInline(block.text)}</p>
        ),
      )}
    </div>
  );
}
