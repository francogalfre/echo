import imagotipo from "@echo/assets/imagotipo/accent.png";
import Image from "next/image";

import { createMetadata } from "@/lib/metadata";

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

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(ellipse_55%_60%_at_50%_-10%,oklch(0.567_0.202_282.7/0.16),transparent_70%)]"
      />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Image src={imagotipo} alt="echo" priority className="h-7 w-auto" />
        </div>
        <AcceptInvitationCard invitationId={id} />
      </div>
    </main>
  );
};

export default AcceptInvitationPage;
