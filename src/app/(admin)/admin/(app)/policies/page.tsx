import type { Metadata } from "next";
import { Suspense } from "react";
import { RecordList } from "@/components/portal/RecordList";
import { LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/config";
import { brokerageNames, listAllPolicies } from "@/lib/admin/data";
import { productTabs } from "@/lib/admin/products";
import { productName } from "@/lib/portal/products";
import { formatDate, formatMoney, policyStatus } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Policies" };

export default function AdminPoliciesPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={8} />}>
      <Policies />
    </Suspense>
  );
}

async function Policies() {
  await requireAdmin();
  const [policies, names] = await Promise.all([listAllPolicies(), brokerageNames()]);
  const now = new Date();
  return (
    <>
      <PageHeader title="Policies" description="Every policy across all brokers, from manual entry and InsuredHQ. Search by insured, policy number, broker or InsuredHQ reference." />
      <RecordList
        productTabs={productTabs}
        columns={["Insured", "Policy number", "Broker", "Expires", "Premium", "Source"]}
        searchPlaceholder="Search insured, policy, broker or IHQ ref"
        emptyTitle="No policies found"
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
          search: `${p.insured} ${p.number} ${names[p.brokerageId]} ${productName(p.productSlug)} ${p.ihqRef ?? ""}`,
          cells: [p.insured, p.number, names[p.brokerageId], formatDate(p.end), formatMoney(p.premium), p.source === "ihq" ? "InsuredHQ" : "Manual"],
        }))}
      />
    </>
  );
}
