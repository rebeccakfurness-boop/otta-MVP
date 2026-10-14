import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BrokerDashboard } from "@/components/portal/BrokerDashboard";
import { Icon } from "@/components/portal/Icon";
import { Card, CardHeader, DownloadButton, LoadingBlocks } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/config";
import { findBrokerageWithUsers } from "@/lib/admin/data";
import { listPolicies, listQuotes } from "@/lib/portal/data";
import { brokerageScope } from "@/lib/portal/scope";
import { formatDate } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Broker view" };

export default function BrokerViewPage({ params }: PageProps<"/admin/brokers/[id]/view">) {
  return (
    <Suspense fallback={<LoadingBlocks rows={8} />}>
      <BrokerView params={params} />
    </Suspense>
  );
}

// Read-only: shows the broker portal dashboard with exactly the data this
// brokerage sees (same scoped queries as the broker portal).
async function BrokerView({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const broker = await findBrokerageWithUsers(id);
  if (!broker) notFound();
  const [policies, quotes] = await Promise.all([listPolicies(brokerageScope(id)), listQuotes(brokerageScope(id))]);
  const firstName = broker.users[0]?.name.split(" ")[0] ?? "there";

  return (
    <>
      <div className="mb-8 flex flex-col gap-3 border-l-4 border-site-blue bg-[#e3eef3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-[14px] text-site-blue">
          <Icon name="eye" className="h-5 w-5 shrink-0" />
          You&apos;re seeing the broker portal as {broker.name} sees it. Read only.
        </p>
        <Link href={adminPath(`/brokers/${id}`)} className="text-[12px] font-medium tracking-[0.1em] whitespace-nowrap text-site-blue uppercase hover:underline">
          Back to admin record
        </Link>
      </div>

      <BrokerDashboard
        brokerageName={broker.name}
        firstName={firstName}
        quotes={quotes}
        policies={policies}
        now={new Date()}
        links={{
          quotes: adminPath(`/brokers/${id}`),
          policies: adminPath(`/brokers/${id}`),
          renewals: adminPath(`/brokers/${id}?status=renewal`),
          quote: (ref) => adminPath(`/quotes/${ref}`),
          policy: (pid) => adminPath(`/policies/${pid}`),
          forms: (type) => adminPath(`/forms?type=${type}`),
        }}
      />

      <h2 className="mt-12 mb-4 font-heading text-[20px] font-semibold tracking-normal text-charcoal">Their documents</h2>
      <div className="space-y-5">
        {policies.map((p) => (
          <Card key={p.id}>
            <CardHeader title={p.insured} action={<span className="text-[12px] text-body">{p.number}</span>} />
            <ul className="grid divide-y divide-[#eaeaea] sm:grid-cols-2 sm:divide-y-0">
              {p.documents.map((d) => (
                <li key={d.id} className="flex items-center gap-3 border-[#eaeaea] px-6 py-3.5 sm:border-b sm:odd:border-r">
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-charcoal">{d.name}</p>
                    <p className="text-[12px] text-body">{formatDate(d.issued)}</p>
                  </div>
                  <DownloadButton file={d.file} />
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
