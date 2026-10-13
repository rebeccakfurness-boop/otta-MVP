import type { Metadata } from "next";
import { Suspense } from "react";
import { Container, GreyBlock, PageIntro } from "@/components/Mockup";
import { site } from "@/content/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <section className="pt-[118px] pb-[120px]">
      <Container>
        <PageIntro title="Contact Otta">
          <p>
            Quick turnaround and access to the underwriter. Talk directly to us to help us make the
            complex simple. If you&apos;re not sure whether we can help, get in touch.
          </p>
        </PageIntro>

        <div className="mx-auto mt-[72px] grid max-w-[1100px] gap-9 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Suspense>
              <ContactForm />
            </Suspense>
          </div>
          <GreyBlock className="self-start">
            <h2 className="text-[20px] font-semibold tracking-normal text-charcoal">Our Address</h2>
            <address className="mt-4 text-[15px] leading-[1.75] text-body not-italic">
              {site.address.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </address>
            <p className="mt-5 text-[15px] leading-[1.75] text-body">
              T:{" "}
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-charcoal hover:text-site-teal">
                {site.phone}
              </a>
              <br />
              E:{" "}
              <a href={`mailto:${site.email}`} className="text-charcoal hover:text-site-teal">
                {site.email}
              </a>
            </p>
          </GreyBlock>
        </div>
      </Container>
    </section>
  );
}
