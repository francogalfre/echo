import { createMetadata } from "@/utils/metadata";

import { AcceptInvitationCard } from "./components/accept-invitation-card";

export const metadata = createMetadata({
  title: "Accept invitation",
  noIndex: true,
});

type AcceptInvitationPageProps = {
  params: Promise<{ id: string }>;
};

const AcceptInvitationPage = async ({
  params,
}: AcceptInvitationPageProps): Promise<React.ReactElement> => {
  const { id } = await params;

  return <AcceptInvitationCard invitationId={id} />;
};

export default AcceptInvitationPage;
