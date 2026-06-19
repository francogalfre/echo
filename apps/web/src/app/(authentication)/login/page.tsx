import type { Metadata } from "next";
import Link from "next/link";

import { AuthDivider } from "../components/auth-divider";
import { LoginForm } from "../components/login-form";
import { SocialButtons } from "../components/social-buttons";

export const metadata: Metadata = {
  title: "Log in · echo",
};

const LoginPage = () => {
  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Log in to your echo account</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <SocialButtons />
        <AuthDivider />
        <LoginForm />
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        No account yet?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </>
  );
};

export default LoginPage;
