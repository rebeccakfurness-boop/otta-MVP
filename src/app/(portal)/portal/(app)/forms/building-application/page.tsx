import type { Metadata } from "next";
import { Suspense } from "react";
import { ButtonLink, LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { buildingApplication } from "@/content/building-application";
import { requireBroker } from "@/lib/portal/auth";
import { portalPath } from "@/lib/portal/config";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { submitBuildingApplication } from "./actions";

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
        actions={
          <ButtonLink href={portalPath("/applications/send")} variant="secondary" icon="send">
            Send to a client instead
          </ButtonLink>
        }
      />
      <ApplicationForm
        audience="broker"
        action={submitBuildingApplication}
        defaults={{ broker: broker.brokerageName, signedDate: today }}
        pdfUrl={portalPath("/forms/building-application/pdf")}
        addressUrl={portalPath("/address-search")}
        links={{
          back: { href: portalPath("/applications"), label: "All applications" },
          applicationsBase: portalPath("/applications"),
        }}
      />
    </>
  );
}
