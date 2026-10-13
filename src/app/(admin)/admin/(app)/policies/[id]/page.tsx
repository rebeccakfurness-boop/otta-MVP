import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Card, CardHeader, DetailList, DownloadButton, LoadingBlocks, PageHeader, SourceBadge, StatusBadge } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/config";
import { brokerageNames, findPolicy, listAllQuotes } from "@/lib/admin/data";
import { productName } from "@/lib/portal/products";
import { formatDate, formatMoney, policyStatus } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Policy" };

export default function AdminPolicyPage({ params }: PageProps<"/admin/policies/[id]">) {
  return (
    <Suspense fallback={<LoadingBlocks rows={6} />}>
      <Policy params={params} />
    </Suspense>
  );
}

async function Policy({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const policy = await findPolicy(id);
  if (!policy) notFound();
  const [names, quotes] = await Promise.all([brokerageNames(), listAllQuotes()]);
  const quote = quotes.find((q) => q.policyId === policy.id);
  const status = policyStatus(policy, new Date());

  return (
    <>
      <PageHeader
        back={{ href: adminPath("/policies"), label: "All policies" }}
        title={policy.insured}
        description={
          <span className="flex flex-wrap items-center gap-3">
            {policy.number} · {productName(policy.productSlug)} <StatusBadge status={status} /> <SourceBadge source={policy.source} />
          </span>
        }
      />
      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-2">
          <CardHeader title="Policy details" />
          <DetailList
            items={[
              { label: "Policy number", value: policy.number },
              { label: "Product", value: productName(policy.productSlug) },
              {
                label: "Broker",
                value: (
                  <Link href={adminPath(`/brokers/${policy.brokerageId}`)} className="text-site-teal hover:underline">
                    {names[policy.brokerageId]}
                  </Link>
                ),
              },
              { label: "Period", value: `${formatDate(policy.start)} to ${formatDate(policy.end)}` },
              { label: "Annual premium", value: formatMoney(policy.premium) },
              ...(policy.sumInsured ? [{ label: "Sum insured / limit", value: policy.sumInsured }] : []),
              { label: "Source", value: policy.source === "ihq" ? `InsuredHQ${policy.ihqRef ? ` (${policy.ihqRef})` : ""}` : "Manual entry" },
              {
                label: "Quote",
                value: quote ? (
                  <Link href={adminPath(`/quotes/${quote.ref}`)} className="text-site-teal hover:underline">
                    {quote.ref}
                  </Link>
                ) : (
                  "Not linked"
                ),
              },
            ]}
          />
        </Card>
        <Card className="xl:col-span-3">
          <CardHeader title="Documents" />
          <ul className="divide-y divide-[#eaeaea]">
            {policy.documents.map((d) => (
              <li key={d.id} className="flex items-center gap-4 px-6 py-4">
                <span className="flex h-11 w-9 shrink-0 items-center justify-center rounded-sm bg-[#e6f4f2] text-[10px] font-bold text-[#2e7d74]">PDF</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium text-charcoal">{d.name}</p>
                  <p className="text-[13px] text-body">Issued {formatDate(d.issued)}</p>
                </div>
                <DownloadButton file={d.file} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
