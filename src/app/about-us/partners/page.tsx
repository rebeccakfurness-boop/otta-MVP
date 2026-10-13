import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";

export const metadata: Metadata = { title: "Partners" };

const partners = [
  { name: "Canopius 4444", body: "Lead syndicate for Corporate Travel and Personal Accident insurance." },
  { name: "Beazley 2623", body: "Lead syndicate for Landlord, Rental Property and Social and Community Housing insurance." },
  { name: "MS Amlin", body: "Lead syndicate for Liability insurance." },
];

export default function PartnersPage() {
  return (
    <>
      <PageHeader eyebrow="About us" title="Our Partners">
        Every Otta product is backed by Certain Underwriters at Lloyd&apos;s of London – global
        strength and certainty for New Zealand businesses.
      </PageHeader>
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {partners.map((p) => (
            <div key={p.name} className="rounded-2xl border-t-4 border-ocean bg-cloud-50 p-8">
              <h2 className="text-2xl">{p.name}</h2>
              <p className="mt-3 text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
