import type { Metadata } from "next";
import { Suspense } from "react";
import { BrokerDashboard } from "@/components/portal/BrokerDashboard";
import { LoadingBlocks } from "@/components/portal/ui";
import { requireBroker } from "@/lib/portal/auth";
import { portalPath } from "@/lib/portal/config";
import { listPolicies, listQuotes, organisationNames } from "@/lib/portal/data";
import { canPlace } from "@/lib/portal/scope";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={6} />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const user = await requireBroker();
  const [quotes, policies, names] = await Promise.all([listQuotes(user.scope), listPolicies(user.scope), organisationNames()]);
  return (
    <BrokerDashboard
      brokerageName={user.brokerageName}
      firstName={user.name.split(" ")[0]}
      quotes={quotes}
      policies={policies}
      now={new Date()}
      placesBusiness={canPlace(user.scope)}
      brokerageNames={user.scope.spansBrokerages ? names : undefined}
      links={{
        quotes: portalPath("/quotes"),
        policies: portalPath("/policies"),
        renewals: portalPath("/policies?status=renewal"),
        quote: (ref) => portalPath(`/quotes/${ref}`),
        policy: (id) => portalPath(`/policies/${id}`),
        forms: (type) => portalPath(`/forms?type=${type}`),
      }}
    />
  );
}
