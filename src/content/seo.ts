// Search engine wording: page titles and descriptions written for the niche
// covers people search for. Shown in Google results and link previews.
import { site } from "./site";

export const seo = {
  siteTitle: `${site.name} | Specialist insurance backed by Lloyd's of London`,
  siteDescription:
    "Otta is a New Zealand specialist insurer for brokers and their clients: rental property, landlord, social housing, corporate travel, personal accident and liability cover, backed by Lloyd's of London.",
  /** Shared image for link previews. */
  shareImage: "/images/property-houses.jpg",
};

/** Per product: the title and description searchers see. */
export const productSeo: Record<string, { title: string; description: string; keywords: string[] }> = {
  "rental-property-insurance": {
    title: "Rental Property Insurance NZ, including meth and tenant damage",
    description:
      "Rental property insurance for New Zealand landlords, with cover for intentional damage by tenants and methamphetamine contamination. Backed by Lloyd's of London, arranged through your broker.",
    keywords: ["rental property insurance NZ", "meth contamination insurance", "tenant damage cover", "landlord building insurance"],
  },
  "landlord-insurance": {
    title: "Landlord Insurance NZ for professionally managed rentals",
    description:
      "Landlord insurance for professionally managed rental properties in New Zealand: loss of rent, tenant damage and liability. Arranged through approved property managers, backed by Lloyd's of London.",
    keywords: ["landlord insurance NZ", "loss of rent insurance", "property manager landlord cover"],
  },
  "social-and-community-housing-insurance": {
    title: "Social and Community Housing Insurance NZ",
    description:
      "Specialist property insurance for social and community housing providers in New Zealand, with intentional damage and meth cover to $100,000 and loss of rent. Backed by Lloyd's of London.",
    keywords: ["community housing insurance", "social housing insurance NZ", "iwi housing insurance", "CHP insurance"],
  },
  "corporate-travel-insurance": {
    title: "Corporate Travel Insurance NZ for business travellers",
    description:
      "Annual corporate travel insurance for New Zealand businesses and their staff, with an emergency assistance line. Backed by Lloyd's of London, arranged through your broker.",
    keywords: ["corporate travel insurance NZ", "business travel insurance", "annual travel policy for staff"],
  },
  "personal-accident-insurance": {
    title: "Personal Accident and Illness Insurance NZ, beyond ACC",
    description:
      "Personal accident and illness insurance that tops up ACC and covers illness ACC doesn't, for sole traders and businesses in New Zealand. Backed by Lloyd's of London.",
    keywords: ["personal accident insurance NZ", "income protection illness ACC top up", "sickness and accident cover"],
  },
  "liability-insurance": {
    title: "Liability and Professional Indemnity Insurance NZ",
    description:
      "Professional indemnity, public liability, statutory liability and employers liability for New Zealand businesses, including hard to place risks. Backed by Lloyd's of London.",
    keywords: ["professional indemnity insurance NZ", "public liability insurance", "statutory liability", "employers liability"],
  },
};
