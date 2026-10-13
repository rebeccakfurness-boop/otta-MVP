import type { Metadata } from "next";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";

export const metadata: Metadata = { title: "Case Studies" };

export default function CaseStudiesPage() {
  return (
    <>
      <PageHeader eyebrow="About us" title="Case Studies">
        How Otta has helped clients place complex and unusual risks. Case studies to come.
      </PageHeader>
      <Section>
        <div className="grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <article key={n} className="overflow-hidden rounded-2xl border border-cloud bg-white shadow-sm">
              <ImagePlaceholder label="Case study" className="aspect-[3/2]" tone={n === 2 ? "deep" : "ocean"} />
              <div className="p-6">
                <h2 className="text-xl">Client heading placeholder case study</h2>
                <p className="mt-3 text-muted">Summary of the client&apos;s challenge and the outcome.</p>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
