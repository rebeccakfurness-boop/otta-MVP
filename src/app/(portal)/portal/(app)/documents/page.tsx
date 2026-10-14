import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Card, CardHeader, DownloadButton, LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { factSheetFor, wordingsFor } from "@/content/documents";
import { products } from "@/content/products";
import { requireBroker } from "@/lib/portal/auth";
import { portalPath } from "@/lib/portal/config";
import { listPolicies } from "@/lib/portal/data";
import { productName } from "@/lib/portal/products";
import { formatDate } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Documents" };

export default function DocumentsPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={8} />}>
      <Documents />
    </Suspense>
  );
}

async function Documents() {
  const user = await requireBroker();
  const policies = await listPolicies(user.brokerageId);

  return (
    <>
      <PageHeader title="Documents" description="Documents for every policy you've placed with Otta, plus the current wording and fact sheet for each product." />

      <h2 className="mb-4 font-heading text-[20px] font-semibold tracking-normal text-charcoal">Your clients&apos; policy documents</h2>
      <div className="space-y-5">
        {policies.map((p) => (
          <Card key={p.id}>
            <CardHeader
              title={p.insured}
              action={
                <Link href={portalPath(`/policies/${p.id}`)} className="text-[12px] font-medium tracking-[0.1em] whitespace-nowrap text-site-teal uppercase hover:underline">
                  {p.number}
                </Link>
              }
            />
            <ul className="grid divide-y divide-[#eaeaea] sm:grid-cols-2 sm:divide-y-0">
              {p.documents.map((d) => (
                <li key={d.id} className="flex items-center gap-3 border-[#eaeaea] px-6 py-3.5 sm:border-b sm:odd:border-r">
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-charcoal">{d.name}</p>
                    <p className="text-[12px] text-body">{formatDate(d.issued)}</p>
                  </div>
                  <DownloadButton file={d.file} />
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <h2 className="mt-12 mb-4 font-heading text-[20px] font-semibold tracking-normal text-charcoal">Product wordings and fact sheets</h2>
      <Card>
        <ul className="divide-y divide-[#eaeaea]">
          {products.map((p) => (
            <li key={p.slug} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center">
              <p className="flex-1 text-[15px] font-medium text-charcoal">{productName(p.slug)}</p>
              <div className="flex flex-wrap gap-2">
                {wordingsFor(p.slug).length === 0 && <DownloadButton label="Policy wording" />}
                {wordingsFor(p.slug).map((d) => (
                  <DownloadButton key={d.file} file={d.file} label={wordingsFor(p.slug).length > 1 ? d.title.replace(/ Insurance Policy| Policy/, "") : "Policy wording"} />
                ))}
                <DownloadButton file={factSheetFor(p.slug)?.file} label="Fact sheet" />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
