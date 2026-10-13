import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Icon, type IconName } from "@/components/portal/Icon";
import { Card, CardHeader, EmptyState, LoadingBlocks, StatusBadge } from "@/components/portal/ui";
import { requireBroker } from "@/lib/portal/auth";
import { portalPath } from "@/lib/portal/config";
import { listPolicies, listQuotes } from "@/lib/portal/data";
import { productName } from "@/lib/portal/products";
import { daysUntil, formatDate, policyStatus } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={6} />}>
      <Dashboard />
    </Suspense>
  );
}

const quickForms: { label: string; description: string; type: string; icon: IconName }[] = [
  { label: "Proposal forms", description: "Apply for new cover", type: "proposal", icon: "plus" },
  { label: "Renewal declarations", description: "Renew an existing policy", type: "renewal", icon: "renew" },
  { label: "Claim forms", description: "Lodge a claim", type: "claim", icon: "claim" },
  { label: "General forms", description: "Changes and cancellations", type: "general", icon: "forms" },
];

async function Dashboard() {
  const user = await requireBroker();
  const [quotes, policies] = await Promise.all([listQuotes(user.brokerageId), listPolicies(user.brokerageId)]);
  const now = new Date();
  const open = quotes.filter((q) => q.status === "Submitted" || q.status === "In review" || q.status === "Quoted");
  const active = policies.filter((p) => policyStatus(p, now) !== "Expired");
  const renewals = policies.filter((p) => policyStatus(p, now) === "Renewal due");
  const firstName = user.name.split(" ")[0];

  const stats = [
    { label: "Open quote requests", value: open.length, href: portalPath("/quotes"), icon: "quotes" as const },
    { label: "Active policies", value: active.length, href: portalPath("/policies"), icon: "policies" as const },
    { label: "Renewals due in 60 days", value: renewals.length, href: portalPath("/policies?status=renewal"), icon: "calendar" as const },
  ];

  return (
    <>
      <div className="mb-10">
        <p className="text-[12px] font-semibold tracking-[0.2em] text-site-teal uppercase">{user.brokerageName}</p>
        <h1 className="mt-2 text-[30px] font-bold tracking-[-0.02em] text-charcoal md:text-[36px]">Kia ora, {firstName}</h1>
        <p className="mt-2 text-[15px] text-body">Here&apos;s what&apos;s happening with your Otta business.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group rounded-sm border border-[#eaeaea] bg-white p-4 transition-colors hover:border-site-teal sm:p-6">
            <div className="flex items-center justify-between text-body">
              <span className="text-[12px] leading-snug sm:text-[13px]">{s.label}</span>
              <Icon name={s.icon} className="hidden h-5 w-5 shrink-0 text-site-teal sm:block" />
            </div>
            <p className="mt-3 font-heading text-[30px] leading-none font-bold text-charcoal sm:text-[40px]">{s.value}</p>
            <span className="mt-4 hidden items-center gap-1 text-[12px] sm:inline-flex font-medium tracking-[0.1em] text-site-teal uppercase">
              View <Icon name="arrow" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 mb-4 font-heading text-[20px] font-semibold tracking-normal text-charcoal">Forms</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickForms.map((f) => (
          <Link
            key={f.type}
            href={portalPath(`/forms?type=${f.type}`)}
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

      <div className="mt-12 grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader
            title="Recent quote requests"
            action={
              <Link href={portalPath("/quotes")} className="text-[12px] font-medium tracking-[0.1em] text-site-teal uppercase hover:underline">
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
                  <Link href={portalPath(`/quotes/${q.ref}`)} className="flex items-center gap-4 px-6 py-4 hover:bg-footer">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-medium text-charcoal">{q.insured}</p>
                      <p className="truncate text-[13px] text-body">
                        {q.ref} · {productName(q.productSlug)} · {formatDate(q.submitted)}
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
                  <Link href={portalPath(`/policies/${p.id}`)} className="flex items-center gap-4 px-6 py-4 hover:bg-footer">
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
