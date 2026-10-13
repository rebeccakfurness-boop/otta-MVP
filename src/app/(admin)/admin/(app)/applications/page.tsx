import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Card, EmptyState, LoadingBlocks, PageHeader, StatusBadge } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/config";
import { brokerageNames } from "@/lib/admin/data";
import { listApplications, storageMode } from "@/lib/applications/store";
import { formatDate } from "@/lib/portal/status";

export const metadata: Metadata = { title: "Applications" };

export default function AdminApplicationsPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={6} />}>
      <Applications />
    </Suspense>
  );
}

async function Applications() {
  await requireAdmin();
  const [apps, names] = await Promise.all([listApplications(), brokerageNames()]);
  return (
    <>
      <PageHeader
        title="Applications"
        description="Online building insurance applications from every broker, including those completed by clients from a broker's link."
      />
      {storageMode === "memory" && (
        <p className="mb-6 border-l-4 border-site-purple bg-[#f8f1fa] px-4 py-3 text-[13px] text-site-purple">
          Demo storage: applications are kept in memory until a Neon database is connected (DATABASE_URL), so this list resets
          when the server restarts. Every application is still emailed with its PDF.
        </p>
      )}
      <Card>
        {apps.length === 0 ? (
          <EmptyState title="No applications yet" />
        ) : (
          <ul className="divide-y divide-[#f0f0f0]">
            {apps.map((a) => (
              <li key={a.id}>
                <Link href={adminPath(`/applications/${a.id}`)} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4 hover:bg-footer">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-charcoal">{a.insuredName}</p>
                    <p className="truncate text-[13px] text-body">
                      {a.propertyAddress} · {a.reference}
                    </p>
                  </div>
                  <span className="text-[13px] text-body">
                    {names[a.brokerageId] ?? a.brokerageId} · {a.brokerName} · {formatDate(a.createdAt)}
                  </span>
                  <StatusBadge status={a.source === "client" ? "Completed by client" : "Sent to Otta"} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
