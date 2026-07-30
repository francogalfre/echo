import { Suspense, type ReactNode } from "react";

import { AgentChatButton } from "./components/chat/agent-chat-button";
import { MotionProvider } from "./components/layout/motion-provider";
import { Sidebar } from "./components/sidebar";
import { UsageMeterData, UsageMeterSkeleton } from "./components/sidebar/usage-meter-data";
import { Topbar } from "./components/topbar";

type Props = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: Props): React.ReactElement => {
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
        <div className="flex min-w-0 flex-1 flex-col pl-64">
          <Topbar />
          <main className="flex-1 overflow-auto bg-background">{children}</main>
        </div>
        <AgentChatButton />
      </div>
    </MotionProvider>
  );
};

export default DashboardLayout;
