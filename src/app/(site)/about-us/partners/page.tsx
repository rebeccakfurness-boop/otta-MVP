import type { Metadata } from "next";
import { Container, PageIntro } from "@/components/Mockup";

export const metadata: Metadata = { title: "Our Insurance Partners" };

// TODO(stage 2): replace the name tiles with partner logos.
const partners = ["Lloyd's of London", "Canopius 4444", "Beazley 2623", "MS Amlin"];

export default function PartnersPage() {
  return (
    <section className="pt-[118px] pb-[150px]">
      <Container className="text-center">
        <PageIntro title="Our Insurance Partners">
          <p>
            Every Otta policy is underwritten by Certain Underwriters at Lloyd&apos;s of London,
            giving New Zealand businesses comprehensive coverage backed by global strength and
            certainty. Our lead syndicates are Canopius 4444, Beazley 2623 and MS Amlin.
          </p>
        </PageIntro>
        <ul className="mx-auto mt-24 grid max-w-[1000px] grid-cols-2 gap-6 md:grid-cols-4">
          {partners.map((name) => (
            <li
              key={name}
              className="flex h-28 items-center justify-center border border-[#eaeaea] px-4 font-heading text-[18px] font-semibold text-charcoal"
            >
              {name}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
