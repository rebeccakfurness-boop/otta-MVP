import type { Metadata } from "next";
import { Suspense } from "react";
import { RecordList } from "@/components/portal/RecordList";
import { LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { requireBroker } from "@/lib/portal/auth";
import { portalPath } from "@/lib/portal/config";
import { listPolicies } from "@/lib/portal/data";
import { productName } from "@/lib/portal/products";
import { formatDate, policyStatus } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Policies" };

export default function PoliciesPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={6} />}>
      <Policies />
    </Suspense>
  );
}

async function Policies() {
  const user = await requireBroker();
  const policies = await listPolicies(user.brokerageId);
  const now = new Date();
  return (
    <>
      <PageHeader title="Policies" description="Policies bound with Otta for your clients, with their documents and renewal dates." />
      <RecordList
        columns={["Insured", "Policy number", "Product", "Expires"]}
        searchPlaceholder="Search insured, policy number or product"
        emptyTitle="No policies found"
        statuses={[
          { key: "all", label: "All", match: [] },
          { key: "active", label: "Active", match: ["Active", "Renewal due"] },
          { key: "renewal", label: "Renewal due", match: ["Renewal due"] },
          { key: "expired", label: "Expired", match: ["Expired"] },
        ]}
        rows={policies.map((p) => ({
          id: p.id,
          href: portalPath(`/policies/${p.id}`),
          status: policyStatus(p, now),
          search: `${p.insured} ${p.number} ${productName(p.productSlug)}`,
          cells: [p.insured, p.number, productName(p.productSlug), formatDate(p.end)],
        }))}
      />
    </>
  );
}
