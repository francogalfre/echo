"use client";

import { Button } from "@echo/ui/components/button";
import { Icons } from "@echo/ui/components/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";

type InvitationContext = {
  organizationName: string;
  inviterEmail: string;
};

type ViewState =
  | { status: "loading" }
  | { status: "ready"; context: InvitationContext }
  | { status: "unauthenticated" }
  | { status: "error"; message: string };

type AcceptInvitationCardProps = {
  invitationId: string;
};

export function AcceptInvitationCard({
  invitationId,
}: AcceptInvitationCardProps): React.ReactElement {
  const router = useRouter();
  const [state, setState] = useState<ViewState>({ status: "loading" });
  const [isResponding, setIsResponding] = useState(false);

  useEffect(() => {
    let cancelled = false;

    authClient.organization
      .getInvitation({ query: { id: invitationId } })
      .then(({ data, error }) => {
        if (cancelled) return;

        if (error) {
          if (error.status === 401) {
            setState({ status: "unauthenticated" });
            return;
          }
          setState({
            status: "error",
            message: error.message ?? "This invitation is no longer valid.",
          });
          return;
        }

        setState({
          status: "ready",
          context: {
            organizationName: data.organizationName,
            inviterEmail: data.inviterEmail,
          },
        });
      });

    return () => {
      cancelled = true;
    };
  }, [invitationId]);

  useEffect(() => {
    if (state.status === "unauthenticated") {
      router.replace("/login");
    }
  }, [state.status, router]);

  const acceptInvitation = async (): Promise<void> => {
    setIsResponding(true);
    const { error } = await authClient.organization.acceptInvitation({
      invitationId,
    });

    if (error) {
      setIsResponding(false);
      setState({
        status: "error",
        message: error.message ?? "Could not accept the invitation.",
      });
      return;
    }

    router.replace("/dashboard");
  };

  const declineInvitation = async (): Promise<void> => {
    setIsResponding(true);
    await authClient.organization.rejectInvitation({ invitationId });
    router.replace("/");
  };

  if (state.status === "loading" || state.status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border bg-card p-10">
        <Icons.loading className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Icons.cancelCircle className="size-5" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">{state.message}</p>
        <Button
          className="mt-6 w-full"
          variant="outline"
          onClick={() => router.replace("/")}
        >
          Go to homepage
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 text-center">
      <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Icons.mail className="size-5" />
      </div>
      <p className="mt-4 text-sm text-foreground">
        <span className="font-medium">{state.context.inviterEmail}</span> invited you to
        join <span className="font-medium">{state.context.organizationName}</span> on Echo.
      </p>

      <div className="mt-6 flex flex-col gap-2">
        <Button onClick={acceptInvitation} disabled={isResponding} className="w-full">
          {isResponding ? (
            <Icons.loading className="size-4 animate-spin" />
          ) : (
            "Accept invitation"
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={declineInvitation}
          disabled={isResponding}
          className="w-full"
        >
          Decline
        </Button>
      </div>
    </div>
  );
}
