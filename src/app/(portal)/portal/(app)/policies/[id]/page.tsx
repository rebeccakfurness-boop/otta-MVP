import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ButtonLink, Card, CardHeader, DetailList, DownloadButton, LoadingBlocks, PageHeader, StatusBadge } from "@/components/portal/ui";
import { requireBroker } from "@/lib/portal/auth";
import { portalPath } from "@/lib/portal/config";
import { getPolicy } from "@/lib/portal/data";
import { canPlace } from "@/lib/portal/scope";
import { productName, teamEmail } from "@/lib/portal/products";
import { formatDate, formatMoney, policyStatus } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Policy" };

export default function PolicyPage({ params }: PageProps<"/portal/policies/[id]">) {
  return (
    <Suspense fallback={<LoadingBlocks rows={5} />}>
      <Policy params={params} />
    </Suspense>
  );
}

async function Policy({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireBroker();
  const { id } = await params;
  const policy = await getPolicy(user.scope, id);
  if (!policy) notFound();
  const status = policyStatus(policy, new Date());
  const product = policy.productSlug;
  const email = teamEmail(product);

  return (
    <>
      <PageHeader
        back={{ href: portalPath("/policies"), label: "All policies" }}
        title={policy.insured}
        description={
          <span className="flex flex-wrap items-center gap-3">
            {policy.number} · {productName(product)} <StatusBadge status={status} />
          </span>
        }
        actions={
          canPlace(user.scope, policy.brokerageId) && (
          <>
            <ButtonLink href={portalPath(`/forms?type=renewal&product=${product}`)} icon="renew" variant={status === "Renewal due" ? "primary" : "secondary"}>
              Renewal declaration
            </ButtonLink>
            <ButtonLink href={portalPath(`/forms?type=claim&product=${product}`)} icon="claim" variant="secondary">
              Lodge a claim
            </ButtonLink>
          </>
          )
        }
      />
      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-2">
          <CardHeader title="Policy details" />
          <DetailList
            items={[
              { label: "Policy number", value: policy.number },
              { label: "Product", value: productName(product) },
              { label: "Period", value: `${formatDate(policy.start)} to ${formatDate(policy.end)}` },
              { label: "Premium", value: formatMoney(policy.premium) },
              ...(policy.sumInsured ? [{ label: "Sum insured / limit", value: policy.sumInsured }] : []),
              {
                label: "Changes",
                value: (
                  <a href={`mailto:${email}?subject=${encodeURIComponent(`Change request: ${policy.number}`)}`} className="text-site-teal hover:underline">
                    Request a change
                  </a>
                ),
              },
            ]}
          />
        </Card>
        <Card className="xl:col-span-3">
          <CardHeader title="Policy documents" />
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
