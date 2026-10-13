import type { Metadata } from "next";
import { Container, GreyBlock, GreyButton, PageIntro } from "@/components/Mockup";
import { getProduct, products } from "@/content/products";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Claims" };

export default function ClaimsPage() {
  const emergencyPhone = getProduct("corporate-travel-insurance")?.claim.emergencyPhone;
  return (
    <section className="pt-[118px] pb-[120px]">
      <Container>
        <PageIntro title="How to make an insurance claim">
          <p>
            For non-emergency claims please contact your broker to discuss the process, or get in
            touch with us directly using the details below. Landlord Insurance claims are lodged by
            your property manager, who will work with us throughout the process.
          </p>
        </PageIntro>

        <div className="mt-[72px] grid gap-9 lg:grid-cols-3">
          {/* Emergency */}
          <div className="flex flex-col items-center justify-center rounded-sm bg-site-teal px-9 py-16 text-center text-white">
            <h2 className="text-[28px] font-semibold tracking-normal text-white">In an emergency</h2>
            <p className="mt-2 text-[14px] text-white/85">Corporate Travel Insurance</p>
            <p className="mt-6 text-[16px]">In an emergency call</p>
            {emergencyPhone && (
              <a
                href={`tel:${emergencyPhone.replace(/\s/g, "")}`}
                className="mt-1 font-heading text-[30px] font-bold text-white hover:underline"
              >
                {emergencyPhone}
              </a>
            )}
          </div>

          {/* Non emergency */}
          <GreyBlock>
            <h2 className="text-[20px] font-semibold tracking-normal text-charcoal">Non emergency claims</h2>
            <div className="mt-5 space-y-4 text-[15px] leading-[1.75] text-body">
              <p>
                For non-emergency claims please contact your broker to discuss the process. You will
                need to complete a claim form and provide the relevant supporting documents such as
                receipts, medical reports or police reports which are outlined in the claim form.
              </p>
              <p>
                Send your completed claim form along with the supporting documents to{" "}
                <a href={`mailto:${site.claimsEmail}`} className="text-charcoal hover:text-site-teal">
                  {site.claimsEmail}
                </a>{" "}
                or to your broker to lodge on your behalf. You can also call us on {site.claimsPhone}.
              </p>
            </div>
          </GreyBlock>

          {/* Claim forms */}
          <GreyBlock>
            <h2 className="text-[20px] font-semibold tracking-normal text-charcoal">Claim Forms</h2>
            <p className="mt-5 text-[15px] leading-[1.75] text-body">
              Download the claim form for your product and send it to us with your supporting
              documents.
            </p>
            <ul className="mt-6 flex flex-col items-start gap-3">
              {products.map((p) => (
                <li key={p.slug}>
                  <GreyButton href={`/resources/claim-forms#${p.slug}`}>
                    {p.name.replace(" Insurance", "")} Claim Form
                  </GreyButton>
                </li>
              ))}
            </ul>
          </GreyBlock>
        </div>
      </Container>
    </section>
  );
}
