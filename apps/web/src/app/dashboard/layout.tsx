import { env } from "@echo/env/web";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";

import { AgentChatButton } from "./components/chat/agent-chat-button";
import { MotionProvider } from "./components/layout/motion-provider";
import { Sidebar } from "./components/sidebar";
import { UsageMeterData, UsageMeterSkeleton } from "./components/sidebar/usage-meter-data";
import { Topbar } from "./components/topbar";

type DashboardLayoutProps = {
  children: ReactNode;
};

type ServerSession = {
  session: { activeOrganizationId: string | null };
} | null;

async function fetchServerSession(): Promise<ServerSession> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const response = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/auth/get-session`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    if (!response.ok) return null;

    return (await response.json()) as ServerSession;
  } catch (error) {
    // Silent fail — user will be redirected to login
    void error;
    return null;
  }
}

const DashboardLayout = async ({
  children,
}: DashboardLayoutProps): Promise<React.ReactElement> => {
  const session = await fetchServerSession();

  if (!session) redirect("/login");
  if (!session.session.activeOrganizationId) redirect("/onboarding");

  return (
    <MotionProvider>
      <div className="flex h-svh">
        <Sidebar
          usageMeterSlot={
            <Suspense fallback={<UsageMeterSkeleton />}>
              <UsageMeterData />
            </Suspense>
          }
        />
        <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
          <Topbar
            usageMeterSlot={
              <Suspense fallback={<UsageMeterSkeleton />}>
                <UsageMeterData />
              </Suspense>
            }
          />
          <main className="flex-1 overflow-auto bg-background">{children}</main>
        </div>
      </div>
      <AgentChatButton />
    </MotionProvider>
  );
};

export default DashboardLayout;
