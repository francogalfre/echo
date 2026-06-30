export type DigestInput = {
  content: string;
  sentiment?: string | null;
  tags?: string[] | null;
};

export type DigestTheme = {
  title: string;
  count: number;
  insight: string;
};

export type DigestOutput = {
  executiveSummary: string;
  themes: DigestTheme[];
  topIssues: string[];
  positiveHighlight: string;
};
