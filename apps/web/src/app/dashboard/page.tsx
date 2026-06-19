"use client";

import { Button } from "@echo/ui/components/button";
import { IconLayoutDashboard, IconLoader2, IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { authClient, signOut, useSession } from "@/lib/auth-client";

const DashboardPage = () => {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const { data: organizations, isPending: organizationsPending } =
    authClient.useListOrganizations();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  useEffect(() => {
    if (!sessionPending && !session) {
      router.replace("/login");
    }
  }, [sessionPending, session, router]);

  useEffect(() => {
    if (!organizationsPending && organizations && organizations.length === 0) {
      router.replace("/onboarding");
    }
  }, [organizationsPending, organizations, router]);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  const isLoading =
    sessionPending ||
    !session ||
    organizationsPending ||
    (organizations?.length ?? 0) === 0;

  if (isLoading) {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col px-4 py-8">
      <header className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          {activeOrganization?.logo ? (
            <img
              src={activeOrganization.logo}
              alt=""
              className="size-7 rounded-md object-cover"
            />
          ) : (
            <span className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <IconLayoutDashboard className="size-4" />
            </span>
          )}
          <span className="font-display text-lg font-semibold tracking-tight">
            {activeOrganization?.name ?? "Dashboard"}
          </span>
        </div>
        <Button variant="outline" className="h-9 gap-2 text-sm" onClick={handleSignOut}>
          <IconLogout className="size-4" />
          Sign out
        </Button>
      </header>
      <section className="mt-8">
        <h1 className="text-2xl font-semibold">Welcome, {session.user.name}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{session.user.email}</p>
      </section>
    </main>
  );
};

export default DashboardPage;
