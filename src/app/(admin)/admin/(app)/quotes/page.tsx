import type { Metadata } from "next";
import { Suspense } from "react";
import { RecordList } from "@/components/portal/RecordList";
import { LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/config";
import { brokerageNames, listAllQuotes } from "@/lib/admin/data";
import { productTabs } from "@/lib/admin/products";
import { productName } from "@/lib/portal/products";
import { formatDate } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Quote requests" };

export default function AdminQuotesPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={8} />}>
      <Quotes />
    </Suspense>
  );
}

async function Quotes() {
  await requireAdmin();
  const [quotes, names] = await Promise.all([listAllQuotes(), brokerageNames()]);
  return (
    <>
      <PageHeader title="Quote requests" description="Every quote request from every broker, newest first." />
      <RecordList
        productTabs={productTabs}
        columns={["Insured", "Reference", "Broker", "Submitted", "Source"]}
        searchPlaceholder="Search insured, reference or broker"
        emptyTitle="No quote requests found"
        statuses={[
          { key: "all", label: "All", match: [] },
          { key: "open", label: "Open", match: ["Submitted", "In review"] },
          { key: "quoted", label: "Quoted", match: ["Quoted"] },
          { key: "bound", label: "Bound", match: ["Bound"] },
          { key: "declined", label: "Declined", match: ["Declined"] },
        ]}
        rows={quotes.map((q) => ({
          id: q.ref,
          href: adminPath(`/quotes/${q.ref}`),
          status: q.status,
          product: q.productSlug,
          search: `${q.insured} ${q.ref} ${names[q.brokerageId]} ${productName(q.productSlug)}`,
          cells: [q.insured, q.ref, names[q.brokerageId], formatDate(q.submitted), q.source === "ihq" ? "InsuredHQ" : "Manual"],
        }))}
      />
    </>
  );
}
