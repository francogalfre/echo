import type { Metadata } from "next";

import { AuthDivider } from "../components/auth-divider";
import { AuthLayout } from "../components/auth-layout";
import { RegisterForm } from "../components/register-form";
import { SocialButtons } from "../components/social-buttons";

export const metadata: Metadata = {
  title: "Sign up · echo",
};

const RegisterPage = () => {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start collecting feedback in minutes"
      footerLabel="Already have an account?"
      footerLinkLabel="Log in"
      footerHref="/login"
    >
      <SocialButtons />
      <AuthDivider />
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
