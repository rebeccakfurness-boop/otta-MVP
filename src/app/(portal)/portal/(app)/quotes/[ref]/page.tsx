import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ButtonLink,
  Card,
  CardHeader,
  DetailList,
  LoadingBlocks,
  PageHeader,
  StatusBadge,
} from "@/components/portal/ui";
import { getBindInstruction } from "@/lib/binds";
import { requireBroker } from "@/lib/portal/auth";
import { portalPath } from "@/lib/portal/config";
import { getQuote } from "@/lib/portal/data";
import { productName, teamEmail } from "@/lib/portal/products";
import { formatDate } from "@/lib/portal/status";
import { BindForm } from "./BindForm";

export const metadata: Metadata = { title: "Quote request" };

export default function QuotePage({
  params,
}: PageProps<"/portal/quotes/[ref]">) {
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
  const bind = await getBindInstruction(quote.ref);
  const inAWeek = new Date(new Date().getTime() + 7 * 86_400_000)
    .toISOString()
    .slice(0, 10);

  return (
    <>
      <PageHeader
        back={{ href: portalPath("/quotes"), label: "All quote requests" }}
        title={quote.insured}
        description={
          <span className="flex flex-wrap items-center gap-3">
            {quote.ref} · {productName(quote.productSlug)}{" "}
            <StatusBadge status={quote.status} />
          </span>
        }
        actions={
          <ButtonLink
            href={`mailto:${email}?subject=${encodeURIComponent(`${quote.ref}: ${quote.insured}`)}`}
            icon="mail"
            variant="secondary"
            external
          >
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
              {
                label: "Underwriting team",
                value: (
                  <a
                    href={`mailto:${email}`}
                    className="text-site-teal hover:underline"
                  >
                    {quote.underwriter}
                  </a>
                ),
              },
              { label: "Summary", value: quote.summary },
              {
                label: "Policy",
                value: quote.policyId ? (
                  <Link
                    href={portalPath(`/policies/${quote.policyId}`)}
                    className="text-site-teal hover:underline"
                  >
                    View bound policy
                  </Link>
                ) : (
                  "Not bound"
                ),
              },
            ]}
          />
        </Card>
        <div className="space-y-6">
          {bind ? (
            <Card>
              <CardHeader title="Bind instruction sent" />
              <div className="space-y-1 px-6 py-5 text-[14px] text-charcoal">
                <p>
                  {bind.brokerName} asked us to bind this quote on{" "}
                  {formatDate(bind.createdAt)}, with cover from{" "}
                  {formatDate(bind.inceptionDate)}.
                </p>
                {bind.notes && <p className="text-body">Notes: {bind.notes}</p>}
                <p className="pt-2 text-body">
                  We&apos;ll confirm cover and send the policy documents.
                </p>
              </div>
            </Card>
          ) : (
            quote.status === "Quoted" && (
              <Card>
                <CardHeader title="Bind this quote" />
                <BindForm quoteRef={quote.ref} defaultDate={inAWeek} />
              </Card>
            )
          )}
          <Card>
            <CardHeader title="Progress" />
            <ol className="px-6 py-6">
              {quote.history.map((h, i) => (
                <li key={i} className="relative pb-6 pl-7 last:pb-0">
                  {i < quote.history.length - 1 && (
                    <span className="absolute top-3 left-[5px] h-full w-px bg-[#dcdcdc]" />
                  )}
                  <span
                    className={`absolute top-1.5 left-0 h-[11px] w-[11px] rounded-full ${i === quote.history.length - 1 ? "bg-site-teal" : "border-2 border-site-teal bg-white"}`}
                  />
                  <p className="text-[14px] font-medium text-charcoal">
                    {h.event}
                  </p>
                  <p className="text-[13px] text-body">{formatDate(h.date)}</p>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </>
  );
}
