import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ApplicationSummary } from "@/components/applications/ApplicationSummary";
import { ButtonLink, Card, DetailList, LoadingBlocks, PageHeader, StatusBadge } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/config";
import { brokerageNames } from "@/lib/admin/data";
import { getApplication } from "@/lib/applications/store";
import { formatDate } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Application" };

export default function AdminApplicationPage(props: PageProps<"/admin/applications/[id]">) {
  return (
    <Suspense fallback={<LoadingBlocks rows={8} />}>
      <Detail params={props.params} />
    </Suspense>
  );
}

async function Detail({ params }: { params: PageProps<"/admin/applications/[id]">["params"] }) {
  const { id } = await params;
  await requireAdmin();
  const [app, names] = await Promise.all([getApplication(id), brokerageNames()]);
  if (!app) notFound();
  return (
    <>
      <PageHeader
        back={{ href: adminPath("/applications"), label: "Applications" }}
        title={app.insuredName}
        description={app.propertyAddress}
        actions={
          <ButtonLink href={adminPath(`/applications/${app.id}/pdf`)} icon="download" external>
            Download PDF
          </ButtonLink>
        }
      />
      <Card className="mb-8">
        <DetailList
          items={[
            { label: "Reference", value: app.reference },
            { label: "Status", value: <StatusBadge status={app.source === "client" ? "Completed by client" : "Sent to Otta"} /> },
            { label: "Brokerage", value: names[app.brokerageId] ?? app.brokerageId },
            { label: "Broker", value: `${app.brokerName} (${app.brokerEmail})` },
            { label: app.source === "client" ? "Completed by" : "Sent by", value: `${app.submittedBy} (${app.submittedByEmail})` },
            { label: "Date", value: formatDate(app.createdAt) },
          ]}
        />
      </Card>
      <ApplicationSummary answers={app.answers} />
    </>
  );
}
