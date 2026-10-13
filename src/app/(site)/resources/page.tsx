import type { Metadata } from "next";
import { Container, GreyBlock, GreyButton, PageIntro } from "@/components/Mockup";
import { resourcesNav } from "@/content/site";

export const metadata: Metadata = { title: "Resources" };

const blurbs: Record<string, string> = {
  "Product Fact Sheets": "A one-page summary of the cover, limits and key exclusions for each product.",
  "Policy Wording": "The full policy wording for each Otta product.",
  "Proposal Forms": "Forms to apply for cover, completed by you or your broker.",
  "Renewal Declarations": "Declarations to complete when your policy comes up for renewal.",
  "Claim Forms": "Forms to lodge a claim, along with the supporting documents we need.",
};

export default function ResourcesPage() {
  return (
    <section className="pt-[118px] pb-[120px]">
      <Container>
        <PageIntro title="Resources">
          <p>Fact sheets, policy wordings and forms for every Otta product.</p>
        </PageIntro>
        <div className="mt-[72px] grid gap-9 md:grid-cols-2 lg:grid-cols-3">
          {resourcesNav.map((r) => (
            <GreyBlock key={r.href} className="flex flex-col items-start">
              <h2 className="text-[20px] font-semibold tracking-normal text-charcoal">{r.label}</h2>
              <p className="mt-4 flex-1 text-[15px] leading-[1.75] text-body">{blurbs[r.label]}</p>
              <div className="mt-6">
                <GreyButton href={r.href}>View {r.label.toLowerCase()}</GreyButton>
              </div>
            </GreyBlock>
          ))}
        </div>
      </Container>
    </section>
  );
}
