import type { Metadata } from "next";
import { SignInPage } from "@/components/auth/SignInPage";
import { site } from "@/content/site";
import { PORTAL_HOST } from "@/lib/portal/config";
import { demoMode } from "@/lib/portal/session";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <SignInPage
      label="Broker Portal"
      headline="Everything you place with Otta, in one place."
      intro="Use your brokerage's Microsoft or Google account, or your portal email and password."
      benefits={[
        "Track every quote request in one place",
        "See all policies bound with Otta",
        "Download policy documents any time",
        "Find every proposal, renewal and claim form",
      ]}
      access={
        <>
          Need access for your brokerage? Email{" "}
          <a href={`mailto:${site.email}`} className="text-white underline">
            {site.email}
          </a>
        </>
      }
      // Demo credentials are shown while the portal runs on demo data.
      demo={demoMode ? { email: "demo@harbourbrokers.co.nz", password: "OttaDemo2026!" } : undefined}
      websiteUrl={PORTAL_HOST ? site.url : "/"}
      form={<LoginForm />}
    />
  );
}
