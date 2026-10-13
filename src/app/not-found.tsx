import { Container, LargeButton, PageIntro } from "@/components/Mockup";

export default function NotFound() {
  return (
    <section className="pt-[118px] pb-[150px]">
      <Container>
        <PageIntro title="We couldn't find that page">
          <p>The page may have moved. Try the home page or get in touch.</p>
        </PageIntro>
        <div className="mt-12 text-center">
          <LargeButton href="/">Back to home</LargeButton>
        </div>
      </Container>
    </section>
  );
}
