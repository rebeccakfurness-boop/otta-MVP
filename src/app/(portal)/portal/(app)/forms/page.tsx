import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { onlineForms } from "@/content/forms";
import { portalPath } from "@/lib/portal/config";
import { products } from "@/content/products";
import { requirePlacingBroker } from "@/lib/portal/auth";
import { listForms } from "@/lib/portal/data";
import { FormsBrowser } from "./FormsBrowser";

export const metadata: Metadata = { title: "Forms" };

const formType = { "proposal-forms": "Proposal form", "renewal-declarations": "Renewal declaration", "claim-forms": "Claim form" } as const;

export default function FormsPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={8} />}>
      <Forms />
    </Suspense>
  );
}

async function Forms() {
  await requirePlacingBroker();
  const forms = await listForms();
  return (
    <>
      <PageHeader
        title="Forms"
        description="Every Otta form in one place, by what you need to do. Fill in a form online (or send it to your client), or download the PDF."
      />
      <FormsBrowser
        forms={forms}
        online={onlineForms.map((f) => ({
          id: f.id,
          title: f.title,
          summary: f.summary,
          type: formType[f.resource ?? "proposal-forms"],
          productSlugs: f.productSlugs,
          href: portalPath(`/forms/${f.slug}`),
          sendHref: portalPath(`/applications/send?form=${f.id}`),
        }))}
        products={products.map((p) => ({ slug: p.slug, name: p.name }))}
      />
    </>
  );
}
