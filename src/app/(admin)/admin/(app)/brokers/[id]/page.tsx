import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RecordList } from "@/components/portal/RecordList";
import { ButtonLink, Card, CardHeader, LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/config";
import { findBrokerageWithUsers } from "@/lib/admin/data";
import { productTabs } from "@/lib/admin/products";
import { listPolicies, listQuotes } from "@/lib/portal/data";
import { allOrganisations } from "@/lib/portal/accounts";
import { brokerageScope } from "@/lib/portal/scope";
import { access } from "@/content/admin-access";
import { AccessSelect, NetworkSelect } from "../../organisations/AccessForms";
import { productName } from "@/lib/portal/products";
import { formatDate, formatMoney, policyStatus } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Broker" };

export default function BrokerPage({ params }: PageProps<"/admin/brokers/[id]">) {
  return (
    <Suspense fallback={<LoadingBlocks rows={8} />}>
      <Broker params={params} />
    </Suspense>
  );
}

async function Broker({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const broker = await findBrokerageWithUsers(id);
  if (!broker) notFound();
  // The same scoped reads the broker portal uses, so this matches their view.
  const [policies, quotes, orgs] = await Promise.all([listPolicies(brokerageScope(id)), listQuotes(brokerageScope(id)), allOrganisations()]);
  const networks = orgs.filter((o) => o.kind === "network");
  const now = new Date();
  const live = policies.filter((p) => policyStatus(p, now) !== "Expired");

  return (
    <>
      <PageHeader
        back={{ href: adminPath("/brokers"), label: "All brokers" }}
        title={broker.name}
        description={`${live.length} active policies · ${quotes.length} quote requests · ${formatMoney(live.reduce((s, p) => s + p.premium, 0))} premium in force`}
        actions={
          <ButtonLink href={adminPath(`/brokers/${id}/view`)} icon="eye">
            Open broker view
          </ButtonLink>
        }
      />

      <Card>
        <CardHeader title="People" />
        <p className="border-b border-[#eaeaea] px-6 py-3 text-[13px] text-body">{access.levelHelp}</p>
        <ul className="divide-y divide-[#eaeaea]">
          {broker.users.map((u) => (
            <li key={u.id} className="flex flex-col gap-2 px-6 py-3.5 lg:flex-row lg:items-center lg:justify-between">
              <span>
                <span className="block text-[15px] font-medium text-charcoal">{u.name}</span>
                <a href={`mailto:${u.email}`} className="text-[13px] text-site-teal hover:underline">
                  {u.email}
                </a>
              </span>
              <AccessSelect userId={u.id} sees={u.sees ?? "brokerage"} />
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 border-t border-[#eaeaea] px-6 py-3.5 lg:flex-row lg:items-center lg:justify-between">
          <span>
            <span className="block text-[14px] font-medium text-charcoal">{access.network}</span>
            <span className="text-[13px] text-body">{access.networkHelp}</span>
          </span>
          <NetworkSelect brokerageId={id} networkId={broker.networkId} networks={networks.map((n) => ({ id: n.id, name: n.name }))} />
        </div>
        <p className="border-t border-[#eaeaea] px-6 py-3 text-[13px] text-body">
          SSO domains: {broker.domains.join(", ")}
          {broker.microsoftTenantIds.length === 0 && " · Microsoft tenant not registered yet"}
        </p>
      </Card>

      <h2 className="mt-12 mb-4 font-heading text-[20px] font-semibold tracking-normal text-charcoal">Policies</h2>
      <RecordList
        productTabs={productTabs}
        columns={["Insured", "Policy number", "Product", "Expires", "Premium"]}
        searchPlaceholder="Search this broker's policies"
        emptyTitle="No policies"
        statuses={[
          { key: "all", label: "All", match: [] },
          { key: "active", label: "Active", match: ["Active", "Renewal due"] },
          { key: "renewal", label: "Renewal due", match: ["Renewal due"] },
          { key: "expired", label: "Expired", match: ["Expired"] },
        ]}
        rows={policies.map((p) => ({
          id: p.id,
          href: adminPath(`/policies/${p.id}`),
          status: policyStatus(p, now),
          product: p.productSlug,
          search: `${p.insured} ${p.number} ${productName(p.productSlug)}`,
          cells: [p.insured, p.number, productName(p.productSlug), formatDate(p.end), formatMoney(p.premium)],
        }))}
      />

      <h2 className="mt-12 mb-4 font-heading text-[20px] font-semibold tracking-normal text-charcoal">Quote requests</h2>
      <Card>
        <ul className="divide-y divide-[#eaeaea]">
          {quotes.map((q) => (
            <li key={q.ref}>
              <Link href={adminPath(`/quotes/${q.ref}`)} className="flex items-center gap-4 px-6 py-4 hover:bg-footer">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium text-charcoal">{q.insured}</p>
                  <p className="truncate text-[13px] text-body">
                    {q.ref} · {productName(q.productSlug)} · {formatDate(q.submitted)} · {q.status}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
