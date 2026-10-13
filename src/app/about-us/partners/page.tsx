import type { Metadata } from "next";
import { Container } from "@/components/Mockup";

export const metadata: Metadata = { title: "Our Insurance Partners" };

// TODO(stage 2): replace the name tiles with partner logos.
const partners = ["Lloyd's of London", "Canopius 4444", "Beazley 2623", "MS Amlin"];

export default function PartnersPage() {
  return (
    <section className="pt-[118px] pb-[150px]">
      <Container className="text-center">
        <h1 className="font-heading text-[30px] font-semibold tracking-normal text-site-teal">
          Our Insurance Partners
        </h1>
        <div className="mx-auto mt-4 h-px w-[226px] bg-[#eaeaea]" />
        <p className="mx-auto mt-7 max-w-[890px] text-[17px] leading-[1.65] text-body">
          Every Otta policy is underwritten by Certain Underwriters at Lloyd&apos;s of London,
          giving New Zealand businesses comprehensive coverage backed by global strength and
          certainty. Our lead syndicates are Canopius 4444, Beazley 2623 and MS Amlin.
        </p>
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
