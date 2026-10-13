"use client";

import { SignInForm } from "@/components/auth/SignInForm";
import { adminPath } from "@/lib/admin/config";
import { adminLogin } from "./actions";

export function AdminLoginForm() {
  return <SignInForm action={adminLogin} homeHref={adminPath("/")} ssoHref={(provider) => adminPath(`/auth/${provider}`)} />;
}
