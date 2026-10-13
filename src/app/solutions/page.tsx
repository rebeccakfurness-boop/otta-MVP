import type { Metadata } from "next";
import Link from "next/link";
import { ClaimsBand } from "@/components/ClaimsBand";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { productCategories, products } from "@/content/products";

export const metadata: Metadata = { title: "Our Solutions" };

export default function SolutionsPage() {
  return (
    <>
      <PageHeader eyebrow="Our solutions" title="Specialist insurance, backed by Lloyd's of London">
        Simple insurance solutions for complex problems. If you&apos;re not sure whether we can
        help, talk directly to the underwriter.
      </PageHeader>
      {productCategories.map((cat, i) => (
        <Section key={cat.key} tone={i % 2 ? "cloud" : "white"}>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="text-3xl">{cat.title}</h2>
              <p className="mt-4 text-muted">{cat.blurb}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 md:col-span-8">
              {products
                .filter((p) => p.category === cat.key)
                .map((p) => (
                  <Link
                    key={p.slug}
                    href={`/solutions/${p.slug}`}
                    className="group flex flex-col rounded-2xl border border-cloud bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:border-ocean hover:shadow-md"
                  >
                    <h3 className="text-xl group-hover:text-ocean-700">{p.name}</h3>
                    <p className="mt-3 flex-1 text-muted">{p.summary}</p>
                    <span className="mt-6 font-semibold text-ocean-700">
                      Learn more <span aria-hidden>→</span>
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </Section>
      ))}
      <ClaimsBand />
    </>
  );
}
