"use client";

import { Button } from "@echo/ui/components/button";
import { cn } from "@echo/ui/lib/utils";
import { IconLoader2 } from "@tabler/icons-react";
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
            lastMethod === id && "border-foreground/30 bg-muted/40 hover:bg-muted",
          )}
        >
          {pending === id ? (
            <IconLoader2 className="size-4 animate-spin" />
          ) : (
            <Icon className="size-4" />
          )}
          Continue with {label}
          {lastMethod === id ? (
            <span className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              Last used
            </span>
          ) : null}
        </Button>
      ))}
    </div>
  );
};
