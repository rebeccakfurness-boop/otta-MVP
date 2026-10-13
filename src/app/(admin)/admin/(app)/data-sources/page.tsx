import type { Metadata } from "next";
import { Suspense } from "react";
import { Icon } from "@/components/portal/Icon";
import { Card, CardHeader, LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { listAllPolicies, listAllQuotes } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Data sources" };

export default function DataSourcesPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={6} />}>
      <DataSources />
    </Suspense>
  );
}

async function DataSources() {
  await requireAdmin();
  const [policies, quotes] = await Promise.all([listAllPolicies(), listAllQuotes()]);
  const count = (source: "ihq" | "manual") => ({
    policies: policies.filter((p) => p.source === source).length,
    quotes: quotes.filter((q) => q.source === source).length,
  });
  const ihq = count("ihq");
  const manual = count("manual");

  return (
    <>
      <PageHeader
        title="Data sources"
        description="Both portals read from one shared store. Records arrive from InsuredHQ or from manual entry by the Otta team, and brokers see them straight away."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="InsuredHQ" action={<span className="rounded-sm bg-[#f1e6f5] px-2 py-1 text-[11px] font-semibold tracking-[0.06em] text-site-purple uppercase">Not connected</span>} />
          <div className="space-y-4 px-6 py-6 text-[14px] leading-relaxed text-body">
            <p>
              {ihq.policies} policies and {ihq.quotes} quote requests are marked as coming from InsuredHQ (demo data).
            </p>
            <p>Once connected through the InsuredHQ API (IHQ-API):</p>
            <ul className="space-y-2">
              {[
                "Policies, quotes and documents sync into the portals automatically",
                "Proposal forms submitted in the broker portal create draft quotes in InsuredHQ",
                "Status changes in InsuredHQ show up for brokers without re-keying",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <Icon name="sync" className="mt-0.5 h-4 w-4 shrink-0 text-site-teal" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="text-[13px]">Needs: InsuredHQ API access, documentation and a test environment.</p>
          </div>
        </Card>
        <Card>
          <CardHeader title="Manual entry" action={<span className="rounded-sm bg-[#efefef] px-2 py-1 text-[11px] font-semibold tracking-[0.06em] text-[#555] uppercase">Needs database</span>} />
          <div className="space-y-4 px-6 py-6 text-[14px] leading-relaxed text-body">
            <p>
              {manual.policies} policies and {manual.quotes} quote requests are marked as manually entered (demo data).
            </p>
            <p>
              For business that isn&apos;t in InsuredHQ, the Otta team will add and update policies, quotes and documents here. Adding and
              editing records switches on when the database (Neon Postgres) and document storage (Vercel Blob) are connected.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
