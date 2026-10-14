import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ApplicationSummary } from "@/components/applications/ApplicationSummary";
import { getForm } from "@/content/forms";
import { applicationStatus } from "@/lib/applications/labels";
import { ButtonLink, Card, DetailList, LoadingBlocks, PageHeader, StatusBadge } from "@/components/portal/ui";
import { getApplication } from "@/lib/applications/store";
import { requireBroker } from "@/lib/portal/auth";
import { portalPath } from "@/lib/portal/config";
import { formatDate } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Application" };

export default function ApplicationPage(props: PageProps<"/portal/applications/[id]">) {
  return (
    <Suspense fallback={<LoadingBlocks rows={8} />}>
      <ApplicationDetail params={props.params} />
    </Suspense>
  );
}

async function ApplicationDetail({ params }: { params: PageProps<"/portal/applications/[id]">["params"] }) {
  const { id } = await params;
  const broker = await requireBroker();
  const app = await getApplication(id, broker.brokerageId);
  const form = getForm(app?.form);
  if (!app || !form) notFound();
  return (
    <>
      <PageHeader
        back={{ href: portalPath("/applications"), label: "Applications" }}
        title={app.insuredName}
        description={app.propertyAddress}
        actions={
          <ButtonLink href={portalPath(`/applications/${app.id}/pdf`)} icon="download" external>
            Download PDF
          </ButtonLink>
        }
      />
      <Card className="mb-8">
        <DetailList
          items={[
            { label: "Form", value: form.shortTitle },
            { label: "Reference", value: app.reference },
            { label: "Status", value: <StatusBadge status={applicationStatus(app)} /> },
            { label: app.source === "client" ? "Completed by" : "Sent by", value: `${app.submittedBy} (${app.submittedByEmail})` },
            { label: "Date", value: formatDate(app.createdAt) },
            { label: "Broker", value: app.brokerName },
            { label: "Inception date", value: app.answers.inceptionDate ? formatDate(app.answers.inceptionDate) : "" },
          ]}
        />
      </Card>
      <ApplicationSummary form={form} answers={app.answers} />
    </>
  );
}
