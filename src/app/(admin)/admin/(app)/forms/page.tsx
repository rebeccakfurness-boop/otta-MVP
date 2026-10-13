import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { products } from "@/content/products";
import { requireAdmin } from "@/lib/admin/auth";
import { listAllForms } from "@/lib/admin/data";
import { FormsBrowser } from "@/app/(portal)/portal/(app)/forms/FormsBrowser";

export const metadata: Metadata = { title: "Forms" };

export default function AdminFormsPage() {
  return (
    <Suspense fallback={<LoadingBlocks rows={8} />}>
      <Forms />
    </Suspense>
  );
}

async function Forms() {
  await requireAdmin();
  const forms = await listAllForms();
  return (
    <>
      <PageHeader title="Forms" description="The form library brokers see in their portal. Upload a PDF to a form and it appears for every broker." />
      <FormsBrowser forms={forms} products={products.map((p) => ({ slug: p.slug, name: p.name }))} />
    </>
  );
}
