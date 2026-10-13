import type { Metadata } from "next";
import { Container, ImagePlaceholder, PageIntro, SquareButton } from "@/components/Mockup";

export const metadata: Metadata = { title: "Case Studies" };

// TODO(stage 2): real case studies.
export default function CaseStudiesPage() {
  return (
    <>
      <section className="pt-[118px] pb-[110px]">
        <Container>
          <PageIntro title="Case Studies">
            <p>
              How Otta has helped clients place complex and unusual risks, with quick turnaround and
              direct access to the underwriter. Case studies to come.
            </p>
          </PageIntro>
          <div className="mt-[72px] grid gap-x-9 gap-y-16 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <article key={n}>
                <ImagePlaceholder label={`Case study ${n}`} className="aspect-[3/2]" />
                <h2 className="mt-11 text-[25px] leading-[1.15] font-semibold tracking-normal text-charcoal">
                  Client heading placeholder case study
                </h2>
                <p className="mt-6 text-[16px] leading-[1.75] text-body">
                  A short summary of the client&apos;s challenge and how Otta made the complex simple.
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <section className="bg-site-teal py-[84px] text-center">
        <Container>
          <h2 className="text-[30px] font-bold tracking-normal text-white">Have a complex risk to place?</h2>
          <p className="mt-6 text-[18px] text-white">Talk directly to the underwriter who can make the decision.</p>
          <div className="mt-10">
            <SquareButton href="/contact">Contact us</SquareButton>
          </div>
        </Container>
      </section>
    </>
  );
}
