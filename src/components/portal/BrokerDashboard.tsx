import Link from "next/link";
import { Icon, type IconName } from "./Icon";
import { Card, CardHeader, EmptyState, StatusBadge } from "./ui";
import { productName } from "@/lib/portal/products";
import { daysUntil, formatDate, formatMoney, policyStatus } from "@/lib/portal/status";
import { portalBook } from "@/content/portal-pages";
import { products } from "@/content/products";
import type { Policy, QuoteRequest } from "@/lib/portal/types";

export type DashboardLinks = {
  quotes: string;
  policies: string;
  renewals: string;
  quote: (ref: string) => string;
  policy: (id: string) => string;
  forms: (type: string) => string;
};

const quickForms: { label: string; description: string; type: string; icon: IconName }[] = [
  { label: "Proposal forms", description: "Apply for new cover", type: "proposal", icon: "plus" },
  { label: "Renewal declarations", description: "Renew an existing policy", type: "renewal", icon: "renew" },
  { label: "Claim forms", description: "Lodge a claim", type: "claim", icon: "claim" },
  { label: "General forms", description: "Changes and cancellations", type: "general", icon: "forms" },
];

/** The broker dashboard. Rendered in the broker portal and in the admin "broker view". */
export function BrokerDashboard({
  brokerageName,
  firstName,
  quotes,
  policies,
  now,
  links,
  placesBusiness = true,
  brokerageNames,
}: {
  brokerageName: string;
  firstName: string;
  quotes: QuoteRequest[];
  policies: Policy[];
  now: Date;
  links: DashboardLinks;
  /** False for networks and coverholders: no forms shortcuts. */
  placesBusiness?: boolean;
  /** Set when the records span several brokerages, so each row names its brokerage. */
  brokerageNames?: Record<string, string>;
}) {
  const open = quotes.filter((q) => q.status === "Submitted" || q.status === "In review" || q.status === "Quoted");
  const active = policies.filter((p) => policyStatus(p, now) !== "Expired");
  const renewals = policies.filter((p) => policyStatus(p, now) === "Renewal due");

  const book = active.reduce((sum, p) => sum + p.premium, 0);
  const byProduct = products
    .map((p) => {
      const ps = active.filter((x) => x.productSlug === p.slug);
      return { slug: p.slug, name: productName(p.slug), count: ps.length, premium: ps.reduce((sum, x) => sum + x.premium, 0) };
    })
    .filter((r) => r.count > 0)
    .sort((a, b) => b.premium - a.premium);
  const maxPremium = Math.max(1, ...byProduct.map((r) => r.premium));

  const stats = [
    { label: portalBook.tile, value: formatMoney(book), href: links.policies, icon: "money" as const },
    { label: "Open quote requests", value: open.length, href: links.quotes, icon: "quotes" as const },
    { label: "Active policies", value: active.length, href: links.policies, icon: "policies" as const },
    { label: "Renewals due in 60 days", value: renewals.length, href: links.renewals, icon: "calendar" as const },
  ];

  return (
    <>
      <div className="mb-10">
        <p className="text-[12px] font-semibold tracking-[0.2em] text-site-teal uppercase">{brokerageName}</p>
        <h1 className="mt-2 text-[30px] font-bold tracking-[-0.02em] text-charcoal md:text-[36px]">Kia ora, {firstName}</h1>
        <p className="mt-2 text-[15px] text-body">Here&apos;s what&apos;s happening with your Otta business.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group rounded-sm border border-[#eaeaea] bg-white p-4 transition-colors hover:border-site-teal sm:p-6">
            <div className="flex items-center justify-between text-body">
              <span className="text-[12px] leading-snug sm:text-[13px]">{s.label}</span>
              <Icon name={s.icon} className="hidden h-5 w-5 shrink-0 text-site-teal sm:block" />
            </div>
            <p className="mt-3 font-heading text-[26px] leading-none font-bold text-charcoal sm:text-[36px]">{s.value}</p>
            <span className="mt-4 hidden items-center gap-1 text-[12px] sm:inline-flex font-medium tracking-[0.1em] text-site-teal uppercase">
              View <Icon name="arrow" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader
          title={portalBook.title}
          action={<span className="text-[12px] text-body">{portalBook.tileNote(active.length)}</span>}
        />
        {byProduct.length === 0 ? (
          <EmptyState title={portalBook.empty} />
        ) : (
          <ul className="space-y-3 px-6 py-6">
            <li className="pb-1 text-[13px] text-body">{portalBook.intro}</li>
            {byProduct.map((r) => (
              <li key={r.slug} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 sm:grid-cols-[minmax(0,280px)_minmax(0,1fr)_100px]">
                <span className="truncate text-[14px] text-charcoal">
                  {r.name} <span className="text-body">({r.count})</span>
                </span>
                <span className="order-3 col-span-2 h-3 rounded-sm bg-[#efefef] sm:order-none sm:col-span-1">
                  <span className="block h-3 rounded-sm bg-site-teal" style={{ width: `${(r.premium / maxPremium) * 100}%` }} />
                </span>
                <span className="text-right text-[14px] font-semibold text-charcoal">{formatMoney(r.premium)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {placesBusiness && (
      <>
      <h2 className="mt-12 mb-4 font-heading text-[20px] font-semibold tracking-normal text-charcoal">Forms</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickForms.map((f) => (
          <Link
            key={f.type}
            href={links.forms(f.type)}
            className="group flex items-center gap-4 rounded-sm bg-site-teal p-5 text-white transition-colors hover:bg-[#4fa99c]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/70">
              <Icon name={f.icon} />
            </span>
            <span>
              <span className="block font-heading text-[16px] font-bold">{f.label}</span>
              <span className="block text-[13px] text-white/85">{f.description}</span>
            </span>
          </Link>
        ))}
      </div>
      </>
      )}

      <div className="mt-12 grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader
            title="Recent quote requests"
            action={
              <Link href={links.quotes} className="text-[12px] font-medium tracking-[0.1em] text-site-teal uppercase hover:underline">
                View all
              </Link>
            }
          />
          {quotes.length === 0 ? (
            <EmptyState title="No quote requests yet" />
          ) : (
            <ul className="divide-y divide-[#eaeaea]">
              {quotes.slice(0, 5).map((q) => (
                <li key={q.ref}>
                  <Link href={links.quote(q.ref)} className="flex items-center gap-4 px-6 py-4 hover:bg-footer">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-medium text-charcoal">{q.insured}</p>
                      <p className="truncate text-[13px] text-body">
                        {brokerageNames && `${brokerageNames[q.brokerageId]} · `}{q.ref} · {productName(q.productSlug)} · {formatDate(q.submitted)}
                      </p>
                    </div>
                    <StatusBadge status={q.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader title="Renewals coming up" />
          {renewals.length === 0 ? (
            <EmptyState title="No renewals due">Policies due for renewal in the next 60 days appear here.</EmptyState>
          ) : (
            <ul className="divide-y divide-[#eaeaea]">
              {renewals.map((p) => (
                <li key={p.id}>
                  <Link href={links.policy(p.id)} className="flex items-center gap-4 px-6 py-4 hover:bg-footer">
                    <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-sm bg-[#f1e6f5] text-site-purple">
                      <span className="font-heading text-[17px] leading-none font-bold">{daysUntil(p.end, now)}</span>
                      <span className="text-[9px] font-semibold tracking-wider uppercase">days</span>
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-medium text-charcoal">{p.insured}</p>
                      <p className="truncate text-[13px] text-body">
                        {p.number} · expires {formatDate(p.end)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
