import type { Metadata } from "next";
import { Suspense } from "react";
import { Alert } from "@/components/auth/FormBits";
import { PasswordForm } from "@/components/auth/PasswordForm";
import { Card, CardHeader, DetailList, LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { onboarding } from "@/content/onboarding";
import { requireBroker } from "@/lib/portal/auth";
import { changePassword } from "./actions";

export const metadata: Metadata = { title: "Your account" };

const signedInWith = { password: "Email and password", microsoft: "Microsoft", google: "Google", link: "Emailed sign-in link" };

export default function AccountPage({ searchParams }: PageProps<"/portal/account">) {
  return (
    <Suspense fallback={<LoadingBlocks rows={3} />}>
      <Account searchParams={searchParams} />
    </Suspense>
  );
}

async function Account({ searchParams }: Pick<PageProps<"/portal/account">, "searchParams">) {
  const broker = await requireBroker();
  const fromLink = broker.method === "link" || (await searchParams).signedInWithLink === "1";
  return (
    <>
      <PageHeader title="Your account" description="Your details and how you sign in to the Otta Broker Portal." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Your details" />
          <div className="pb-6">
            <DetailList
              items={[
                { label: "Name", value: broker.name },
                { label: "Email", value: broker.email },
                { label: "Brokerage", value: broker.brokerageName },
                { label: "Signed in with", value: signedInWith[broker.method] },
              ]}
            />
            <p className="px-6 text-[13px] text-body">To change your name or email, contact the Otta team.</p>
          </div>
        </Card>
        <Card>
          <CardHeader title={fromLink ? "Set a new password" : "Change your password"} />
          <div className="space-y-5 p-6">
            {fromLink && <Alert tone="success">{onboarding.account.resetPrompt}</Alert>}
            <PasswordForm action={changePassword} submitLabel="Save new password" doneMessage="Your new password is saved. Use it next time you sign in." />
          </div>
        </Card>
      </div>
    </>
  );
}

