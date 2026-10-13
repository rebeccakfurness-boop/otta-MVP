import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/config";
import { brokerageNames, listAllPolicies } from "@/lib/admin/data";
import { productTabs } from "@/lib/admin/products";
import { DocumentsBrowser } from "./DocumentsBrowser";

export const metadata: Metadata = { title: "Documents" };

export default function AdminDocumentsPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={8} />}>
      <Documents />
    </Suspense>
  );
}

async function Documents() {
  await requireAdmin();
  const [policies, names] = await Promise.all([listAllPolicies(), brokerageNames()]);
  const rows = policies.flatMap((p) =>
    p.documents.map((d) => ({
      id: d.id,
      name: d.name,
      issued: d.issued,
      file: d.file,
      product: p.productSlug,
      insured: p.insured,
      policyNumber: p.number,
      broker: names[p.brokerageId],
      policyHref: adminPath(`/policies/${p.id}`),
    })),
  );
  return (
    <>
      <PageHeader title="Documents" description="Every policy document across all brokers. Search by insured, policy number, broker or document." />
      <DocumentsBrowser rows={rows} productTabs={productTabs} />
    </>
  );
}
