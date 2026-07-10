type DocsPageHeaderProps = {
  title: string;
  description: string;
};

export const DocsPageHeader = ({
  title,
  description,
}: DocsPageHeaderProps): React.ReactElement => (
  <div>
    <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
    <p className="mt-3 text-muted-foreground">{description}</p>
  </div>
);
