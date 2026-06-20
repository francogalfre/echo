"use client";

import { useSession } from "@/lib/auth-client";

const DashboardPage = (): React.ReactElement => {
  const { data: session } = useSession();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">
        Welcome{session?.user.name ? `, ${session.user.name}` : ""}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{session?.user.email}</p>
    </div>
  );
};

export default DashboardPage;
