import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { products } from "@/content/products";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Claims" };

export default function ClaimsPage() {
  const travel = products.find((p) => p.slug === "corporate-travel-insurance");
  return (
    <>
      <PageHeader eyebrow="Claims" title="Making a claim">
        For non-emergency claims please contact your broker to discuss the process. You can also
        contact us directly.
      </PageHeader>
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-ocean-50 p-8">
            <h2 className="text-xl">Complete a claim form</h2>
            <p className="mt-3 text-muted">Download the claim form for your product and send it to us with supporting documents.</p>
            <ButtonLink href="/resources/claim-forms" className="mt-6">Claim forms</ButtonLink>
          </div>
          <div className="rounded-2xl bg-ocean-50 p-8">
            <h2 className="text-xl">Call us</h2>
            <p className="mt-3 text-2xl font-bold text-ocean-700">{site.claimsPhone}</p>
          </div>
          <div className="rounded-2xl bg-ocean-50 p-8">
            <h2 className="text-xl">Email us</h2>
            <a href={`mailto:${site.claimsEmail}`} className="mt-3 block text-xl font-bold text-ocean-700 underline">
              {site.claimsEmail}
            </a>
          </div>
        </div>
        {travel?.claim.emergencyPhone && (
          <div className="mt-8 rounded-2xl border-l-4 border-sunset bg-cloud-50 p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-sunset">Corporate Travel: in an emergency call</p>
            <p className="mt-1 text-3xl font-bold">{travel.claim.emergencyPhone}</p>
          </div>
        )}
      </Section>
      <Section tone="cloud">
        <h2 className="text-3xl">Claims by product</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {products.map((p) => (
            <div key={p.slug} className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="text-xl">
                <Link href={`/solutions/${p.slug}`} className="hover:text-ocean-700">{p.name}</Link>
              </h3>
              {p.claim.paragraphs.map((para) => (
                <p key={para.slice(0, 32)} className="mt-3 text-muted">{para}</p>
              ))}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
