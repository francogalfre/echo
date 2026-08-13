import { Icons } from "@echo/ui/components/icons";

const sidebarLinks = [
  { label: "Overview", icon: "home", active: true },
  { label: "Feedback", icon: "message", active: false },
  { label: "Board", icon: "board", active: false },
  { label: "Collect", icon: "radar", active: false },
  { label: "Settings", icon: "settings", active: false },
] as const;

const metrics = [
  { label: "Feedback", value: "1,284", delta: "+12.4%", direction: "up" },
  { label: "Avg. rating", value: "4.3", delta: "+0.2", direction: "up" },
  { label: "Negative", value: "9%", delta: "-2.1%", direction: "down" },
] as const;

const curve =
  "M0 132C30 132 46 118 69 120C92 122 108 100 138 104C168 108 180 86 207 92C234 98 250 74 277 78C304 82 315 62 346 66C377 70 388 48 415 52C442 56 455 36 484 40C513 44 528 26 554 28C574 29 588 22 600 20";

const entries = [
  {
    author: "Marta Ruiz",
    content: "The widget took two minutes to install. Ratings are already coming in.",
    sentiment: "Positive",
    tone: "green",
    source: "widget",
    time: "2m",
  },
  {
    author: "Dev Patel",
    content: "Export to CSV would help — I need this in our weekly report.",
    sentiment: "Neutral",
    tone: "slate",
    source: "api",
    time: "18m",
  },
  {
    author: "Anon",
    content: "Billing page threw an error when I switched plans mid-cycle.",
    sentiment: "Negative",
    tone: "rose",
    source: "form",
    time: "1h",
  },
  {
    author: "Lea Fischer",
    content: "The weekly summary is the only report my team actually reads.",
    sentiment: "Positive",
    tone: "green",
    source: "widget",
    time: "3h",
  },
] as const;

const toneClass = {
  green: "bg-pastel-green-bg text-pastel-green-text",
  slate: "bg-pastel-slate-bg text-pastel-slate-text",
  rose: "bg-pastel-rose-bg text-pastel-rose-text",
} as const;

export const DashboardMock = (): React.ReactElement => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex">
        <aside className="hidden w-52 shrink-0 flex-col border-r border-border bg-sidebar p-3 md:flex">
          <div className="flex items-center gap-2 px-2 py-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Icons.radar className="size-3.5" />
            </span>
            <span className="text-sm font-semibold tracking-tight">Echo</span>
          </div>

          <div className="mt-4 space-y-0.5">
            {sidebarLinks.map((link) => {
              const Icon = Icons[link.icon];

              return (
                <div
                  key={link.label}
                  className={
                    link.active
                      ? "flex items-center gap-2.5 rounded-lg bg-secondary px-2.5 py-2 text-xs font-medium text-foreground"
                      : "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-muted-foreground"
                  }
                >
                  <Icon className="size-3.5" />
                  {link.label}
                </div>
              );
            })}
          </div>

          <div className="mt-auto flex items-center gap-2 rounded-lg border border-border px-2.5 py-2">
            <span className="size-5 rounded-md bg-accent/15" />
            <span className="text-xs text-muted-foreground">Acme App</span>
            <Icons.chevronDown className="ml-auto size-3 text-muted-foreground" />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex h-12 items-center justify-between border-b border-border px-4">
            <p className="text-sm font-medium tracking-tight">Overview</p>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-[11px] text-muted-foreground sm:flex">
                <Icons.search className="size-3" />
                Search
              </span>
              <span className="size-6 rounded-full bg-accent/20" />
            </div>
          </div>

          <div className="space-y-3 p-4">
            <div className="grid grid-cols-3 gap-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-border p-3">
                  <p className="text-[11px] text-muted-foreground">{metric.label}</p>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <span className="font-display text-xl font-semibold tracking-tight">
                      {metric.value}
                    </span>
                    <span
                      className={
                        metric.direction === "up"
                          ? "text-[11px] text-success"
                          : "text-[11px] text-muted-foreground"
                      }
                    >
                      {metric.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium">Feedback over time</p>
                <span className="rounded-md bg-secondary px-2 py-1 text-[10px] text-muted-foreground">
                  30 days
                </span>
              </div>
              <svg
                viewBox="0 0 600 160"
                preserveAspectRatio="none"
                className="mt-3 h-24 w-full sm:h-28"
                role="presentation"
              >
                <defs>
                  <linearGradient id="echo-mock-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${curve}L600 160L0 160Z`} fill="url(#echo-mock-area)" />
                <path
                  d={curve}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            <div className="overflow-hidden rounded-xl border border-border">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <p className="text-xs font-medium">Recent feedback</p>
                <span className="text-[11px] text-muted-foreground">View all</span>
              </div>
              <div className="divide-y divide-border">
                {entries.map((entry) => (
                  <div key={entry.author} className="flex items-center gap-3 px-3 py-2.5">
                    <span className="hidden size-6 shrink-0 rounded-full bg-secondary sm:block" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{entry.author}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {entry.content}
                      </p>
                    </div>
                    <span
                      className={`hidden shrink-0 rounded-md px-2 py-0.5 text-[10px] font-medium sm:block ${toneClass[entry.tone]}`}
                    >
                      {entry.sentiment}
                    </span>
                    <span className="hidden shrink-0 font-mono text-[10px] text-muted-foreground md:block">
                      {entry.source}
                    </span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {entry.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
