import { PageContainer } from "../../components/page-container";
import { PageHeader } from "../../components/page-header";
import { InviteMemberButton } from "./components/invite-member-button";
import { MembersList } from "./components/members-list";

const MembersPage = (): React.ReactElement => (
  <PageContainer>
    <PageHeader
      title="Members"
      description="Invite and manage your team members."
      actions={<InviteMemberButton />}
    />
    <MembersList />
  </PageContainer>
);

export default MembersPage;
