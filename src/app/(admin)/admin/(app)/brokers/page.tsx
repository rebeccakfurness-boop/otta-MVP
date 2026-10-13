import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/config";
import { listBrokerages } from "@/lib/admin/data";
import { formatMoney, policyStatus } from "@/lib/portal/status";
import { BrokerSearch } from "./BrokerSearch";

export const metadata: Metadata = { title: "Brokers" };

export default function BrokersPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={6} />}>
      <Brokers />
    </Suspense>
  );
}

async function Brokers() {
  await requireAdmin();
  const brokers = await listBrokerages();
  const now = new Date();
  return (
    <>
      <PageHeader title="Brokers" description="Search for a brokerage or a broker by name or email, then open their records or see the portal exactly as they do." />
      <BrokerSearch
        brokers={brokers.map((b) => {
          const live = b.policies.filter((p) => policyStatus(p, now) !== "Expired");
          return {
            id: b.id,
            name: b.name,
            href: adminPath(`/brokers/${b.id}`),
            viewHref: adminPath(`/brokers/${b.id}/view`),
            domains: b.domains,
            users: b.users.map((u) => ({ name: u.name, email: u.email })),
            stats: [
              `${live.length} active ${live.length === 1 ? "policy" : "policies"}`,
              `${b.quoteCount} quote ${b.quoteCount === 1 ? "request" : "requests"}`,
              `${formatMoney(live.reduce((s, p) => s + p.premium, 0))} premium`,
            ],
          };
        })}
      />
    </>
  );
}
