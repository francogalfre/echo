import type { Route } from "next";
import Link from "next/link";

import { createMetadata } from "@/utils/metadata";

import { AuthDivider } from "../components/auth-divider";
import { LoginForm } from "../components/login-form";
import { SocialButtons } from "../components/social-buttons";

export const metadata = createMetadata({
  title: "Log in",
  description: "Log in to your Echo account.",
  path: "/login",
  noIndex: true,
});

type LoginPageProps = {
  searchParams: Promise<{ callbackURL?: string }>;
};

function registerHref(callbackURL: string | undefined): string {
  if (!callbackURL) return "/register";
  return `/register?callbackURL=${encodeURIComponent(callbackURL)}`;
}

const LoginPage = async ({ searchParams }: LoginPageProps): Promise<React.ReactElement> => {
  const { callbackURL } = await searchParams;

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Log in to your echo account</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <SocialButtons callbackURL={callbackURL} />
        <AuthDivider />
        <LoginForm callbackURL={callbackURL} />
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        No account yet?{" "}
        <Link
          href={registerHref(callbackURL) as Route}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </>
  );
};

export default LoginPage;
