import { cn } from "@echo/ui/lib/utils";

type Props = {
  insight: string;
};

type Block = { type: "paragraph"; text: string } | { type: "list"; items: string[] };

function parseBlocks(insight: string): Block[] {
  const lines = insight
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const blocks: Block[] = [];
  for (const line of lines) {
    const isListItem = line.startsWith("- ");
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

  for (const match of text.matchAll(/\*\*[^*]+\*\*/g)) {
    const start = match.index;
    if (start > cursor) nodes.push(text.slice(cursor, start));
    const bold = match[0].slice(2, -2);
    nodes.push(<strong key={`${bold}-${start}`}>{bold}</strong>);
    cursor = start + match[0].length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));

  return nodes;
}

export function InsightContent({ insight }: Props): React.ReactElement {
  const blocks = parseBlocks(insight);

  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed",
        "[&_strong]:font-semibold [&_strong]:text-foreground [&_p]:text-muted-foreground [&_li]:text-muted-foreground",
      )}
    >
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
