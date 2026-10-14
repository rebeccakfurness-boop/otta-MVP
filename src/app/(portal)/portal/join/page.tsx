import type { Metadata } from "next";
import { SignInPage } from "@/components/auth/SignInPage";
import { onboarding } from "@/content/onboarding";
import { site } from "@/content/site";
import { PORTAL_HOST, portalPath } from "@/lib/portal/config";
import { JoinForm } from "./JoinForm";

export const metadata: Metadata = { title: "Request access" };

export default function JoinPage() {
  return (
    <SignInPage
      label="Broker Portal"
      title={onboarding.join.title}
      headline="Join the Otta Broker Portal."
      intro={onboarding.join.intro}
      benefits={["Complete and send proposal forms online", "Send clients a link to fill in a form", "Track quote requests, policies and renewals"]}
      access={
        <>
          Questions? Email{" "}
          <a href={`mailto:${site.email}`} className="text-white underline">
            {site.email}
          </a>
        </>
      }
      websiteUrl={PORTAL_HOST ? site.url : "/"}
      form={<JoinForm loginHref={portalPath("/login")} linkHref={portalPath("/login/link")} />}
    />
  );
}
