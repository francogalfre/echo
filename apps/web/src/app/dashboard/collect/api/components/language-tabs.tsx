import { CodeBlock } from "@echo/ui/components/code-block";

export type LanguageSnippet = {
  label: string;
  code: string;
  language: string;
};

type LanguageTabsProps = {
  snippets: LanguageSnippet[];
};

export const LanguageTabs = ({ snippets }: LanguageTabsProps): React.ReactElement => (
  <CodeBlock tabs={snippets} />
);
