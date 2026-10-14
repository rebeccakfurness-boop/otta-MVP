import type { Metadata } from "next";
import { SignInPage } from "@/components/auth/SignInPage";
import { onboarding } from "@/content/onboarding";
import { site } from "@/content/site";
import { PORTAL_HOST, portalPath } from "@/lib/portal/config";
import { LinkForm } from "./LinkForm";

export const metadata: Metadata = { title: "Email me a sign-in link" };

export default function SignInLinkPage() {
  return (
    <SignInPage
      label="Broker Portal"
      title={onboarding.link.title}
      headline="Forgotten your password? No problem."
      intro={onboarding.link.intro}
      benefits={["No password needed", "The link works once, for 20 minutes", "Set a new password once you're in"]}
      access={
        <>
          Need access for your brokerage?{" "}
          <a href={portalPath("/join")} className="text-white underline">
            Request access
          </a>
        </>
      }
      websiteUrl={PORTAL_HOST ? site.url : "/"}
      form={<LinkForm loginHref={portalPath("/login")} />}
    />
  );
}
