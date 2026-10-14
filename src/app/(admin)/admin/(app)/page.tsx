import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Icon } from "@/components/portal/Icon";
import { Card, CardHeader, EmptyState, LoadingBlocks, StatusBadge } from "@/components/portal/ui";
import { products } from "@/content/products";
import { requireAdmin } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/config";
import { brokerageNames, listAllPolicies, listAllQuotes, listBrokerages } from "@/lib/admin/data";
import { getForm } from "@/content/forms";
import { applicationChannel, applicationStatus } from "@/lib/applications/labels";
import { listApplications } from "@/lib/applications/store";
import { CelebrationPreview } from "@/components/admin/ActivityCelebration";
import { activityLabel, listActivity, type ActivityKind } from "@/lib/activity";
import { listEnquiries } from "@/lib/enquiries";
import { listAccessRequests } from "@/lib/portal/accounts";
import { productName } from "@/lib/portal/products";
import { daysUntil, formatDate, formatMoney, policyStatus } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Overview" };

export default function OverviewPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={8} />}>
      <Overview />
    </Suspense>
  );
}

const pipeline = [
  { status: "Submitted", key: "open" },
  { status: "In review", key: "open" },
  { status: "Quoted", key: "quoted" },
  { status: "Bound", key: "bound" },
  { status: "Declined", key: "declined" },
] as const;

async function Overview() {
  const admin = await requireAdmin();
  const [policies, quotes, brokers, names, applications, accessRequests, enquiries, activity] = await Promise.all([
    listAllPolicies(),
    listAllQuotes(),
    listBrokerages(),
    brokerageNames(),
    listApplications(),
    listAccessRequests(),
    listEnquiries(),
    listActivity({ limit: 8 }),
  ]);
  const openEnquiries = enquiries.filter((e) => !e.handledAt).length;
  const waiting = accessRequests.filter((r) => r.status === "pending").length;
  const now = new Date();
  const statusOf = new Map(policies.map((p) => [p.id, policyStatus(p, now)]));
  const live = policies.filter((p) => statusOf.get(p.id) !== "Expired");
  const renewals = policies.filter((p) => statusOf.get(p.id) === "Renewal due");
  const open = quotes.filter((q) => ["Submitted", "In review", "Quoted"].includes(q.status));
  const premium = live.reduce((sum, p) => sum + p.premium, 0);

  const tiles = [
    { label: "Active policies", value: String(live.length), href: adminPath("/policies?status=active"), icon: "policies" as const },
    { label: "Renewals due in 60 days", value: String(renewals.length), href: adminPath("/policies?status=renewal"), icon: "calendar" as const },
    { label: "Open quote requests", value: String(open.length), href: adminPath("/quotes?status=open"), icon: "quotes" as const },
    { label: "Annual premium in force", value: formatMoney(premium), href: adminPath("/policies?status=active"), icon: "money" as const },
  ];

  const byProduct = products.map((p) => {
    const ps = live.filter((x) => x.productSlug === p.slug);
    return {
      slug: p.slug,
      name: p.name,
      active: ps.length,
      renewals: ps.filter((x) => statusOf.get(x.id) === "Renewal due").length,
      openQuotes: open.filter((q) => q.productSlug === p.slug).length,
      premium: ps.reduce((sum, x) => sum + x.premium, 0),
    };
  });
  const maxPipeline = Math.max(1, ...pipeline.map((s) => quotes.filter((q) => q.status === s.status).length));
  const ihq = [...policies, ...quotes].filter((r) => r.source === "ihq").length;
  const manual = policies.length + quotes.length - ihq;
  const cell = "px-5 py-3.5";

  return (
    <>
      <div className="mb-10">
        <p className="text-[12px] font-semibold tracking-[0.2em] text-site-blue uppercase">Otta admin</p>
        <h1 className="mt-2 text-[30px] font-bold tracking-[-0.02em] text-charcoal md:text-[36px]">Overview</h1>
        <p className="mt-2 text-[15px] text-body">
          Kia ora {admin.name.split(" ")[0]}. The whole book across {brokers.length} brokerages, as at {formatDate(now.toISOString())}.
        </p>
      </div>

      {waiting > 0 && (
        <Link
          href={adminPath("/access-requests")}
          className="mb-8 flex items-center justify-between gap-4 border-l-4 border-site-teal bg-[#f1f8f7] px-5 py-4 text-[14px] text-charcoal hover:bg-[#e6f4f2]"
        >
          <span>
            <strong className="font-semibold">{waiting === 1 ? "1 broker is" : `${waiting} brokers are`}</strong> waiting for portal access.
          </span>
          <span className="inline-flex items-center gap-1 text-[12px] font-medium tracking-[0.1em] text-[#2e7d74] uppercase">
            Review <Icon name="arrow" className="h-3.5 w-3.5" />
          </span>
        </Link>
      )}

      {openEnquiries > 0 && (
        <Link
          href={adminPath("/enquiries")}
          className="mb-8 flex items-center justify-between gap-4 border-l-4 border-site-teal bg-[#f1f8f7] px-5 py-4 text-[14px] text-charcoal hover:bg-[#e6f4f2]"
        >
          <span>
            <strong className="font-semibold">{openEnquiries === 1 ? "1 website enquiry" : `${openEnquiries} website enquiries`}</strong> waiting for a reply.
          </span>
          <span className="inline-flex items-center gap-1 text-[12px] font-medium tracking-[0.1em] text-[#2e7d74] uppercase">
            View <Icon name="arrow" className="h-3.5 w-3.5" />
          </span>
        </Link>
      )}

      <LiveActivity events={activity} />

      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="group rounded-sm border border-[#eaeaea] bg-white p-4 transition-colors hover:border-site-teal sm:p-6">
            <div className="flex items-center justify-between text-body">
              <span className="text-[12px] leading-snug sm:text-[13px]">{t.label}</span>
              <Icon name={t.icon} className="hidden h-5 w-5 shrink-0 text-site-teal sm:block" />
            </div>
            <p className="mt-3 font-heading text-[26px] leading-none font-bold text-charcoal sm:text-[34px]">{t.value}</p>
            <span className="mt-4 hidden items-center gap-1 text-[12px] font-medium tracking-[0.1em] text-site-teal uppercase sm:inline-flex">
              View <Icon name="arrow" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <Card className="mt-10">
        <CardHeader
          title="Active book by product"
          action={
            <Link href={adminPath("/reporting")} className="text-[12px] font-medium tracking-[0.1em] text-site-teal uppercase hover:underline">
              Reporting
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[14px]">
            <thead>
              <tr className="border-b border-[#eaeaea] text-[11px] font-semibold tracking-[0.1em] text-body uppercase">
                <th className={cell}>Product</th>
                <th className={`${cell} text-right`}>Active policies</th>
                <th className={`${cell} text-right`}>Renewals due</th>
                <th className={`${cell} text-right`}>Open quotes</th>
                <th className={`${cell} text-right`}>Premium in force</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaeaea]">
              {byProduct.map((r) => (
                <tr key={r.slug} className="hover:bg-footer">
                  <td className={`${cell} font-medium text-charcoal`}>
                    <Link href={adminPath(`/policies?product=${r.slug}`)} className="hover:text-site-teal">
                      {r.name}
                    </Link>
                  </td>
                  <td className={`${cell} text-right`}>
                    <Link href={adminPath(`/policies?product=${r.slug}&status=active`)} className="font-semibold text-site-teal hover:underline">
                      {r.active}
                    </Link>
                  </td>
                  <td className={`${cell} text-right`}>
                    <Link href={adminPath(`/policies?product=${r.slug}&status=renewal`)} className={r.renewals ? "font-semibold text-site-purple hover:underline" : "text-body"}>
                      {r.renewals}
                    </Link>
                  </td>
                  <td className={`${cell} text-right`}>
                    <Link href={adminPath(`/quotes?product=${r.slug}&status=open`)} className="font-semibold text-site-teal hover:underline">
                      {r.openQuotes}
                    </Link>
                  </td>
                  <td className={`${cell} text-right text-charcoal`}>{formatMoney(r.premium)}</td>
                </tr>
              ))}
              <tr className="bg-footer font-semibold text-charcoal">
                <td className={cell}>Total</td>
                <td className={`${cell} text-right`}>{live.length}</td>
                <td className={`${cell} text-right`}>{renewals.length}</td>
                <td className={`${cell} text-right`}>{open.length}</td>
                <td className={`${cell} text-right`}>{formatMoney(premium)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Quote pipeline" />
          <ul className="space-y-3 px-6 py-6">
            {pipeline.map((s) => {
              const count = quotes.filter((q) => q.status === s.status).length;
              return (
                <li key={s.status}>
                  <Link href={adminPath(`/quotes?status=${s.key}`)} className="group grid grid-cols-[110px_1fr_32px] items-center gap-3">
                    <span className="text-[14px] text-charcoal group-hover:text-site-teal">{s.status}</span>
                    <span className="h-3 rounded-sm bg-[#efefef]">
                      <span className="block h-3 rounded-sm bg-site-teal" style={{ width: `${(count / maxPipeline) * 100}%` }} />
                    </span>
                    <span className="text-right text-[14px] font-semibold text-charcoal">{count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card>
          <CardHeader
            title="Where the data comes from"
            action={
              <Link href={adminPath("/data-sources")} className="text-[12px] font-medium tracking-[0.1em] text-site-teal uppercase hover:underline">
                Data sources
              </Link>
            }
          />
          <div className="grid grid-cols-2 divide-x divide-[#eaeaea]">
            <div className="px-6 py-6">
              <p className="text-[13px] text-body">Synced from InsuredHQ</p>
              <p className="mt-2 font-heading text-[34px] leading-none font-bold text-site-blue">{ihq}</p>
              <p className="mt-2 text-[12px] text-body">policies and quotes</p>
            </div>
            <div className="px-6 py-6">
              <p className="text-[13px] text-body">Manual entry</p>
              <p className="mt-2 font-heading text-[34px] leading-none font-bold text-[#7a6a3a]">{manual}</p>
              <p className="mt-2 text-[12px] text-body">policies and quotes</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Renewals due" />
          {renewals.length === 0 ? (
            <EmptyState title="No renewals due in the next 60 days" />
          ) : (
            <ul className="divide-y divide-[#eaeaea]">
              {renewals.map((p) => (
                <li key={p.id}>
                  <Link href={adminPath(`/policies/${p.id}`)} className="flex items-center gap-4 px-6 py-4 hover:bg-footer">
                    <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-sm bg-[#f1e6f5] text-site-purple">
                      <span className="font-heading text-[17px] leading-none font-bold">{daysUntil(p.end, now)}</span>
                      <span className="text-[9px] font-semibold tracking-wider uppercase">days</span>
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-medium text-charcoal">{p.insured}</p>
                      <p className="truncate text-[13px] text-body">
                        {names[p.brokerageId]} · {productName(p.productSlug)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <CardHeader
            title="Latest quote requests"
            action={
              <Link href={adminPath("/quotes")} className="text-[12px] font-medium tracking-[0.1em] text-site-teal uppercase hover:underline">
                View all
              </Link>
            }
          />
          <ul className="divide-y divide-[#eaeaea]">
            {quotes.slice(0, 5).map((q) => (
              <li key={q.ref}>
                <Link href={adminPath(`/quotes/${q.ref}`)} className="flex items-center gap-4 px-6 py-4 hover:bg-footer">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium text-charcoal">{q.insured}</p>
                    <p className="truncate text-[13px] text-body">
                      {names[q.brokerageId]} · {productName(q.productSlug)} · {formatDate(q.submitted)}
                    </p>
                  </div>
                  <StatusBadge status={q.status} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Latest online applications"
          action={
            <Link href={adminPath("/applications")} className="text-[12px] font-medium tracking-[0.1em] text-site-teal uppercase hover:underline">
              View all
            </Link>
          }
        />
        {applications.length === 0 ? (
          <EmptyState title="No online applications yet">Applications from brokers, their clients and the website appear here.</EmptyState>
        ) : (
          <ul className="divide-y divide-[#eaeaea]">
            {applications.slice(0, 5).map((a) => (
              <li key={a.id}>
                <Link href={adminPath(`/applications/${a.id}`)} className="flex items-center gap-4 px-6 py-4 hover:bg-footer">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium text-charcoal">{a.insuredName}</p>
                    <p className="truncate text-[13px] text-body">
                      {getForm(a.form)?.shortTitle} · {applicationChannel(a, names)} · {formatDate(a.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={applicationStatus(a)} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

const kindTone: Record<ActivityKind, string> = {
  enquiry: "bg-[#e6f4f2] text-[#2e7d74]",
  quote: "bg-site-teal text-white",
  renewal: "bg-[#efefef] text-[#555]",
  claim: "bg-[#f8f1fa] text-site-purple",
  bind: "bg-site-blue text-white",
};

/** What has just come in: enquiries, quote requests, renewals, claims and bind instructions. New ones also pop with confetti. */
function LiveActivity({ events }: { events: Awaited<ReturnType<typeof listActivity>> }) {
  return (
    <Card className="mb-10">
      <CardHeader
        title="Live activity"
        action={
          <span className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[12px] text-body">
              <span aria-hidden className="h-2 w-2 animate-pulse rounded-full bg-site-teal" />
              Updates as things come in
            </span>
            <CelebrationPreview />
          </span>
        }
      />
      {events.length === 0 ? (
        <EmptyState title="Nothing yet">New enquiries, quote requests and bind instructions appear here, with a little celebration.</EmptyState>
      ) : (
        <ul className="divide-y divide-[#eaeaea]">
          {events.map((e) => (
            <li key={e.id}>
              <Link href={adminPath(e.path)} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-6 py-3.5 hover:bg-footer">
                <span className={`w-44 shrink-0 rounded-sm px-2 py-1 text-center text-[11px] font-semibold tracking-[0.06em] uppercase ${kindTone[e.kind]}`}>
                  {activityLabel[e.kind]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium text-charcoal">{e.title}</span>
                  <span className="block truncate text-[13px] text-body">{e.detail}</span>
                </span>
                <span className="text-[12px] whitespace-nowrap text-body">
                  {new Date(e.createdAt).toLocaleString("en-NZ", { timeZone: "Pacific/Auckland", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
