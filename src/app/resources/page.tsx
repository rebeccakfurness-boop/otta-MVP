import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { resourcesNav } from "@/content/site";

export const metadata: Metadata = { title: "Resources" };

export default function ResourcesPage() {
  return (
    <>
      <PageHeader eyebrow="Resources" title="Documents and forms">
        Fact sheets, policy wordings and forms for every Otta product.
      </PageHeader>
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resourcesNav.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group flex items-center justify-between rounded-2xl border border-cloud bg-white p-7 shadow-sm transition hover:border-ocean hover:shadow-md"
            >
              <span className="text-xl font-bold group-hover:text-ocean-700">{r.label}</span>
              <span aria-hidden className="text-ocean-700 transition-transform group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
