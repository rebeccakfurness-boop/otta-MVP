import type { Metadata } from "next";
import { Suspense } from "react";
import { RecordList } from "@/components/portal/RecordList";
import { ButtonLink, LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { requireBroker } from "@/lib/portal/auth";
import { portalPath } from "@/lib/portal/config";
import { listQuotes } from "@/lib/portal/data";
import { productName } from "@/lib/portal/products";
import { formatDate } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Quote requests" };

export default function QuotesPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={6} />}>
      <Quotes />
    </Suspense>
  );
}

async function Quotes() {
  const user = await requireBroker();
  const quotes = await listQuotes(user.brokerageId);
  return (
    <>
      <PageHeader
        title="Quote requests"
        description="Every quote request you've sent to Otta and where it's up to."
        actions={
          <ButtonLink href={portalPath("/forms?type=proposal")} icon="plus">
            New quote request
          </ButtonLink>
        }
      />
      <RecordList
        columns={["Insured", "Reference", "Product", "Submitted"]}
        searchPlaceholder="Search insured, reference or product"
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
          href: portalPath(`/quotes/${q.ref}`),
          status: q.status,
          search: `${q.insured} ${q.ref} ${productName(q.productSlug)}`,
          cells: [q.insured, q.ref, productName(q.productSlug), formatDate(q.submitted)],
        }))}
      />
    </>
  );
}
