// Frequently asked questions, shown on /resources/faqs.
// Answers are paragraphs; [label](href) becomes a link. Keep to what the
// product pages, fact sheets and policy wordings say, and point to the wording
// for anything that depends on the policy.
import { site } from "./site";

export type Faq = { q: string; a: string[] };
export type FaqGroup = { id: string; title: string; faqs: Faq[] };

const phone = site.phone;

export const faqIntro =
  "Answers to the questions we're asked most. If yours isn't here, talk to your broker or [contact us](/contact).";

export const faqGroups: FaqGroup[] = [
  {
    id: "about-otta",
    title: "About Otta",
    faqs: [
      {
        q: "Who is Otta?",
        a: [
          "Otta, a division of Insurance Wholesale Limited, provides specialist insurance products from Lloyd's of London to New Zealand businesses. We have been doing this for over 30 years, and we are New Zealand owned and operated, with offices in Auckland.",
          "We work with brokers to understand specific risks and build cover that fits, rather than a one size fits all policy. We have a real appetite for niche and complex risks.",
        ],
      },
      {
        q: "Who insures my policy?",
        a: [
          "Every Otta policy is underwritten by Certain Underwriters at Lloyd's of London. The lead syndicate depends on the product: Canopius 4444 for Corporate Travel and Personal Accident, Beazley 2623 for Rental Property, Landlord and Social and Community Housing, and MS Amlin for Liability.",
          "Otta acts as a Lloyd's Coverholder, which means we can underwrite and issue policies on Lloyd's behalf here in New Zealand.",
        ],
      },
      {
        q: "Can I buy a policy directly from Otta?",
        a: [
          "Our policies are arranged through insurance brokers. Landlord Insurance is arranged through approved property management companies. Your broker applies to us on your behalf and looks after your policy with you.",
          "If you don't have a broker, [get in touch](/contact) and we'll talk you through your options.",
        ],
      },
      {
        q: "Does Otta follow the Fair Insurance Code?",
        a: [
          "Yes. Insurance Wholesale Limited, trading as Otta, is a member of the Insurance Council of New Zealand and adheres to the [Fair Insurance Code](/fair-insurance-code).",
        ],
      },
    ],
  },
  {
    id: "products",
    title: "Our products and cover",
    faqs: [
      {
        q: "What insurance does Otta offer?",
        a: [
          "We offer six products: [Corporate Travel](/solutions/corporate-travel-insurance), [Landlord](/solutions/landlord-insurance), [Rental Property](/solutions/rental-property-insurance), [Social and Community Housing](/solutions/social-and-community-housing-insurance), [Personal Accident](/solutions/personal-accident-insurance) and [Liability](/solutions/liability-insurance). All are annual policies.",
        ],
      },
      {
        q: "What's the difference between Landlord Insurance and Rental Property Insurance?",
        a: [
          "Rental Property Insurance covers the building itself: it is property cover for residential rental properties, including risks not every insurer covers, such as intentional damage by tenants and methamphetamine contamination.",
          "Landlord Insurance protects you from losses connected with the tenancy, such as a tenant leaving owing rent. It is only available for properties professionally managed by an approved property management company. The two can be paired for fuller protection.",
        ],
      },
      {
        q: "Are holiday homes, Airbnb or short-term rentals covered?",
        a: [
          "No. Rental Property, Social and Community Housing and Landlord Insurance are for long-term residential tenancies. Short-term and holiday rentals, Airbnb and similar, and owner-occupied properties are excluded.",
        ],
      },
      {
        q: "Is methamphetamine contamination covered?",
        a: [
          "Rental Property and Social and Community Housing Insurance both include cover for methamphetamine and hazardous substance damage. On Social and Community Housing Insurance it is covered up to $100,000. Check the [policy wording](/resources/policy-wording) for the limits and conditions that apply to your policy.",
        ],
      },
      {
        q: "What do landlords need to do to keep their cover?",
        a: [
          "For our property products, landlords need to carry out internal and external inspections at least every six months and whenever there is a change of tenancy, and keep written records of each inspection and any issues found.",
        ],
      },
      {
        q: "How does Personal Accident Insurance work with ACC?",
        a: [
          "ACC covers accidents but not illness. Our Personal Accident and Illness cover fills that gap, protecting income if injury or illness stops you working. Where ACC is already paying, the policy tops up ACC rather than paying in addition to it. Pre-existing medical conditions are excluded.",
        ],
      },
      {
        q: "What does Liability Insurance cover?",
        a: [
          "Our Liability Insurance can include Professional Indemnity, Public Liability, Statutory Liability and Employers Liability for commercial businesses. The policy has very few exclusions, although some may be added when we underwrite your business.",
        ],
      },
      {
        q: "Does Corporate Travel Insurance cover every destination?",
        a: [
          "Corporate Travel Insurance covers business travel for commercial entities, but travel to sanctioned countries and territories is excluded.",
        ],
      },
      {
        q: "Where can I read exactly what's covered?",
        a: [
          "Each product page has a summary under \"This policy at a glance\". The full terms are in the [policy wording](/resources/policy-wording), and [product fact sheets](/resources/product-fact-sheets) give a short summary. Documents open in a new tab, so you won't lose your place.",
        ],
      },
    ],
  },
  {
    id: "applying",
    title: "Applying and renewing",
    faqs: [
      {
        q: "How do I apply for cover?",
        a: [
          "Talk to your broker. Brokers apply through the Otta Broker Portal, where they can complete the proposal online and send it straight to our underwriters, or download a PDF [proposal form](/resources/proposal-forms) to complete and email to us.",
        ],
      },
      {
        q: "My broker sent me a link to a form. Is that genuine?",
        a: [
          "Yes, if it came from your broker. Brokers can create a secure link to an Otta form for you to fill in online. The link works for 30 days, and when you submit, the form comes straight to Otta and your broker is told. Otta never emails clients directly, so if you're unsure, check with your broker.",
        ],
      },
      {
        q: "Who do I talk to about my quote?",
        a: [
          "Your broker. You get quick turnaround and direct access to the underwriter who makes the decision, and your broker can talk to our team at any time.",
        ],
      },
      {
        q: "How do renewals work?",
        a: [
          "Our policies run for a year. Before your policy renews, your broker may ask you to complete a [renewal declaration](/resources/renewal-declarations) confirming whether anything has changed. Your broker sees upcoming renewals in the Broker Portal well before the due date.",
        ],
      },
    ],
  },
  {
    id: "claims",
    title: "Claims",
    faqs: [
      {
        q: "How do I make a claim?",
        a: [
          `For non-emergency claims, contact your broker to discuss the process. You can also complete the [claim form](/resources/claim-forms), email us on ${site.claimsEmail} or call ${site.claimsPhone}.`,
        ],
      },
      {
        q: "What should I do in an emergency while travelling?",
        a: [
          "If you're overseas on a Corporate Travel policy and need urgent help, such as emergency medical assistance, call our emergency line on +61 2 9312 5168. You can lodge the claim afterwards. See [Claims](/claims) for details.",
        ],
      },
      {
        q: "How do I claim on Landlord Insurance?",
        a: [
          "Contact your property manager. They complete and submit the claim form to Otta on your behalf and work directly with us throughout the claim.",
        ],
      },
      {
        q: "What information do I need to make a claim?",
        a: [
          "It depends on the claim, and the claim form lists what we need. Typical examples are receipts, invoices, photos of the damage, medical reports, police reports, inspection reports, or for landlord claims the tenancy agreement and rent records. Sending everything at the start helps us settle your claim faster.",
        ],
      },
      {
        q: "Can my broker see how my claim is going?",
        a: ["Yes. Brokers can follow each claim's progress, and what has been paid, in the Otta Broker Portal."],
      },
    ],
  },
  {
    id: "brokers",
    title: "For brokers: the Otta Broker Portal",
    faqs: [
      {
        q: "How do I get access to the Broker Portal?",
        a: [
          `Select Account Login, then Request access, and tell us about you and your brokerage. We check every request, usually within one working day, and email you a link to set your password. The link works for 7 days. Your welcome email also includes our [broker guide](/documents/guides/otta-broker-portal-guide.pdf).`,
        ],
      },
      {
        q: "I've forgotten my password. What do I do?",
        a: [
          "On the sign-in page, choose \"Email me a sign-in link\". We'll email you a link that signs you straight in. It works once, for 20 minutes. You can then set a new password from Your account.",
        ],
      },
      {
        q: "Can I sign in with my Microsoft or Google work account?",
        a: [
          `Yes, once single sign-on is set up for your brokerage. To arrange it, email ${site.email}.`,
        ],
      },
      {
        q: "How do my colleagues get access?",
        a: [
          "Each person needs their own login. Colleagues can ask for one from the Request access page, and we'll add them to your brokerage's account.",
        ],
      },
      {
        q: "Can I get my client to fill in a proposal form?",
        a: [
          "Yes. In the portal, choose Send to a client, pick the form and enter your client's name. We create a secure link that you send to your client yourself. Otta never contacts your clients. When they submit, the form comes straight to us and appears in your Applications.",
        ],
      },
      {
        q: "How do I bind a quote?",
        a: [
          "Once your client accepts, open the quote under Quote requests, choose the inception date, confirm your client has accepted the quote and its terms, and select Instruct Otta to bind. Our team is told straight away, and we'll confirm cover and send the policy documents.",
        ],
      },
      {
        q: "Where can I learn how to use the portal?",
        a: [
          "The Training page in the portal walks through each screen with screenshots, and you can download the [broker guide](/documents/guides/otta-broker-portal-guide.pdf) as a PDF.",
        ],
      },
    ],
  },
  {
    id: "contact",
    title: "Contact and complaints",
    faqs: [
      {
        q: "How do I contact Otta?",
        a: [
          `Call us on ${phone}, email ${site.email}, or use our [contact form](/contact). Our office is at ${site.address.slice(0, 3).join(", ")}.`,
        ],
      },
      {
        q: "How do I make a complaint?",
        a: [
          "We want to put things right. See our [complaints page](/complaints) for how to make a complaint and what happens next, or talk to your broker.",
        ],
      },
    ],
  },
];

/** Anchor id for a question, so search results and links can jump to it. */
export const faqId = (q: string) =>
  q
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

/** An answer as plain text, with [label](href) links reduced to their label. */
export const faqText = (a: string[]) => a.map((p) => p.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")).join(" ");
