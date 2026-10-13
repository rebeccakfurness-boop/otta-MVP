import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { products } from "@/content/products";
import { requireBroker } from "@/lib/portal/auth";
import { listForms } from "@/lib/portal/data";
import { FormsBrowser } from "./FormsBrowser";

export const metadata: Metadata = { title: "Forms" };

export default function FormsPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={8} />}>
      <Forms />
    </Suspense>
  );
}

async function Forms() {
  await requireBroker();
  const forms = await listForms();
  return (
    <>
      <PageHeader
        title="Forms"
        description="Every Otta form in one place. Filter by what you need to do or by product, then download."
      />
      <FormsBrowser forms={forms} products={products.map((p) => ({ slug: p.slug, name: p.name }))} />
    </>
  );
}
