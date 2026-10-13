import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { products } from "@/content/products";
import { resourcesNav } from "@/content/site";

const types = resourcesNav.map((r) => ({ type: r.href.split("/").pop()!, label: r.label }));

export function generateStaticParams() {
  return types.map(({ type }) => ({ type }));
}

export async function generateMetadata({ params }: PageProps<"/resources/[type]">): Promise<Metadata> {
  const { type } = await params;
  return { title: types.find((t) => t.type === type)?.label };
}

export default async function ResourceTypePage({ params }: PageProps<"/resources/[type]">) {
  const { type } = await params;
  const entry = types.find((t) => t.type === type);
  if (!entry) notFound();

  return (
    <>
      <PageHeader eyebrow="Resources" title={entry.label}>
        Download the {entry.label.toLowerCase()} for each Otta product.
      </PageHeader>
      <Section>
        {/* TODO(stage 2): link to real PDFs (Vercel Blob) once documents are supplied. */}
        <ul className="divide-y divide-cloud overflow-hidden rounded-2xl border border-cloud">
          {products.map((p) => (
            <li key={p.slug} id={p.slug} className="flex scroll-mt-28 flex-col gap-3 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-10 items-center justify-center rounded-md bg-ocean-100 text-[10px] font-bold text-ocean-800">
                  PDF
                </span>
                <div>
                  <p className="font-bold">{p.name}</p>
                  <p className="text-sm text-muted">{entry.label}</p>
                </div>
              </div>
              <span className="self-start rounded-full bg-cloud px-4 py-2 text-sm font-semibold text-muted sm:self-auto">
                Coming soon
              </span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
