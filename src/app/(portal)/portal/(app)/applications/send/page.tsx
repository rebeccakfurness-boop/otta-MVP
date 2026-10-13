import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { LINK_DAYS } from "@/lib/applications/client-link";
import { requireBroker } from "@/lib/portal/auth";
import { portalPath } from "@/lib/portal/config";
import { SendLinkForm } from "./SendLinkForm";

export const metadata: Metadata = { title: "Send to a client" };

export default function SendPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={4} />}>
      <Send />
    </Suspense>
  );
}

async function Send() {
  await requireBroker();
  return (
    <>
      <PageHeader
        back={{ href: portalPath("/applications"), label: "Applications" }}
        title="Send the application to a client"
        description={`Your client gets a secure link to the building insurance application on the Otta website. When they submit it, it goes straight to Otta and appears in your Applications, and we let you know. Links work for ${LINK_DAYS} days.`}
      />
      <SendLinkForm applicationsUrl={portalPath("/applications")} />
    </>
  );
}
