type SectionHeadingProps = {
  title: string;
  description: string;
};

export const SectionHeading = ({
  title,
  description,
}: SectionHeadingProps): React.ReactElement => (
  <div className="mb-5">
    <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
    <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
  </div>
);
