import type { Metadata } from "next";
import { Suspense } from "react";
import { Alert } from "@/components/auth/FormBits";
import { PasswordForm } from "@/components/auth/PasswordForm";
import { SignInPage } from "@/components/auth/SignInPage";
import { onboarding } from "@/content/onboarding";
import { site } from "@/content/site";
import { findUserById } from "@/lib/portal/accounts";
import { PORTAL_HOST, portalPath } from "@/lib/portal/config";
import { findBrokerage } from "@/lib/portal/data";
import { readSignInLink } from "@/lib/portal/sign-in-links";
import { completeWelcome } from "./actions";

export const metadata: Metadata = { title: "Welcome to Otta" };

// Where a newly approved broker lands from their invite email.
export default function WelcomePage({ searchParams }: PageProps<"/portal/welcome">) {
  return (
    <SignInPage
      label="Broker Portal"
      title={onboarding.welcome.title}
      headline="Your Otta Broker Portal account is ready."
      intro="Set a password and you're in. From there you can complete proposal forms, send clients a link, and track your quotes and policies."
      benefits={["Proposal forms online, sent straight to Otta", "Your brokerage's quotes, policies and renewals", "Policy wordings and documents"]}
      access={
        <>
          Questions? Email{" "}
          <a href={`mailto:${site.email}`} className="text-white underline">
            {site.email}
          </a>
        </>
      }
      websiteUrl={PORTAL_HOST ? site.url : "/"}
      form={
        <Suspense fallback={<div className="mt-8 h-64 animate-pulse bg-[#f5f5f5]" />}>
          <Welcome searchParams={searchParams} />
        </Suspense>
      }
    />
  );
}

async function Welcome({ searchParams }: Pick<PageProps<"/portal/welcome">, "searchParams">) {
  const token = String((await searchParams).token ?? "");
  const link = await readSignInLink(token, "invite");
  const user = link && (await findUserById(link.userId));
  const brokerage = user && (await findBrokerage(user.brokerageId));
  if (!user || !brokerage) {
    return (
      <div className="mt-8 space-y-6">
        <Alert>{onboarding.welcome.expired}</Alert>
        <a href={portalPath("/login/link")} className="inline-block text-[14px] font-medium text-[#2e7d74] hover:underline">
          Email me a sign-in link
        </a>
      </div>
    );
  }
  return (
    <div className="mt-6 space-y-6">
      <p className="text-[15px] leading-relaxed text-body">{onboarding.welcome.intro(user.name, brokerage.name)}</p>
      <p className="text-[14px] text-body">
        Your sign-in email is <strong className="font-semibold text-charcoal">{user.email}</strong>.
      </p>
      <PasswordForm action={completeWelcome} hidden={{ token }} submitLabel="Set password and continue" doneHref={portalPath("/")} />
      <p className="text-[13px] leading-relaxed text-body">{onboarding.welcome.sso}</p>
    </div>
  );
}
