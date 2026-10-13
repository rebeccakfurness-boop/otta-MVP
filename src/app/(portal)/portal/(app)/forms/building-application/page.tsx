import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { buildingApplication } from "@/content/building-application";
import { requireBroker } from "@/lib/portal/auth";
import { portalPath } from "@/lib/portal/config";
import { ApplicationForm } from "./ApplicationForm";

export const metadata: Metadata = { title: buildingApplication.shortTitle };

export default function BuildingApplicationPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={8} />}>
      <BuildingApplication />
    </Suspense>
  );
}

async function BuildingApplication() {
  const broker = await requireBroker();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Pacific/Auckland" }).format(new Date());
  return (
    <>
      <PageHeader
        back={{ href: portalPath("/forms"), label: "Forms" }}
        title={buildingApplication.title}
        description={buildingApplication.summary}
      />
      <ApplicationForm
        defaults={{ broker: broker.brokerageName, signedDate: today }}
        pdfUrl={portalPath("/forms/building-application/pdf")}
        formsUrl={portalPath("/forms")}
      />
    </>
  );
}
