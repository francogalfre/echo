import type { Route } from "next";
import Link from "next/link";

import { createMetadata } from "@/utils/metadata";

import { AuthDivider } from "../components/auth-divider";
import { RegisterForm } from "../components/register-form";
import { SocialButtons } from "../components/social-buttons";

export const metadata = createMetadata({
  title: "Sign up",
  description: "Create your Echo account and start collecting feedback in minutes.",
  path: "/register",
  noIndex: true,
});

type RegisterPageProps = {
  searchParams: Promise<{ callbackURL?: string }>;
};

function loginHref(callbackURL: string | undefined): string {
  if (!callbackURL) return "/login";
  return `/login?callbackURL=${encodeURIComponent(callbackURL)}`;
}

const RegisterPage = async ({
  searchParams,
}: RegisterPageProps): Promise<React.ReactElement> => {
  const { callbackURL } = await searchParams;

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Start collecting feedback in minutes
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <SocialButtons callbackURL={callbackURL} />
        <AuthDivider />
        <RegisterForm callbackURL={callbackURL} />
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={loginHref(callbackURL) as Route}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </>
  );
};

export default RegisterPage;
