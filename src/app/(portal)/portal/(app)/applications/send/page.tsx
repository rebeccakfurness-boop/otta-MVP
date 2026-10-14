import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { getForm, onlineForms } from "@/content/forms";
import { LINK_DAYS } from "@/lib/applications/client-link";
import { requireBroker } from "@/lib/portal/auth";
import { portalPath } from "@/lib/portal/config";
import { SendLinkForm } from "./SendLinkForm";

export const metadata: Metadata = { title: "Send to a client" };

export default function SendPage(props: PageProps<"/portal/applications/send">) {
  return (
    <Suspense fallback={<LoadingBlocks rows={4} />}>
      <Send searchParams={props.searchParams} />
    </Suspense>
  );
}

async function Send({ searchParams }: { searchParams: PageProps<"/portal/applications/send">["searchParams"] }) {
  await requireBroker();
  const requested = (await searchParams).form;
  const selected = getForm(typeof requested === "string" ? requested : undefined)?.id ?? onlineForms[0].id;
  return (
    <>
      <PageHeader
        back={{ href: portalPath("/applications"), label: "Applications" }}
        title="Send a form to a client"
        description={`Create a secure link to the form on the Otta website, then send it to your client yourself. When they submit it, it goes straight to Otta and appears in your Applications, and we let you know. Links work for ${LINK_DAYS} days.`}
      />
      <SendLinkForm
        applicationsUrl={portalPath("/applications")}
        forms={onlineForms.map((f) => ({ id: f.id, title: f.title, summary: f.summary }))}
        selected={selected}
      />
    </>
  );
}
