import type { Metadata } from "next";
import { SignInPage } from "@/components/auth/SignInPage";
import { site } from "@/content/site";
import { ADMIN_HOST } from "@/lib/admin/config";
import { demoMode } from "@/lib/auth/sealed-session";
import { AdminLoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  return (
    <SignInPage
      label="Otta Admin"
      headline="The whole book, at a glance."
      intro="Otta staff only. Sign in with your Otta Microsoft or Google account, or your admin email and password."
      benefits={[
        "Every policy and quote across all brokers",
        "Search any broker and see their view",
        "Filter by product, status and source",
        "Manual entry and InsuredHQ in one place",
      ]}
      access={<>Staff access is managed by Otta operations.</>}
      demo={demoMode ? { email: "admin@ottainsurance.co.nz", password: "OttaAdmin2026!" } : undefined}
      websiteUrl={ADMIN_HOST ? site.url : "/"}
      form={<AdminLoginForm />}
    />
  );
}
