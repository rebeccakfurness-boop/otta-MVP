import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/Button";
import { ClaimsBand } from "@/components/ClaimsBand";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Eyebrow, Section } from "@/components/Section";
import { Tabs } from "@/components/Tabs";
import { importantInformation } from "@/content/legal";
import { getProduct, products } from "@/content/products";
import { site } from "@/content/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  return product ? { title: product.name, description: product.summary } : {};
}

export default async function ProductPage({ params }: PageProps<"/solutions/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  return (
    <>
      {/* Hero */}
      <section className="bg-ocean-50">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-12 md:px-8 md:py-24">
          <div className="md:col-span-7">
            <Eyebrow>Our solutions</Eyebrow>
            <h1 className="text-4xl md:text-5xl">{product.name}</h1>
            <div className="mt-6 space-y-4 text-lg text-muted">
              {product.intro.map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href={`/contact?product=${product.slug}`} size="lg">
                Apply now
              </ButtonLink>
              <ButtonLink href={`/resources/policy-wording#${product.slug}`} variant="outline" size="lg">
                View Policy Documents
              </ButtonLink>
              <ButtonLink href={`/resources/product-fact-sheets#${product.slug}`} variant="outline" size="lg">
                Download Fact Sheet
              </ButtonLink>
            </div>
          </div>
          <div className="md:col-span-5">
            <ImagePlaceholder label={product.name} className="aspect-[4/5] rounded-3xl" tone="deep" />
          </div>
        </div>
      </section>

      {/* At a glance */}
      <Section>
        <div className="rounded-3xl border border-ocean-200 bg-white p-8 shadow-sm md:p-12">
          <h2 className="text-3xl text-ocean-700">This policy at a glance</h2>
          <dl className="mt-8 grid gap-x-12 gap-y-6 md:grid-cols-2">
            {product.atAGlance.map((row) => (
              <div key={row.label} className="border-t border-cloud pt-4">
                <dt className="text-sm font-bold uppercase tracking-wider text-muted">{row.label}</dt>
                <dd className="mt-1 text-lg font-medium">
                  {row.value}
                  {row.label === "Product" && (
                    <Link href={`/resources/policy-wording#${product.slug}`} className="ml-2 text-base font-semibold text-ocean-700 underline">
                      Policy Wording
                    </Link>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Why choose Otta */}
      <Section tone="cloud">
        <h2 className="max-w-3xl text-3xl md:text-4xl">Why choose Otta for {product.shortName}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {product.statements.map((s, i) => (
            <div key={s} className="rounded-2xl bg-white p-8 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ocean-100 font-bold text-ocean-800">
                {i + 1}
              </span>
              <h3 className="mt-6 text-xl leading-snug text-ocean-700">{s}</h3>
            </div>
          ))}
        </div>
      </Section>

      {/* Case study band */}
      <section className="bg-deep text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-16 md:flex-row md:items-center md:justify-between md:px-8">
          <h2 className="max-w-2xl text-3xl text-white md:text-4xl">
            Discover how Otta keeps Company Name moving
          </h2>
          <ButtonLink href="/about-us/case-studies" variant="light" size="lg">
            Discover our case studies
          </ButtonLink>
        </div>
      </section>

      {/* Coverage summary */}
      <Section>
        <Eyebrow>{product.name} coverage summary</Eyebrow>
        <h2 className="max-w-3xl text-3xl md:text-5xl">{product.coverageTagline}</h2>
        <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {product.coverage.map((group) => (
            <div key={group.title}>
              <h3 className="border-b-2 border-ocean pb-3 text-xl text-ocean-700">{group.title}</h3>
              <ul className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <svg aria-hidden viewBox="0 0 20 20" className="mt-1 h-4 w-4 shrink-0 text-ocean-600" fill="currentColor">
                      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Important information */}
      <Section tone="ocean">
        <h2 className="text-3xl">Important information about this policy</h2>
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm md:p-10">
          <Tabs
            tabs={[
              {
                label: "Important Information",
                content: (
                  <dl className="grid gap-6 md:grid-cols-2">
                    {importantInformation.map((item) => (
                      <div key={item.title}>
                        <dt className="font-bold">{item.title}:</dt>
                        <dd className="mt-1 text-muted">{item.body}</dd>
                      </div>
                    ))}
                  </dl>
                ),
              },
              {
                label: "Key exclusions",
                content: (
                  <ol className="list-decimal space-y-2 pl-5">
                    {product.keyExclusions.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ol>
                ),
              },
            ]}
          />
        </div>
      </Section>

      {/* How to make a claim */}
      <Section>
        <div className="grid gap-10 md:grid-cols-12">
          <h2 className="text-3xl md:col-span-4">How to make a claim</h2>
          <div className="space-y-4 text-lg text-muted md:col-span-8">
            {product.claim.paragraphs.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
            {product.claim.showContactOptions && (
              <ul className="space-y-2 text-ink">
                <li>
                  • Complete the claim form –{" "}
                  <Link href="/resources/claim-forms" className="font-semibold text-ocean-700 underline">
                    click here
                  </Link>
                </li>
                <li>
                  • Call us on <strong>{site.claimsPhone}</strong>
                </li>
                <li>
                  • Email us on{" "}
                  <a href={`mailto:${site.claimsEmail}`} className="font-semibold text-ocean-700 underline">
                    {site.claimsEmail}
                  </a>
                </li>
              </ul>
            )}
            {product.claim.emergencyPhone && (
              <div className="rounded-2xl border-l-4 border-sunset bg-cloud-50 p-6 text-ink">
                <p className="text-sm font-bold uppercase tracking-wider text-sunset">In an emergency call</p>
                <a
                  href={`tel:${product.claim.emergencyPhone.replace(/\s/g, "")}`}
                  className="mt-1 block text-2xl font-bold"
                >
                  {product.claim.emergencyPhone}
                </a>
              </div>
            )}
          </div>
        </div>
      </Section>

      <ClaimsBand />
    </>
  );
}
