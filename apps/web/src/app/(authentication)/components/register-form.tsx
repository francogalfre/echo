"use client";

import { Button } from "@echo/ui/components/button";
import { Input } from "@echo/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signUp } from "@/lib/auth-client";

import { Field } from "./field";
import { registerSchema, type RegisterValues } from "./schemas";

export const RegisterForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit(async (values) => {
    await signUp.email(values, {
      onSuccess: () => router.push("/dashboard"),
      onError: ({ error }) => {
        toast.error(error.message);
      },
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <Field name="name" label="Name" error={errors.name?.message}>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Ada Lovelace"
          {...register("name")}
        />
      </Field>
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          {...register("password")}
        />
      </Field>
      <Button type="submit" disabled={isSubmitting} className="h-10 w-full text-sm">
        {isSubmitting ? <IconLoader2 className="size-4 animate-spin" /> : "Create account"}
      </Button>
    </form>
  );
};
