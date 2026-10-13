import Link from "next/link";
import { ButtonLink } from "@/components/Button";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { ClaimsBand } from "@/components/ClaimsBand";
import { Eyebrow, Section } from "@/components/Section";
import { productCategories, products } from "@/content/products";

const pillars = [
  {
    title: "Broad appetite",
    body: "Mainstream or complex, we look at every risk on its merits – genuine underwriting based on the data and facts.",
  },
  {
    title: "Direct access",
    body: "Quick turnaround and a direct line to the underwriter, so we can make the complex simple.",
  },
  {
    title: "Lloyd's of London",
    body: "Comprehensive coverage backed by global strength and certainty delivered through Lloyd's of London.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ocean-700 text-white">
        <svg
          aria-hidden
          className="absolute top-1/2 -right-40 h-[44rem] w-[44rem] -translate-y-1/2 text-ocean md:-right-24"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="18" opacity="0.55" />
        </svg>
        <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-ocean-100">
            Insurance that works
          </p>
          <h1 className="max-w-3xl text-5xl leading-[1.05] text-white md:text-7xl">
            Welcome to Otta.
            <span className="block text-ocean-100">Insurance that works.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-ocean-50 md:text-xl">
            At Otta we provide simple insurance solutions for complex problems so your business,
            life and investments can benefit from stability, confidence and continuity.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/solutions" variant="light" size="lg">
              Discover Otta Solutions
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost" size="lg">
              Talk to an underwriter
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Two feature tiles */}
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <FeatureTile
            title="Specialised insurance solutions to keep you in tune"
            body="From corporate travel to professional indemnity, our specialist products are built for New Zealand businesses with risks that don't fit the standard mould."
            href="/solutions"
            tone="deep"
          />
          <FeatureTile
            title="Landlord insurance to protect your investment"
            body="Cover for loss of rent, intentional damage, methamphetamine contamination and more – designed with property managers and landlords."
            href="/solutions/landlord-insurance"
            tone="sunset"
          />
        </div>
      </Section>

      {/* Meet Otta */}
      <Section tone="ocean">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>About Otta</Eyebrow>
            <h2 className="text-3xl md:text-5xl">
              Meet the New Zealand insurer that keeps business and life moving
            </h2>
            <p className="mt-6 text-lg text-muted">
              Otta brings together specialist underwriting expertise and the backing of Lloyd&apos;s of
              London. We work with brokers and property managers to place cover that is clear,
              fair and built for the real world.
            </p>
            <ButtonLink href="/about-us" variant="outline" className="mt-8">
              More about us
            </ButtonLink>
          </div>
          <ul className="grid gap-4">
            {pillars.map((p) => (
              <li key={p.title} className="rounded-2xl border-l-4 border-ocean-600 bg-white p-6 shadow-sm">
                <h3 className="text-lg">{p.title}</h3>
                <p className="mt-2 text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Product categories */}
      <Section>
        <div className="mb-12 max-w-2xl">
          <Eyebrow>Our solutions</Eyebrow>
          <h2 className="text-3xl md:text-4xl">Insurance for the risks that matter to you</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {productCategories.map((cat, i) => (
            <article key={cat.key} className="flex flex-col overflow-hidden rounded-2xl border border-cloud bg-white shadow-sm">
              <ImagePlaceholder
                label={cat.title}
                tone={(["ocean", "deep", "sunset"] as const)[i]}
                className="aspect-[3/2]"
              />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl">{cat.title}</h3>
                <p className="mt-3 text-muted">{cat.blurb}</p>
                <ul className="mt-6 space-y-2 border-t border-cloud pt-5">
                  {products
                    .filter((p) => p.category === cat.key)
                    .map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/solutions/${p.slug}`}
                          className="group flex items-center justify-between font-semibold text-ocean-700 hover:text-ocean-800"
                        >
                          {p.name}
                          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Property banner */}
      <section className="relative">
        <ImagePlaceholder label="Property image" tone="deep" className="h-80 md:h-[28rem]" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
            <h2 className="max-w-xl text-3xl text-white md:text-5xl">
              Protecting the homes that hold communities together
            </h2>
            <ButtonLink
              href="/solutions/social-and-community-housing-insurance"
              variant="light"
              className="mt-8"
            >
              Social and Community Housing
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Case study */}
      <Section tone="cloud">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <ImagePlaceholder label="Case study" className="aspect-[4/3] rounded-2xl" tone="sunset" />
          <div>
            <Eyebrow>Case study</Eyebrow>
            <h2 className="text-3xl md:text-4xl">Client heading placeholder case study</h2>
            <p className="mt-4 text-lg font-semibold text-ocean-700">
              A short summary of the client&apos;s challenge and how Otta helped.
            </p>
            <p className="mt-4 text-muted">
              Case study copy to come. This block will introduce the client, the risk they needed
              to place and the outcome Otta delivered.
            </p>
            <ButtonLink href="/about-us/case-studies" className="mt-8">
              View the Case Study
            </ButtonLink>
          </div>
        </div>
      </Section>

      <ClaimsBand />
    </>
  );
}

function FeatureTile({
  title,
  body,
  href,
  tone,
}: {
  title: string;
  body: string;
  href: string;
  tone: "deep" | "sunset";
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-cloud">
      <ImagePlaceholder label={title} tone={tone} className="aspect-[16/9]" />
      <div className="flex flex-1 flex-col p-8">
        <h3 className="text-2xl md:text-3xl">{title}</h3>
        <p className="mt-4 flex-1 text-muted">{body}</p>
        <ButtonLink href={href} variant="outline" className="mt-6 self-start">
          Learn More
        </ButtonLink>
      </div>
    </article>
  );
}
