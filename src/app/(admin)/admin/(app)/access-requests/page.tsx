import type { Metadata } from "next";
import { Suspense } from "react";
import { Card, CardHeader, EmptyState, LoadingBlocks, PageHeader, StatusBadge } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { allBrokerages, listAccessRequests } from "@/lib/portal/accounts";
import { formatDate } from "@/lib/portal/status";
import { InviteBrokerForm, RequestDecision, ResendInvite } from "./AccessControls";

export const metadata: Metadata = { title: "Access requests" };

export default function AccessRequestsPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={6} />}>
      <AccessRequests />
    </Suspense>
  );
}

const statusLabel = { pending: "Waiting for approval", approved: "Approved", declined: "Declined" } as const;

async function AccessRequests() {
  await requireAdmin();
  const [requests, brokerages] = await Promise.all([listAccessRequests(), allBrokerages()]);
  const options = brokerages.map((b) => ({ id: b.id, name: b.name })).sort((a, b) => a.name.localeCompare(b.name));
  const nameOf = new Map(brokerages.map((b) => [b.id, b.name]));
  const pending = requests.filter((r) => r.status === "pending");
  const decided = requests.filter((r) => r.status !== "pending");

  return (
    <>
      <PageHeader
        title="Access requests"
        description="Brokers who have asked to join the Otta Broker Portal. Approving one sets up their account and emails them a welcome link to choose a password (valid for 7 days)."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader title={`Waiting for approval (${pending.length})`} />
            {pending.length === 0 ? (
              <EmptyState title="No requests waiting">New requests from the portal&apos;s Request access page appear here.</EmptyState>
            ) : (
              <ul className="divide-y divide-[#eaeaea]">
                {pending.map((r) => (
                  <li key={r.id} className="space-y-4 px-6 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-charcoal">
                          {r.name} <span className="font-normal text-body">· {r.role}</span>
                        </p>
                        <p className="text-[14px] text-body">
                          <a href={`mailto:${r.email}`} className="hover:text-site-teal">{r.email}</a> · {r.phone}
                        </p>
                        <p className="mt-1 text-[14px] text-charcoal">
                          {r.brokerageName}
                          {r.fspNumber && <span className="text-body"> · FSP {r.fspNumber}</span>}
                        </p>
                        {r.matchedBrokerageId && (
                          <p className="mt-1 text-[13px] text-[#2e7d74]">Email domain matches {nameOf.get(r.matchedBrokerageId)}</p>
                        )}
                        {r.message && <p className="mt-2 border-l-2 border-[#eaeaea] pl-3 text-[14px] text-body">{r.message}</p>}
                      </div>
                      <span className="text-[13px] text-body">{formatDate(r.createdAt)}</span>
                    </div>
                    <RequestDecision id={r.id} brokerages={options} matchedId={r.matchedBrokerageId} brokerageName={r.brokerageName} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card>
            <CardHeader title="Recently decided" />
            {decided.length === 0 ? (
              <EmptyState title="Nothing yet" />
            ) : (
              <ul className="divide-y divide-[#eaeaea]">
                {decided.map((r) => (
                  <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                    <div>
                      <p className="font-medium text-charcoal">
                        {r.name} <span className="font-normal text-body">· {r.matchedBrokerageId ? nameOf.get(r.matchedBrokerageId) : r.brokerageName}</span>
                      </p>
                      <p className="text-[13px] text-body">
                        {statusLabel[r.status]}
                        {r.decidedBy && ` by ${r.decidedBy}`}
                        {r.decidedAt && `, ${formatDate(r.decidedAt)}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={r.status === "approved" ? "Approved" : "Declined"} />
                      {r.status === "approved" && <ResendInvite id={r.id} />}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
        <Card className="self-start">
          <CardHeader title="Invite a broker" />
          <div className="p-6">
            <p className="mb-4 text-[14px] text-body">Add a broker yourself. They&apos;ll get a welcome email to choose a password.</p>
            <InviteBrokerForm brokerages={options} />
          </div>
        </Card>
      </div>
    </>
  );
}
