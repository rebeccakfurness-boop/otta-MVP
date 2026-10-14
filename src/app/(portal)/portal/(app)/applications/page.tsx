import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CopyButton } from "@/components/applications/CopyButton";
import { getForm } from "@/content/forms";
import { ButtonLink, Card, CardHeader, EmptyState, LoadingBlocks, PageHeader, StatusBadge } from "@/components/portal/ui";
import { listApplications, listLinks } from "@/lib/applications/store";
import { requireBroker } from "@/lib/portal/auth";
import { portalPath } from "@/lib/portal/config";
import { formatDate } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Applications" };

export default function ApplicationsPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={6} />}>
      <Applications />
    </Suspense>
  );
}

async function Applications() {
  const broker = await requireBroker();
  const [apps, links] = await Promise.all([listApplications(broker.brokerageId), listLinks(broker.brokerageId)]);
  const now = new Date().getTime();
  const linkStatus = (l: (typeof links)[number]) =>
    l.completedAt ? "Completed by client" : new Date(l.expiresAt).getTime() < now ? "Link expired" : "Waiting for client";

  return (
    <>
      <PageHeader
        title="Applications"
        description="Online applications sent to Otta (building insurance and corporate travel), whether you filled them in or your client did from a link you sent."
        actions={
          <>
            <ButtonLink href={portalPath("/applications/send")} variant="secondary" icon="send">
              Send to a client
            </ButtonLink>
            <ButtonLink href={portalPath("/forms")} icon="plus">
              Fill in online
            </ButtonLink>
          </>
        }
      />

      <div className="space-y-8">
        <Card>
          <CardHeader title="Sent to Otta" />
          {apps.length === 0 ? (
            <EmptyState title="No applications yet">
              Fill in an application online, or send your client a link and it will appear here when they finish.
            </EmptyState>
          ) : (
            <ul className="divide-y divide-[#f0f0f0]">
              {apps.map((a) => (
                <li key={a.id}>
                  <Link href={portalPath(`/applications/${a.id}`)} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4 hover:bg-footer">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-charcoal">{a.insuredName}</p>
                      <p className="truncate text-[13px] text-body">
                        {getForm(a.form)?.shortTitle} · {a.propertyAddress ? `${a.propertyAddress} · ` : ""}{a.reference}
                      </p>
                    </div>
                    <span className="text-[13px] text-body">
                      {a.source === "client" ? `Completed by ${a.submittedBy}` : `Sent by ${a.submittedBy}`} · {formatDate(a.createdAt)}
                    </span>
                    <StatusBadge status={a.source === "client" ? "Completed by client" : "Sent to Otta"} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Links sent to clients"
            action={
              <Link href={portalPath("/applications/send")} className="text-[12px] font-medium tracking-[0.1em] text-site-teal uppercase hover:underline">
                New link
              </Link>
            }
          />
          {links.length === 0 ? (
            <EmptyState title="No links sent yet">Send a client a link to fill in the application themselves.</EmptyState>
          ) : (
            <ul className="divide-y divide-[#f0f0f0]">
              {links.map((l) => (
                <li key={l.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-charcoal">{l.clientName}</p>
                    <p className="text-[13px] text-body">
                      {getForm(l.form)?.shortTitle} · {l.clientEmail ? `${l.clientEmail} · ` : ""}Sent {formatDate(l.createdAt)} by {l.brokerName}
                    </p>
                  </div>
                  <StatusBadge status={linkStatus(l)} />
                  {l.applicationId ? (
                    <Link href={portalPath(`/applications/${l.applicationId}`)} className="text-[12px] font-medium tracking-[0.1em] text-site-teal uppercase hover:underline">
                      View
                    </Link>
                  ) : (
                    l.url && linkStatus(l) === "Waiting for client" && <CopyButton text={l.url} label="Copy link" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
