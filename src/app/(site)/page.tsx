import { site } from "@/content/site";
import Image from "next/image";
import Link from "next/link";
import { HeroVideo } from "@/components/HeroVideo";
import { SquareButton } from "@/components/Mockup";
import { getProduct } from "@/content/products";

// Home page columns. Landlord has its own column (it is sold through property
// managers rather than brokers), which gives the four columns in the mockup.
const columns = [
  {
    title: "Accident and Personal Insurance",
    image: { src: "/images/travel-airport.jpg", alt: "A traveller with a suitcase in an airport terminal", position: "35% center" },
    body: "Protection for your people at home, at work and on the road. We have appetite for the unusual and high-risk, including pilots, professional athletes and forestry contractors.",
    products: ["corporate-travel-insurance", "personal-accident-insurance"],
  },
  {
    title: "Property Insurance",
    image: { src: "/images/property-houses.jpg", alt: "Hands sheltering three small wooden houses", position: "center" },
    body: "Comprehensive cover for residential rental properties and social and community housing, including intentional damage and methamphetamine contamination.",
    products: ["rental-property-insurance", "social-and-community-housing-insurance"],
  },
  {
    title: "Liability Insurance",
    image: { src: "/images/liability-contract.jpg", alt: "A professional reviewing and signing a contract", position: "45% center" },
    body: "Professional Indemnity, Public, Statutory and Employers Liability. Your reputation is your most valuable asset, and we help safeguard it.",
    products: ["liability-insurance"],
  },
  {
    title: "Landlord Insurance",
    image: { src: "/images/landlord-keys.jpg", alt: "House keys handed over beside a model house", position: "center" },
    body: "Protect your rental income with cover for loss of rent if tenants default or your property becomes uninhabitable, plus tenant damage and legal liability.",
    products: ["landlord-insurance"],
  },
];

export default function Home() {
  return (
    <>
      {/* Hero video */}
      <section className="relative flex h-[69vh] min-h-[460px] items-center justify-center overflow-hidden">
        <HeroVideo />
        <div className="relative px-5 text-center">
          <h1 className="text-[38px] leading-[1.2] font-bold tracking-normal text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.15)] md:text-[50px]">
            Welcome to Otta.
            <br />
            Insurance that works.
          </h1>
          <Link
            href="/solutions"
            className="mt-10 inline-flex items-center bg-site-teal px-12 py-[19px] text-[17px] font-medium text-white transition-colors hover:bg-[#4fa99c]"
          >
            Discover Otta Solutions
          </Link>
        </div>
      </section>

      {/* Intro + two feature blocks */}
      <section className="grid md:grid-cols-4">
        <div className="flex items-center bg-site-teal px-5 py-16 md:col-span-2 md:min-h-[282px] md:px-[100px]">
          <p className="max-w-[720px] text-[18px] leading-[1.78] text-white">
            At Otta we provide simple insurance solutions for complex problems so your business,
            life and investments can benefit from stability, confidence and continuity.
          </p>
        </div>
        <FeatureBlock
          className="bg-site-blue"
          title="Specialised insurance solutions to keep you in tune"
          href="/solutions"
        />
        <FeatureBlock
          className="bg-site-purple"
          title="Landlord insurance to protect your investment"
          href="/solutions/landlord-insurance"
        />
      </section>

      {/* Meet Otta */}
      <section className="bg-white pt-[30px] pb-[110px] md:pt-[30px]">
        <div className="mx-auto max-w-[1366px] px-5 md:px-4">
          <div className="mx-auto max-w-[960px] pt-8 text-center">
            <h2 className="text-[32px] leading-[1.2] font-bold tracking-[-0.03em] text-charcoal md:text-[40px]">
              Meet the New Zealand insurer that keeps business and life moving
            </h2>
            <div className="mx-auto mt-7 h-[2px] w-[90px] bg-site-teal" />
            <p className="mx-auto mt-10 max-w-[880px] text-[16px] leading-[1.75] text-body">
              Otta brings simple insurance solutions to complex problems. We have a broad appetite
              to cover all risks, whether mainstream or complex, with quick turnaround and direct
              access to the underwriter. Every policy offers comprehensive coverage backed by
              global strength and certainty delivered through Lloyd&apos;s of London.
            </p>
          </div>

          <div className="mt-[110px] grid gap-x-9 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((col) => (
              <article key={col.title}>
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={col.image.src}
                    alt={col.image.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: col.image.position }}
                  />
                </div>
                <h3 className="mt-11 text-[25px] leading-[1.15] font-semibold tracking-normal text-charcoal">
                  {col.title}
                </h3>
                <p className="mt-6 text-[16px] leading-[1.75] text-body">{col.body}</p>
                <ul className="mt-7 space-y-[3px]">
                  {col.products.map((slug) => {
                    const product = getProduct(slug)!;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/solutions/${slug}`}
                          className="group flex items-center gap-2.5 text-[16px] text-body transition-colors hover:text-charcoal"
                        >
                          <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-site-teal" fill="none" stroke="currentColor" strokeWidth="1.3">
                            <path d="M1.5 8h12M9 3.5 13.5 8 9 12.5" />
                          </svg>
                          {product.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Property banner */}
      <section className="flex min-h-[260px] items-center justify-center bg-ocean-600 px-5 py-16 md:min-h-[340px]">
        <h2 className="max-w-[900px] text-center text-[28px] font-semibold tracking-normal text-white md:text-[34px]">
          Comprehensive cover for landlords to protect their investment
        </h2>
      </section>

      {/* Case study (Phase 2) */}
      {site.features.caseStudies && (
      <section className="bg-site-teal py-[104px]">
        <div className="mx-auto max-w-[1366px] px-5 md:px-4">
          <h2 className="text-center text-[34px] leading-[1.15] font-bold tracking-[-0.04em] text-white md:text-[44px]">
            Client heading placeholder case study
          </h2>
          <div className="mx-auto mt-[100px] grid max-w-[1000px] items-center gap-9 md:grid-cols-2">
            <div>
              <h3 className="text-[24px] leading-[1.17] font-semibold tracking-normal text-white">
                Case study summary to come: the client&apos;s challenge in a sentence.
              </h3>
              <p className="mt-11 text-[16px] leading-[1.75] text-white">
                Case study copy to come. This section will introduce the client, the risk they
                needed to place and how Otta made the complex simple, with quick turnaround and
                direct access to the underwriter.
              </p>
              <div className="mt-10">
                <SquareButton href="/about-us/case-studies">View the case study</SquareButton>
              </div>
            </div>
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src="/images/personal-accident-care.jpg"
                alt="A carer pushing a smiling man in a wheelchair outdoors"
                fill
                sizes="(min-width: 768px) 500px, 100vw"
                className="object-cover"
                style={{ objectPosition: "40% center" }}
              />
            </div>
          </div>
        </div>
      </section>
      )}

      {/* About us banner */}
      <section className="relative flex min-h-[380px] items-center justify-center overflow-hidden px-5 py-20 md:min-h-[460px]">
        <Image src="/images/liability-contract.jpg" alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: "center 60%" }} />
        <div aria-hidden className="absolute inset-0 bg-charcoal/60" />
        <div className="relative max-w-[1000px] text-center">
          <h2 className="text-[34px] font-bold tracking-[-0.02em] text-white md:text-[44px]">About Us</h2>
          <p className="mx-auto mt-5 max-w-[860px] text-[17px] leading-[1.7] text-white/95 md:text-[19px]">
            Otta is a New Zealand insurer providing specialist insurance products from Lloyd&apos;s of London, with quick
            turnaround and direct access to the underwriter.
          </p>
          <Link
            href="/about-us"
            className="mt-9 inline-flex items-center bg-site-teal px-10 py-[17px] text-[16px] font-medium text-white transition-colors hover:bg-[#4fa99c]"
          >
            Learn more
          </Link>
        </div>
      </section>
    </>
  );
}

function FeatureBlock({ title, href, className }: { title: string; href: string; className: string }) {
  return (
    <div className={`flex flex-col items-center justify-center px-8 py-16 text-center md:min-h-[282px] ${className}`}>
      <h2 className="max-w-[360px] text-[25px] leading-[1.17] font-bold tracking-[-0.04em] text-white">
        {title}
      </h2>
      <div className="mt-10">
        <SquareButton href={href}>Learn more</SquareButton>
      </div>
    </div>
  );
}
