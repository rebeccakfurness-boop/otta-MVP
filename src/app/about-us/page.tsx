import type { Metadata } from "next";
import { CentredHeading, Container, DarkPlaceholder, LargeButton } from "@/components/Mockup";

export const metadata: Metadata = { title: "About us" };

// TODO(stage 2): the three values and the success story are draft copy.
const values = [
  {
    title: "Forward thinking",
    body: "We have an appetite for the unusual and the high-risk. Rather than saying no to what doesn't fit a standard mould, we look at every risk on its merits with genuine underwriting based on the data and facts.",
  },
  {
    title: "Re-invention",
    body: "Otta brings specialist insurance and landlord insurance together under one brand, with one connected suite for brokers, property managers and the clients they look after.",
  },
  {
    title: "Continuous Improvement",
    body: "We listen to the brokers, property managers and clients we work with, and keep refining our products, policy wordings and claims process so insurance keeps working for them.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Teal hero */}
      <section className="flex min-h-[600px] items-center bg-site-teal py-24 md:min-h-[777px]">
        <Container className="text-center">
          <h1 className="text-[38px] leading-[1.15] font-bold tracking-[-0.045em] text-white md:text-[50px]">
            Insurance that works
          </h1>
          <p className="mt-12 text-[16px] font-semibold text-white">
            Simple insurance solutions for complex problems.
          </p>
          <p className="mx-auto mt-5 max-w-[1000px] text-[16px] leading-[1.75] text-white">
            Otta is a New Zealand insurer bringing specialist underwriting, backed by Lloyd&apos;s
            of London, to businesses, landlords and community housing providers. We provide
            liability, accident, travel and property cover through brokers, and landlord insurance
            through approved property managers – with quick turnaround and direct access to the
            underwriter.
          </p>
          <div className="mt-10">
            <LargeButton href="/contact" variant="outline-white">
              <span className="px-8">Contact</span>
            </LargeButton>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="pt-[108px] pb-[100px]">
        <Container>
          <div className="grid gap-x-9 gap-y-16 md:grid-cols-3">
            {values.map((v) => (
              <article key={v.title}>
                <DarkPlaceholder label={v.title} className="aspect-[3/2]" />
                <h2 className="mt-11 text-[25px] leading-[1.15] font-semibold tracking-normal text-charcoal">
                  {v.title}
                </h2>
                <p className="mt-9 text-[16px] leading-[1.75] text-body">{v.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Success story */}
      <section className="pt-[50px] pb-[330px]">
        <Container>
          <CentredHeading>The Otta success story</CentredHeading>
          <div className="mx-auto max-w-[680px] text-center">
            <p className="mt-9 font-heading text-[24px] leading-[1.25] font-semibold text-charcoal">
              Making the complex simple for New Zealand brokers, landlords and businesses.
            </p>
            <p className="mt-12 text-[16px] leading-[1.75] text-body">
              The Otta story – copy to come. This section will tell how Otta began, the people
              behind it and how we work with our partners to place cover that is clear, fair and
              built for the real world.
            </p>
            <div className="mt-10">
              <LargeButton href="/contact">
                <span className="text-[15px]">Learn How to Partner With Us</span>
              </LargeButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
