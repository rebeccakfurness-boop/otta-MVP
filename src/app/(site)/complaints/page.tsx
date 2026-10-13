import type { Metadata } from "next";
import { Container, LargeButton, PageIntro } from "@/components/Mockup";

export const metadata: Metadata = { title: "Complaints" };

// TODO(stage 2): approved compliance wording.
export default function ComplaintsPage() {
  return (
    <section className="pt-[118px] pb-[150px]">
      <Container>
        <PageIntro title="Complaints">
          <p>How to make a complaint, how we will respond and how to contact our dispute resolution scheme. Approved wording to come.</p>
        </PageIntro>
        <div className="mt-12 text-center">
          <LargeButton href="/contact">Contact us</LargeButton>
        </div>
      </Container>
    </section>
  );
}
