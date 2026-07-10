import { PageContainer } from "../../components/page-container";
import { PageHeader } from "../../components/page-header";
import { NewProjectButton } from "./components/new-project-button";
import { ProjectsList } from "./components/projects-list";

const ProjectsPage = (): React.ReactElement => (
  <PageContainer>
    <PageHeader
      title="Projects"
      description="Switch between projects or create a new one."
      actions={<NewProjectButton />}
    />
    <ProjectsList />
  </PageContainer>
);

export default ProjectsPage;
