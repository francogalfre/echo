import { PageContainer } from "../../components/page-container";

const MembersPage = (): React.ReactElement => (
  <PageContainer>
    <h1 className="text-2xl font-semibold">Members</h1>
    <p className="mt-1.5 text-sm text-muted-foreground">
      Invite and manage your team members.
    </p>
  </PageContainer>
);

export default MembersPage;
