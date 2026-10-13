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
import { propertyLocation } from "@/lib/uw/worksheet";

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
          <>
            <ButtonLink href={adminPath(`/applications/${app.id}/worksheet`)} variant="secondary" icon="download" external>
              UW worksheet (Excel)
            </ButtonLink>
            <ButtonLink href={adminPath(`/applications/${app.id}/pdf`)} icon="download" external>
              Download PDF
            </ButtonLink>
          </>
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
      <FloodMaps address={app.propertyAddress} location={propertyLocation(app.answers)} />
      <ApplicationSummary answers={app.answers} />
    </>
  );
}

function FloodMaps({ address, location }: { address: string; location: ReturnType<typeof propertyLocation> }) {
  const links = [
    { label: "Complete flood map (national)", map: location.flood.national },
    { label: `${location.region || "Regional"} flood map`, map: location.flood.regional },
  ];
  return (
    <Card className="mb-8">
      <div className="border-b border-[#eaeaea] px-6 py-4">
        <h2 className="font-heading text-[18px] font-semibold tracking-normal text-charcoal">Flood mapping</h2>
        <p className="mt-1 text-[13px] text-body">
          {address}
          {location.region ? `, ${location.region} region` : ""}
        </p>
      </div>
      <ul className="divide-y divide-[#f0f0f0]">
        {links.map((l) => (
          <li key={l.label} className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
            <span>
              <span className="block text-[11px] font-semibold tracking-[0.1em] text-body uppercase">{l.label}</span>
              <span className="text-[14px] text-charcoal">{l.map.name}</span>
            </span>
            <a href={l.map.url} target="_blank" rel="noreferrer" className="text-[12px] font-medium tracking-[0.1em] text-[#2e7d74] uppercase hover:underline">
              Open map
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}
