import type { Metadata } from "next";
import Image from "next/image";
import { Container, PageIntro, SquareButton } from "@/components/Mockup";

export const metadata: Metadata = { title: "Case Studies" };

// TODO(stage 2): real case studies and their own photos.
const photos = ["/images/about-team-meeting.jpg", "/images/about-floor-plans.jpg", "/images/about-sky-tower.jpg"];
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
            {photos.map((src) => (
              <article key={src}>
                <Image src={src} alt="" width={606} height={532} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[3/2] w-full object-cover" />
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
