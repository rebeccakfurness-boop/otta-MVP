import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ButtonLink, Card, CardHeader, DetailList, LoadingBlocks, PageHeader, StatusBadge, Timeline } from "@/components/portal/ui";
import { portalClaims as copy } from "@/content/portal-pages";
import { site } from "@/content/site";
import { requireBroker } from "@/lib/portal/auth";
import { portalPath } from "@/lib/portal/config";
import { getClaim } from "@/lib/portal/data";
import { productName } from "@/lib/portal/products";
import { formatDate, formatMoney } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Claim" };

export default function ClaimPage({ params }: PageProps<"/portal/claims/[id]">) {
  return (
    <Suspense fallback={<LoadingBlocks rows={5} />}>
      <ClaimDetail params={params} />
    </Suspense>
  );
}

async function ClaimDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireBroker();
  const { id } = await params;
  const claim = await getClaim(user.scope, id);
  if (!claim) notFound();
  const mailto = `mailto:${site.claimsEmail}?subject=${encodeURIComponent(`${claim.number}: ${claim.insured}`)}`;

  return (
    <>
      <PageHeader
        back={{ href: portalPath("/claims"), label: copy.detail.back }}
        title={claim.insured}
        description={
          <span className="flex flex-wrap items-center gap-3">
            {claim.number} · {productName(claim.productSlug)} <StatusBadge status={claim.status} />
          </span>
        }
        actions={
          <ButtonLink href={mailto} icon="mail" variant="secondary" external>
            Email the claims team
          </ButtonLink>
        }
      />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title={copy.detail.details} />
          <DetailList
            items={[
              { label: "Insured", value: claim.insured },
              {
                label: "Policy",
                value: (
                  <Link href={portalPath(`/policies/${claim.policyId}`)} className="text-site-teal hover:underline">
                    View policy
                  </Link>
                ),
              },
              { label: "Date of loss", value: formatDate(claim.dateOfLoss) },
              { label: "Lodged", value: formatDate(claim.lodged) },
              { label: "Amount claimed", value: claim.claimed !== undefined ? formatMoney(claim.claimed) : "To be confirmed" },
              { label: "Paid", value: claim.paid !== undefined ? formatMoney(claim.paid) : "Nothing paid yet" },
              { label: "Handled by", value: claim.handler },
              { label: "What happened", value: claim.description },
            ]}
          />
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader title={copy.detail.progress} />
            <Timeline items={claim.history} format={formatDate} />
          </Card>
          <Card>
            <CardHeader title={copy.detail.contact} />
            <p className="px-6 py-5 text-[14px] leading-relaxed text-body">
              {copy.detail.contactText}{" "}
              <a href={mailto} className="text-site-teal hover:underline">
                {site.claimsEmail}
              </a>
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
