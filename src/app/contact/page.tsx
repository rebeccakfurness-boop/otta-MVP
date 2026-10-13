import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { site } from "@/content/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact us" title="Talk directly to us">
        Quick turnaround and access to the underwriter – if you&apos;re not sure whether we can
        help, get in touch.
      </PageHeader>
      <Section>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-8">
            <Suspense>
              <ContactForm />
            </Suspense>
          </div>
          <aside className="space-y-8 md:col-span-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-ocean-700">Phone</h2>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="mt-2 block text-2xl font-bold">
                {site.phone}
              </a>
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-ocean-700">Email</h2>
              <a href={`mailto:${site.email}`} className="mt-2 block text-lg font-semibold underline">
                {site.email}
              </a>
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-ocean-700">Our address</h2>
              <address className="mt-2 not-italic leading-relaxed text-muted">
                {site.address.map((l) => (
                  <div key={l}>{l}</div>
                ))}
              </address>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
