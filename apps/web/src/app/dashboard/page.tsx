"use client";

import { useSession } from "@/lib/auth-client";

import { PageContainer } from "./components/page-container";

const DashboardPage = (): React.ReactElement => {
  const { data: session } = useSession();

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold">
        Welcome{session?.user.name ? `, ${session.user.name}` : ""}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{session?.user.email}</p>
    </PageContainer>
  );
};

export default DashboardPage;
