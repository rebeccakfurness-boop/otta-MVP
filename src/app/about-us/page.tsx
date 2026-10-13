import type { Metadata } from "next";
import Link from "next/link";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";

export const metadata: Metadata = { title: "About us" };

const links = [
  { title: "Our Team", href: "/about-us/our-team", body: "Meet the underwriters and specialists behind Otta." },
  { title: "Partners", href: "/about-us/partners", body: "The Lloyd's syndicates and partners who back our products." },
  { title: "Case Studies", href: "/about-us/case-studies", body: "How Otta has helped clients with complex risks." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About us" title="Meet the New Zealand insurer that keeps business and life moving">
        Otta provides simple insurance solutions for complex problems so your business, life and
        investments can benefit from stability, confidence and continuity.
      </PageHeader>
      <Section>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-4 text-lg text-muted">
            <h2 className="text-3xl text-ink">Two brands, one Otta</h2>
            <p>
              Otta brings together specialist cover backed by Lloyd&apos;s of London – liability,
              accident, travel and property – with landlord insurance sold through approved
              property managers.
            </p>
            <p>About us copy to come.</p>
          </div>
          <ImagePlaceholder label="Otta team" className="aspect-[4/3] rounded-3xl" />
        </div>
      </Section>
      <Section tone="cloud">
        <div className="grid gap-6 md:grid-cols-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="group rounded-2xl bg-white p-8 shadow-sm transition hover:shadow-md">
              <h2 className="text-2xl group-hover:text-ocean-700">{l.title}</h2>
              <p className="mt-3 text-muted">{l.body}</p>
              <span className="mt-6 inline-block font-semibold text-ocean-700">
                View <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
