"use client";

import { SignInForm } from "@/components/auth/SignInForm";
import { portalPath } from "@/lib/portal/config";
import { login } from "./actions";

export function LoginForm() {
  return (
    <SignInForm
      action={login}
      homeHref={portalPath("/")}
      ssoHref={(provider) => portalPath(`/auth/${provider}`)}
      forgotHref={portalPath("/login/link")}
    />
  );
}
