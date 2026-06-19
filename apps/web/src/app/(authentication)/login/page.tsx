import type { Metadata } from "next";

import { AuthDivider } from "../components/auth-divider";
import { AuthLayout } from "../components/auth-layout";
import { LoginForm } from "../components/login-form";
import { SocialButtons } from "../components/social-buttons";

export const metadata: Metadata = {
  title: "Log in · echo",
};

const LoginPage = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your echo account"
      footerLabel="No account yet?"
      footerLinkLabel="Sign up"
      footerHref="/register"
    >
      <SocialButtons />
      <AuthDivider />
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
