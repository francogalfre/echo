"use client";

import { Button } from "@echo/ui/components/button";
import { Input } from "@echo/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@echo/ui/components/icons";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Field } from "@echo/ui/components/field";
import { signIn } from "@/lib/auth-client";
import { captureUserLoggedIn } from "@/lib/posthog";
import { isSafeRedirectPath } from "@/lib/safe-redirect";

import { loginSchema, type LoginValues } from "../schemas";

type LoginFormProps = {
  callbackURL?: string;
};

export const LoginForm = ({ callbackURL }: LoginFormProps) => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const destination = isSafeRedirectPath(callbackURL) ? callbackURL : "/dashboard";
    await signIn.email(values, {
      onSuccess: () => {
        captureUserLoggedIn({ method: "email" });
        router.push(destination as Route);
      },
      onError: ({ error }) => setServerError(error.message),
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <Field name="email" label="Email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          {...register("email")}
        />
      </Field>

      <Field name="password" label="Password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          {...register("password")}
        />
      </Field>

      {serverError ? <p className="text-xs text-destructive">{serverError}</p> : null}

      <Button type="submit" disabled={isSubmitting} className="h-10 w-full text-sm">
        {isSubmitting ? <Icons.loading className="size-4 animate-spin" /> : "Log in"}
      </Button>
    </form>
  );
};
