// Pages the website search covers beyond the product pages (which are indexed
// from products.ts automatically). Keywords are extra words people might type.

import { site } from "./site";
import { faqGroups, faqId, faqText } from "./faqs";

export type SearchPage = { title: string; href: string; section: string; text: string; keywords?: string };

export const searchPages: SearchPage[] = [
  {
    title: "FAQs",
    href: "/resources/faqs",
    section: "Resources",
    text: "Answers to common questions about Otta insurance, applying for cover, claims and the Otta Broker Portal.",
    keywords: "faq questions help answers",
  },
  ...faqGroups.flatMap((g) =>
    g.faqs.map((f) => ({ title: f.q, href: `/resources/faqs#${faqId(f.q)}`, section: "FAQs", text: faqText(f.a).slice(0, 220) })),
  ),
  {
    title: "Home",
    href: "/",
    section: "Otta",
    text: "Insurance that works. Simple insurance solutions for complex problems so your business, life and investments can benefit from stability, confidence and continuity, backed by Lloyd's of London.",
  },
  {
    title: "About us",
    href: "/about-us",
    section: "About us",
    text: "Otta is a New Zealand insurer bringing specialist underwriting, backed by Lloyd's of London, to businesses, landlords and community housing providers. Liability, accident, travel and property cover through brokers, with quick turnaround and direct access to the underwriter.",
    keywords: "company who we are story values",
  },
  {
    title: "Our Team",
    href: "/about-us/our-team",
    section: "About us",
    text: "Talk directly to the people who make the decisions. Our underwriters and specialists work closely with brokers and property managers.",
    keywords: "people staff underwriters directors",
  },
  {
    title: "Our Insurance Partners",
    href: "/about-us/partners",
    section: "About us",
    text: "Every Otta policy is underwritten by Certain Underwriters at Lloyd's of London. Our lead syndicates are Canopius 4444, Beazley 2623 and MS Amlin.",
    keywords: "lloyds underwriter syndicate security insurer",
  },
  ...(site.features.caseStudies
    ? [
        {
          title: "Case Studies",
          href: "/about-us/case-studies",
          section: "About us",
          text: "How Otta has helped clients place complex and unusual risks, with quick turnaround and direct access to the underwriter.",
          keywords: "examples clients stories",
        },
      ]
    : []),
  {
    title: "Our Solutions",
    href: "/solutions",
    section: "Solutions",
    text: "Otta specialised insurance solutions: accident and travel, property, and liability insurance.",
    keywords: "products cover policies",
  },
  {
    title: "Claims",
    href: "/claims",
    section: "Claims",
    text: "How to make a claim. Contact your broker for non-emergency claims, download the claim form for your product and send it with your supporting documents. Landlord Insurance claims are lodged by your property manager.",
    keywords: "claim lodge emergency damage loss",
  },
  {
    title: "Contact Us",
    href: "/contact",
    section: "Contact",
    text: "Quick turnaround and access to the underwriter. Phone, email and our Auckland office address. Send us an enquiry.",
    keywords: "phone email address office enquiry help get in touch",
  },
  {
    title: "Resources",
    href: "/resources",
    section: "Resources",
    text: "Fact sheets, policy wordings and forms for every Otta product.",
    keywords: "documents downloads pdf",
  },
  {
    title: "Product Fact Sheets",
    href: "/resources/product-fact-sheets",
    section: "Resources",
    text: "A one-page summary of the cover, limits and key exclusions for each product.",
  },
  {
    title: "Policy Wording",
    href: "/resources/policy-wording",
    section: "Resources",
    text: "The full policy wording for each Otta product.",
    keywords: "terms conditions wordings",
  },
  {
    title: "Proposal Forms",
    href: "/resources/proposal-forms",
    section: "Resources",
    text: "Forms to apply for cover, completed by you or your broker.",
    keywords: "application apply quote building corporate travel proposal form",
  },
  {
    title: "Renewal Declarations",
    href: "/resources/renewal-declarations",
    section: "Resources",
    text: "Declarations to complete when your policy comes up for renewal.",
    keywords: "renew renewal",
  },
  {
    title: "Claim Forms",
    href: "/resources/claim-forms",
    section: "Resources",
    text: "Forms to lodge a claim, along with the supporting documents we need.",
  },
  {
    title: "Fair Insurance Code",
    href: "/fair-insurance-code",
    section: "Important information",
    text: "Otta is committed to the standards of the Insurance Council of New Zealand Fair Insurance Code.",
    keywords: "icnz code conduct",
  },
  {
    title: "Complaints",
    href: "/complaints",
    section: "Important information",
    text: "How to make a complaint, how we will respond and how to contact our dispute resolution scheme.",
    keywords: "complaint dispute resolution",
  },
];

export const searchCopy = {
  placeholder: "Search products, claims, forms and more",
  empty: "No results. Try a product name, \"claims\" or \"policy wording\".",
  popular: ["Landlord Insurance", "Claims", "Policy Wording", "Corporate Travel Insurance", "Contact Us"],
};
