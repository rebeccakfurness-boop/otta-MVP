import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BarList, chartColors, ColumnChart, Donut } from "@/components/admin/charts";
import { Card, CardHeader, LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { reporting as copy } from "@/content/admin-reporting";
import { products } from "@/content/products";
import { requireAdmin } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/config";
import { listAllPolicies, listBrokerages } from "@/lib/admin/data";
import { monthLabel, nextMonths, pastMonths, reportingData } from "@/lib/admin/reporting";
import { productName } from "@/lib/portal/products";
import { formatMoney, policyStatus } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Reporting" };

export default function ReportingPage(props: PageProps<"/admin/reporting">) {
  return (
    <Suspense fallback={<LoadingBlocks rows={10} />}>
      <Reporting searchParams={props.searchParams} />
    </Suspense>
  );
}

const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);
const shortMoney = (n: number) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}m` : n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`);

async function Reporting({ searchParams }: { searchParams: PageProps<"/admin/reporting">["searchParams"] }) {
  await requireAdmin();
  const sp = await searchParams;
  const now = new Date();
  const [allPolicies, brokers, data] = await Promise.all([listAllPolicies(), listBrokerages(), reportingData(now)]);
  const product = typeof sp.product === "string" && products.some((p) => p.slug === sp.product) ? sp.product : "";
  const brokerage = typeof sp.brokerage === "string" && brokers.some((b) => b.id === sp.brokerage) ? sp.brokerage : "";
  const keep = (r: { productSlug: string; brokerageId: string }) => (!product || r.productSlug === product) && (!brokerage || r.brokerageId === brokerage);

  // Book in force
  const live = allPolicies.filter((p) => policyStatus(p, now) !== "Expired" && keep(p));
  const book = live.reduce((s, p) => s + p.premium, 0);
  const byProduct = products
    .map((p, i) => {
      const ps = live.filter((x) => x.productSlug === p.slug);
      return { slug: p.slug, label: productName(p.slug), count: ps.length, value: ps.reduce((s, x) => s + x.premium, 0), color: chartColors[i % chartColors.length] };
    })
    .filter((r) => r.count > 0)
    .sort((a, b) => b.value - a.value);
  const byBrokerage = brokers
    .map((b) => {
      const ps = live.filter((x) => x.brokerageId === b.id);
      return { label: b.name, count: ps.length, value: ps.reduce((s, x) => s + x.premium, 0) };
    })
    .filter((r) => r.count > 0)
    .sort((a, b) => b.value - a.value);

  // Conversion: the 12 full months before this one, plus this month so far
  const months = pastMonths(now, 12);
  const quotes = data.quotes.filter((q) => keep(q) && months.includes(q.month));
  const perMonth = months.map((m) => {
    const qs = quotes.filter((q) => q.month === m);
    const bound = qs.filter((q) => q.outcome === "Bound").length;
    const decided = qs.filter((q) => q.outcome !== "Open").length;
    return { quoted: qs.length, bound, rate: decided ? (bound / decided) * 100 : null };
  });
  const bound = quotes.filter((q) => q.outcome === "Bound");
  const decided = quotes.filter((q) => q.outcome !== "Open").length;
  const open = quotes.length - decided;
  const priced = bound.filter((q) => q.premium > 0);
  const avgBound = priced.length ? Math.round(priced.reduce((s, q) => s + q.premium, 0) / priced.length) : 0;
  const conversionByProduct = products
    .map((p, i) => {
      const qs = quotes.filter((q) => q.productSlug === p.slug && q.outcome !== "Open");
      const b = qs.filter((q) => q.outcome === "Bound").length;
      return { label: productName(p.slug), value: pct(b, qs.length), display: `${pct(b, qs.length)}%`, sub: `(${b}/${qs.length})`, color: chartColors[i % chartColors.length], n: qs.length };
    })
    .filter((r) => r.n > 0)
    .sort((a, b) => b.value - a.value);

  // Renewals
  const renewals = data.renewals.filter(keep);
  const past = renewals.filter((r) => r.outcome !== "Upcoming" && months.includes(r.month));
  const renewedRows = past.filter((r) => r.outcome === "Renewed");
  const renewalMonths = months.map((m) => {
    const rs = past.filter((r) => r.month === m);
    const renewed = rs.filter((r) => r.outcome === "Renewed").length;
    return { renewed, lapsed: rs.length - renewed, rate: rs.length ? (renewed / rs.length) * 100 : null };
  });
  const change = renewedRows.length
    ? (renewedRows.reduce((s, r) => s + (r.renewedPremium ?? r.expiringPremium), 0) / renewedRows.reduce((s, r) => s + r.expiringPremium, 0) - 1) * 100
    : 0;
  const retentionByProduct = products
    .map((p, i) => {
      const rs = past.filter((r) => r.productSlug === p.slug);
      const kept = rs.filter((r) => r.outcome === "Renewed").length;
      return { label: productName(p.slug), value: pct(kept, rs.length), display: `${pct(kept, rs.length)}%`, sub: `(${kept}/${rs.length})`, color: chartColors[i % chartColors.length], n: rs.length };
    })
    .filter((r) => r.n > 0)
    .sort((a, b) => b.value - a.value);
  const ahead = nextMonths(now, 12);
  const upcoming = renewals.filter((r) => r.outcome === "Upcoming");
  const in90 = upcoming.filter((r) => ahead.slice(0, 3).includes(r.month));

  const tiles = [
    { label: copy.tiles.book, value: formatMoney(book), note: copy.tiles.bookNote(live.length) },
    { label: copy.tiles.conversion, value: `${pct(bound.length, decided)}%`, note: copy.tiles.conversionNote(quotes.length, bound.length) },
    { label: copy.tiles.retention, value: `${pct(renewedRows.length, past.length)}%`, note: copy.tiles.retentionNote(renewedRows.length, past.length) },
    { label: copy.tiles.upcoming, value: formatMoney(in90.reduce((s, r) => s + r.expiringPremium, 0)), note: copy.tiles.upcomingNote(in90.length) },
  ];

  const filterHref = (next: { product?: string; brokerage?: string }) => {
    const q = new URLSearchParams();
    const p = next.product ?? product;
    const b = next.brokerage ?? brokerage;
    if (p) q.set("product", p);
    if (b) q.set("brokerage", b);
    const s = q.toString();
    return adminPath(`/reporting${s ? `?${s}` : ""}`);
  };
  const chip = (active: boolean) =>
    `rounded-sm border px-3 py-1.5 text-[12px] whitespace-nowrap transition-colors ${active ? "border-site-teal bg-site-teal text-white" : "border-[#d9d9d9] bg-white text-charcoal hover:border-site-teal"}`;

  return (
    <>
      <PageHeader title={copy.title} description={copy.intro} />

      <div className="mb-8 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-24 text-[12px] font-semibold tracking-[0.1em] text-body uppercase">{copy.filters.product}</span>
          <Link href={filterHref({ product: "" })} className={chip(!product)}>
            {copy.filters.all}
          </Link>
          {products.map((p) => (
            <Link key={p.slug} href={filterHref({ product: p.slug })} className={chip(product === p.slug)}>
              {productName(p.slug).replace(" Insurance", "")}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-24 text-[12px] font-semibold tracking-[0.1em] text-body uppercase">{copy.filters.brokerage}</span>
          <Link href={filterHref({ brokerage: "" })} className={chip(!brokerage)}>
            {copy.filters.all}
          </Link>
          {brokers.map((b) => (
            <Link key={b.id} href={filterHref({ brokerage: b.id })} className={chip(brokerage === b.id)}>
              {b.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-sm border border-[#eaeaea] bg-white p-4 sm:p-6">
            <p className="text-[12px] leading-snug text-body sm:text-[13px]">{t.label}</p>
            <p className="mt-3 font-heading text-[26px] leading-none font-bold text-charcoal sm:text-[34px]">{t.value}</p>
            <p className="mt-2 text-[12px] text-body">{t.note}</p>
          </div>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader title={copy.book.title} />
        <div className="grid gap-8 px-6 py-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div>
            <Donut
              segments={byProduct.map((r) => ({ label: r.label, value: r.value, color: r.color }))}
              centre={shortMoney(book)}
              centreLabel={copy.tiles.book.toLowerCase()}
              summary={`${copy.book.title}: ${byProduct.map((r) => `${r.label} ${formatMoney(r.value)}`).join(", ")}`}
            />
          </div>
          <div className="space-y-8">
            <BarList rows={byProduct.map((r) => ({ label: r.label, value: r.value, display: formatMoney(r.value), sub: `(${r.count}, ${pct(r.value, book)}%)`, color: r.color }))} />
            {byBrokerage.length > 1 && (
              <div>
                <p className="mb-3 text-[12px] font-semibold tracking-[0.1em] text-body uppercase">{copy.book.byBrokerage}</p>
                <BarList rows={byBrokerage.map((r) => ({ label: r.label, value: r.value, display: formatMoney(r.value), sub: `(${r.count})`, color: "#014c69" }))} />
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="mt-6">
        <CardHeader title={copy.conversion.title} />
        <div className="grid gap-8 px-6 py-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <p className="mb-4 text-[13px] text-body">{copy.conversion.intro}</p>
            <ColumnChart
              labels={months.map(monthLabel)}
              series={[
                { name: copy.conversion.quoted, color: "#c9e6e1", values: perMonth.map((m) => m.quoted) },
                { name: copy.conversion.bound, color: "#2e7d74", values: perMonth.map((m) => m.bound) },
              ]}
              line={{ name: copy.conversion.rate, color: "#5e008d", values: perMonth.map((m) => m.rate) }}
              summary={`${copy.conversion.title}: ${quotes.length} quoted and ${bound.length} bound over 12 months, ${pct(bound.length, decided)}% conversion.`}
            />
          </div>
          <div>
            <p className="mb-3 text-[12px] font-semibold tracking-[0.1em] text-body uppercase">{copy.conversion.byProduct}</p>
            <BarList rows={conversionByProduct} />
            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-[#eaeaea] pt-5">
              <div>
                <dt className="text-[12px] text-body">{copy.conversion.average}</dt>
                <dd className="mt-1 font-heading text-[22px] font-bold text-charcoal">{formatMoney(avgBound)}</dd>
              </div>
              <div className="text-[13px] text-body">{copy.conversion.open(open)}</div>
            </dl>
          </div>
        </div>
      </Card>

      <Card className="mt-6">
        <CardHeader title={copy.renewals.title} />
        <div className="grid gap-8 px-6 py-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <p className="mb-4 text-[13px] text-body">{copy.renewals.intro}</p>
            <ColumnChart
              labels={months.map(monthLabel)}
              stacked
              series={[
                { name: copy.renewals.renewed, color: "#2e7d74", values: renewalMonths.map((m) => m.renewed) },
                { name: copy.renewals.lapsed, color: "#d7b8e6", values: renewalMonths.map((m) => m.lapsed) },
              ]}
              line={{ name: copy.renewals.rate, color: "#014c69", values: renewalMonths.map((m) => m.rate) }}
              summary={`${copy.renewals.title}: ${renewedRows.length} of ${past.length} policies renewed over 12 months.`}
            />
          </div>
          <div>
            <p className="mb-3 text-[12px] font-semibold tracking-[0.1em] text-body uppercase">{copy.renewals.byProduct}</p>
            <BarList rows={retentionByProduct} />
            <div className="mt-6 border-t border-[#eaeaea] pt-5">
              <p className="text-[12px] text-body">{copy.renewals.change}</p>
              <p className="mt-1 font-heading text-[22px] font-bold text-charcoal">
                {change >= 0 ? "+" : ""}
                {change.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-[#eaeaea] px-6 py-6">
          <p className="mb-4 text-[12px] font-semibold tracking-[0.1em] text-body uppercase">{copy.renewals.upcoming}</p>
          <ColumnChart
            labels={ahead.map(monthLabel)}
            series={[{ name: copy.renewals.upcomingSeries, color: "#61b9ad", values: ahead.map((m) => upcoming.filter((r) => r.month === m).reduce((s, r) => s + r.expiringPremium, 0)) }]}
            format={shortMoney}
            summary={`${copy.renewals.upcoming}: ${formatMoney(upcoming.reduce((s, r) => s + r.expiringPremium, 0))} across ${upcoming.length} policies.`}
          />
        </div>
      </Card>

      {data.sample && <p className="mt-6 text-[12px] text-body">{copy.sample}</p>}
    </>
  );
}
