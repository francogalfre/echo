import type { Metadata } from "next";
import Link from "next/link";

import { AuthDivider } from "../components/auth-divider";
import { RegisterForm } from "../components/register-form";
import { SocialButtons } from "../components/social-buttons";

export const metadata: Metadata = {
  title: "Sign up · echo",
};

const RegisterPage = () => {
  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Start collecting feedback in minutes
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <SocialButtons />
        <AuthDivider />
        <RegisterForm />
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </>
  );
};

export default RegisterPage;
