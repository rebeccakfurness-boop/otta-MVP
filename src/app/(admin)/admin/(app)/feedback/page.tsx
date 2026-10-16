import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ButtonLink, Card, CardHeader, EmptyState, LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { feedbackCopy as copy } from "@/content/admin-feedback";
import { products } from "@/content/products";
import { requireAdmin } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/config";
import { complaintTargets, isOpenComplaint, listFeedback, nzToday } from "@/lib/feedback";
import { productName } from "@/lib/portal/products";
import { formatDate } from "@/lib/portal/status";
import { FeedbackBadges } from "./FeedbackBadges";
import { LogFeedbackForm } from "./FeedbackForms";

export const metadata: Metadata = { title: "Compliments and complaints" };

export default function FeedbackPage({ searchParams }: PageProps<"/admin/feedback">) {
  return (
    <Suspense fallback={<LoadingBlocks rows={6} />}>
      <Register searchParams={searchParams} />
    </Suspense>
  );
}

async function Register({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const [{ type }, all] = await Promise.all([searchParams, listFeedback()]);
  const filter = type === "compliment" || type === "complaint" ? type : "all";
  const today = nzToday();
  const year = today.slice(0, 4);
  const complaints = all.filter((f) => f.type === "complaint");
  const overdue = complaints.filter((f) => {
    const t = complaintTargets(f, today);
    return t.acknowledgeOverdue || t.resolveOverdue;
  }).length;
  const stats = [
    { label: copy.stats.compliments, value: all.filter((f) => f.type === "compliment" && f.receivedOn.startsWith(year)).length },
    { label: copy.stats.open, value: complaints.filter(isOpenComplaint).length },
    { label: copy.stats.overdue, value: overdue, alert: overdue > 0 },
    { label: copy.stats.resolved, value: complaints.filter((f) => f.resolvedOn?.startsWith(year)).length },
  ];
  const shown = filter === "all" ? all : all.filter((f) => f.type === filter);
  const tabs = (["all", "compliment", "complaint"] as const).map((t) => ({
    key: t,
    label: copy.tabs[t],
    count: t === "all" ? all.length : all.filter((f) => f.type === t).length,
    href: adminPath(t === "all" ? "/feedback" : `/feedback?type=${t}`),
  }));

  return (
    <>
      <PageHeader
        title={copy.title}
        description={copy.intro}
        actions={
          <ButtonLink href={adminPath("/feedback/export")} icon="download" variant="secondary" external>
            {copy.export}
          </ButtonLink>
        }
      />
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="px-5 py-4">
            <p className="text-[11px] font-semibold tracking-[0.1em] text-body uppercase">{s.label}</p>
            <p className={`mt-1 font-heading text-[30px] font-bold ${s.alert ? "text-site-purple" : "text-charcoal"}`}>{s.value}</p>
          </Card>
        ))}
      </div>
      <div className="space-y-8">
        <Card>
          <div className="flex flex-wrap gap-1 border-b border-[#eaeaea] px-4 pt-3">
            {tabs.map((t) => (
              <Link
                key={t.key}
                href={t.href}
                aria-current={filter === t.key ? "page" : undefined}
                className={`-mb-px border-b-2 px-3 pb-3 text-[14px] font-medium ${filter === t.key ? "border-site-teal text-charcoal" : "border-transparent text-body hover:text-site-teal"}`}
              >
                {t.label} <span className="text-body">({t.count})</span>
              </Link>
            ))}
          </div>
          {shown.length ? (
            <ul className="divide-y divide-[#eaeaea]">
              {shown.map((f) => (
                <li key={f.id}>
                  <Link href={adminPath(`/feedback/${f.id}`)} className="block px-6 py-5 hover:bg-[#fafafa]">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-charcoal">
                          {f.fromName}
                          {f.organisation && f.organisation !== f.fromName && <span className="font-normal text-body"> · {f.organisation}</span>}
                        </p>
                        <p className="text-[13px] text-body">
                          {f.reference} · {f.fromType} · {f.channel}
                          {f.productSlug && ` · ${productName(f.productSlug)}`}
                          {f.category && ` · ${f.category}`}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <FeedbackBadges entry={f} today={today} />
                        <span className="text-[13px] text-body">{formatDate(f.receivedOn)}</span>
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 border-l-2 border-[#eaeaea] pl-3 text-[14px] leading-relaxed text-charcoal">{f.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title={copy.empty.title}>{copy.empty.body}</EmptyState>
          )}
        </Card>
        <Card>
          <CardHeader title={copy.log} />
          <p className="px-6 pt-5 text-[14px] text-body">{copy.logIntro}</p>
          <LogFeedbackForm today={today} products={products.map((p) => ({ slug: p.slug, name: p.name }))} />
        </Card>
      </div>
    </>
  );
}
