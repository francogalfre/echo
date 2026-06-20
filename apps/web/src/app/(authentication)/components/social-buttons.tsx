"use client";

import { Button } from "@echo/ui/components/button";
import { cn } from "@echo/ui/lib/utils";
import { Icons } from "@echo/ui/components/icons";
import { useEffect, useState } from "react";

import { authClient, signIn } from "@/lib/auth-client";

import { GitHubIcon, GoogleIcon } from "./brand-icons";

type Provider = "google" | "github";

const providers = [
  { id: "google", label: "Google", Icon: GoogleIcon },
  { id: "github", label: "GitHub", Icon: GitHubIcon },
] as const;

export const SocialButtons = () => {
  const [pending, setPending] = useState<Provider | null>(null);
  const [lastMethod, setLastMethod] = useState<string | null>(null);

  useEffect(() => {
    setLastMethod(authClient.getLastUsedLoginMethod());
  }, []);

  const continueWith = (provider: Provider) => {
    return async () => {
      setPending(provider);
      await signIn.social(
        { provider, callbackURL: `${window.location.origin}/dashboard` },
        { onError: () => setPending(null) },
      );
    };
  };

  return (
    <div className="grid gap-2">
      {providers.map(({ id, label, Icon }) => (
        <Button
          key={id}
          type="button"
          variant="outline"
          disabled={pending !== null}
          onClick={continueWith(id)}
          className={cn(
            "relative h-12 w-full justify-center gap-2 text-sm",
            lastMethod === id && "border-accent/40 bg-muted/50 hover:bg-muted",
          )}
        >
          {pending === id ? (
            <Icons.loading className="size-4 animate-spin" />
          ) : (
            <Icon className="size-4" />
          )}
          Continue with {label}
          {lastMethod === id ? (
            <span className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-accent/10 px-2 py-1 text-[10px] font-light text-accent">
              Last used
            </span>
          ) : null}
        </Button>
      ))}
    </div>
  );
};
