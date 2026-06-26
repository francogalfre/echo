import { PageContainer } from "../../components/page-container";

const ProjectsPage = (): React.ReactElement => (
  <PageContainer>
    <h1 className="text-2xl font-semibold">Projects</h1>
    <p className="mt-1.5 text-sm text-muted-foreground">
      Switch between projects or create a new one.
    </p>
  </PageContainer>
);

export default ProjectsPage;
