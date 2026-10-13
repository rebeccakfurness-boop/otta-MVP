import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ButtonLink, Card, CardHeader, DetailList, LoadingBlocks, PageHeader, StatusBadge } from "@/components/portal/ui";
import { requireBroker } from "@/lib/portal/auth";
import { portalPath } from "@/lib/portal/config";
import { getQuote } from "@/lib/portal/data";
import { productName, teamEmail } from "@/lib/portal/products";
import { formatDate } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Quote request" };

export default function QuotePage({ params }: PageProps<"/portal/quotes/[ref]">) {
  return (
    <Suspense fallback={<LoadingBlocks rows={5} />}>
      <Quote params={params} />
    </Suspense>
  );
}

async function Quote({ params }: { params: Promise<{ ref: string }> }) {
  const user = await requireBroker();
  const { ref } = await params;
  const quote = await getQuote(user.brokerageId, ref);
  if (!quote) notFound();
  const email = teamEmail(quote.productSlug);

  return (
    <>
      <PageHeader
        back={{ href: portalPath("/quotes"), label: "All quote requests" }}
        title={quote.insured}
        description={
          <span className="flex flex-wrap items-center gap-3">
            {quote.ref} · {productName(quote.productSlug)} <StatusBadge status={quote.status} />
          </span>
        }
        actions={
          <ButtonLink href={`mailto:${email}?subject=${encodeURIComponent(`${quote.ref}: ${quote.insured}`)}`} icon="mail" variant="secondary" external>
            Email underwriter
          </ButtonLink>
        }
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Request details" />
          <DetailList
            items={[
              { label: "Insured", value: quote.insured },
              { label: "Product", value: productName(quote.productSlug) },
              { label: "Submitted", value: formatDate(quote.submitted) },
              { label: "Underwriting team", value: <a href={`mailto:${email}`} className="text-site-teal hover:underline">{quote.underwriter}</a> },
              { label: "Summary", value: quote.summary },
              {
                label: "Policy",
                value: quote.policyId ? (
                  <Link href={portalPath(`/policies/${quote.policyId}`)} className="text-site-teal hover:underline">
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
