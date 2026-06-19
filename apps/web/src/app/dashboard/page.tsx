"use client";

import { Button } from "@echo/ui/components/button";
import { IconLayoutDashboard, IconLoader2, IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { signOut, useSession } from "@/lib/auth-client";

const DashboardPage = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  if (isPending || !session) {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col px-4 py-8">
      <header className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <IconLayoutDashboard className="size-5 text-primary" />
          <span className="font-display text-lg font-semibold tracking-tight">
            Dashboard
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
