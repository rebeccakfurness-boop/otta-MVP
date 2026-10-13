import type { Metadata } from "next";
import { Container, LargeButton, PageIntro } from "@/components/Mockup";

export const metadata: Metadata = { title: "Fair Insurance Code" };

// TODO(stage 2): approved compliance wording.
export default function FairInsuranceCodePage() {
  return (
    <section className="pt-[118px] pb-[150px]">
      <Container>
        <PageIntro title="Fair Insurance Code">
          <p>Otta is committed to the standards of the Insurance Council of New Zealand Fair Insurance Code. Approved wording to come.</p>
        </PageIntro>
        <div className="mt-12 text-center">
          <LargeButton href="/contact">Contact us</LargeButton>
        </div>
      </Container>
    </section>
  );
}
