import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Icon } from "@/components/portal/Icon";
import { LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { buildingApplication } from "@/content/building-application";
import { portalPath } from "@/lib/portal/config";
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
      <h2 className="mb-3 text-[12px] font-medium tracking-[0.14em] text-body uppercase">Apply online</h2>
      <div className="mb-10 flex flex-col gap-0 overflow-hidden rounded-sm sm:flex-row">
        <Link
          href={portalPath("/forms/building-application")}
          className="group flex flex-1 items-center gap-5 bg-site-teal p-5 text-white transition-colors hover:bg-[#4fa99c] sm:p-6"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/70">
            <Icon name="forms" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-heading text-[18px] font-bold">{buildingApplication.title}</span>
            <span className="mt-0.5 block text-[14px] text-white/90">{buildingApplication.summary}</span>
          </span>
          <Icon name="arrow" className="hidden h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1 sm:block" />
        </Link>
        <Link
          href={portalPath("/applications/send")}
          className="flex items-center justify-center gap-2 bg-site-blue px-6 py-4 text-[12px] font-medium tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#013a50] sm:w-56"
        >
          <Icon name="send" className="h-4 w-4" />
          Send to a client
        </Link>
      </div>
      <FormsBrowser forms={forms} products={products.map((p) => ({ slug: p.slug, name: p.name }))} />
    </>
  );
}
