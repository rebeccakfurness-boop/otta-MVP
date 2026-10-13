import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Card, CardHeader, DetailList, LoadingBlocks, PageHeader, SourceBadge, StatusBadge } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/config";
import { brokerageNames, findQuote } from "@/lib/admin/data";
import { productName } from "@/lib/portal/products";
import { formatDate } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Quote request" };

export default function AdminQuotePage({ params }: PageProps<"/admin/quotes/[ref]">) {
  return (
    <Suspense fallback={<LoadingBlocks rows={6} />}>
      <Quote params={params} />
    </Suspense>
  );
}

async function Quote({ params }: { params: Promise<{ ref: string }> }) {
  await requireAdmin();
  const { ref } = await params;
  const quote = await findQuote(ref);
  if (!quote) notFound();
  const names = await brokerageNames();

  return (
    <>
      <PageHeader
        back={{ href: adminPath("/quotes"), label: "All quote requests" }}
        title={quote.insured}
        description={
          <span className="flex flex-wrap items-center gap-3">
            {quote.ref} · {productName(quote.productSlug)} <StatusBadge status={quote.status} /> <SourceBadge source={quote.source} />
          </span>
        }
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Request details" />
          <DetailList
            items={[
              { label: "Insured", value: quote.insured },
              { label: "Product", value: productName(quote.productSlug) },
              {
                label: "Broker",
                value: (
                  <Link href={adminPath(`/brokers/${quote.brokerageId}`)} className="text-site-teal hover:underline">
                    {names[quote.brokerageId]}
                  </Link>
                ),
              },
              { label: "Submitted", value: formatDate(quote.submitted) },
              { label: "Underwriting team", value: quote.underwriter },
              { label: "Source", value: quote.source === "ihq" ? "InsuredHQ" : "Manual entry" },
              { label: "Summary", value: quote.summary },
              {
                label: "Policy",
                value: quote.policyId ? (
                  <Link href={adminPath(`/policies/${quote.policyId}`)} className="text-site-teal hover:underline">
                    View bound policy
                  </Link>
                ) : (
                  "Not bound"
                ),
              },
            ]}
          />
        </Card>
        <Card>
          <CardHeader title="Progress" />
          <ol className="px-6 py-6">
            {quote.history.map((h, i) => (
              <li key={i} className="relative pb-6 pl-7 last:pb-0">
                {i < quote.history.length - 1 && <span className="absolute top-3 left-[5px] h-full w-px bg-[#dcdcdc]" />}
                <span className={`absolute top-1.5 left-0 h-[11px] w-[11px] rounded-full ${i === quote.history.length - 1 ? "bg-site-teal" : "border-2 border-site-teal bg-white"}`} />
                <p className="text-[14px] font-medium text-charcoal">{h.event}</p>
                <p className="text-[13px] text-body">{formatDate(h.date)}</p>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </>
  );
}
