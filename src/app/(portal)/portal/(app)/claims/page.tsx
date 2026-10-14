import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "@/components/portal/Icon";
import { ButtonLink, Card, CardHeader, EmptyState, LoadingBlocks, PageHeader, StatusBadge } from "@/components/portal/ui";
import { getForm } from "@/content/forms";
import { portalClaims as copy } from "@/content/portal-pages";
import { listApplications } from "@/lib/applications/store";
import { requireBroker } from "@/lib/portal/auth";
import { portalPath } from "@/lib/portal/config";
import { listClaims, organisationNames } from "@/lib/portal/data";
import { canPlace, canSeeApplication } from "@/lib/portal/scope";
import { productName } from "@/lib/portal/products";
import { formatDate, formatMoney } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Claims" };

export default function ClaimsPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={6} />}>
      <Claims />
    </Suspense>
  );
}

const OPEN = ["Lodged", "Being assessed", "Approved"];

async function Claims() {
  const broker = await requireBroker();
  const [claims, allApps, names] = await Promise.all([listClaims(broker.scope), listApplications(broker.scope.ownBrokerageId ?? undefined), organisationNames()]);
  const apps = allApps.filter((a) => canSeeApplication(broker.scope, a));
  const online = apps.filter((a) => getForm(a.form)?.resource === "claim-forms");
  const yearAgo = new Date(new Date().getTime() - 365 * 86_400_000).toISOString().slice(0, 10);
  const recent = claims.filter((c) => c.lodged >= yearAgo);
  const stats = [
    { label: copy.stats.open, value: String(claims.filter((c) => OPEN.includes(c.status)).length) },
    { label: copy.stats.total, value: String(recent.length) },
    { label: copy.stats.paid, value: formatMoney(recent.reduce((sum, c) => sum + (c.paid ?? 0), 0)) },
  ];

  return (
    <>
      <PageHeader
        title={copy.title}
        description={copy.intro}
        actions={
          canPlace(broker.scope) && (
          <ButtonLink href={portalPath("/forms?type=claim")} icon="claim">
            {copy.lodge.title}
          </ButtonLink>
          )
        }
      />

      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-sm border border-[#eaeaea] bg-white p-4 sm:p-6">
            <p className="text-[12px] leading-snug text-body sm:text-[13px]">{s.label}</p>
            <p className="mt-3 font-heading text-[24px] leading-none font-bold text-charcoal sm:text-[34px]">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader title={copy.listTitle} />
            {claims.length === 0 ? (
              <EmptyState title={copy.empty} />
            ) : (
              <ul className="divide-y divide-[#eaeaea]">
                {claims.map((c) => (
                  <li key={c.id}>
                    <Link href={portalPath(`/claims/${c.id}`)} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4 hover:bg-footer">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-charcoal">{c.insured}</p>
                        <p className="truncate text-[13px] text-body">
                          {broker.scope.spansBrokerages && `${names[c.brokerageId]} · `}{c.number} · {productName(c.productSlug)} · Lodged {formatDate(c.lodged)}
                        </p>
                      </div>
                      {c.claimed !== undefined && <span className="text-[14px] text-charcoal">{formatMoney(c.claimed)}</span>}
                      <StatusBadge status={c.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card>
            <CardHeader title={copy.online} />
            {online.length === 0 ? (
              <EmptyState title={copy.onlineEmpty} />
            ) : (
              <ul className="divide-y divide-[#eaeaea]">
                {online.map((a) => (
                  <li key={a.id}>
                    <Link href={portalPath(`/applications/${a.id}`)} className="flex items-center gap-4 px-6 py-4 hover:bg-footer">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-charcoal">{a.insuredName}</p>
                        <p className="truncate text-[13px] text-body">
                          {getForm(a.form)?.shortTitle} · {a.reference} · {formatDate(a.createdAt)}
                        </p>
                      </div>
                      <Icon name="arrow" className="h-4 w-4 text-site-teal" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
        <div className="space-y-6">
          {canPlace(broker.scope) && (
          <Card>
            <CardHeader title={copy.lodge.title} />
            <div className="px-6 py-5">
              <p className="text-[14px] leading-relaxed text-body">{copy.lodge.text}</p>
              <Link href={portalPath("/forms?type=claim")} className="mt-3 inline-flex items-center gap-2 text-[14px] font-medium text-site-teal hover:underline">
                {copy.lodge.forms} <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </Card>
          )}
          <Card>
            <CardHeader title={copy.emergency.title} />
            <div className="px-6 py-5">
              <p className="text-[14px] leading-relaxed text-body">{copy.emergency.text}</p>
              <a href={`mailto:${copy.emergency.email}`} className="mt-3 inline-flex items-center gap-2 text-[14px] text-site-teal hover:underline">
                <Icon name="mail" className="h-4 w-4" />
                {copy.emergency.email}
              </a>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
