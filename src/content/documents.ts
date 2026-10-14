// Product documents (PDFs in public/documents). Each document lists the products
// it applies to; the website's Resources pages, the product pages and the broker
// portal all read from here.

export type ProductDocument = {
  title: string;
  /** Edition shown beside the title. */
  edition?: string;
  file: string;
  productSlugs: string[];
};

const wording = (name: string) => `/documents/policy-wordings/${name}`;

export const policyWordings: ProductDocument[] = [
  {
    title: "Property Insurance Policy",
    edition: "October 2025",
    file: wording("Otta-Property-Insurance-Policy-October-2025.pdf"),
    productSlugs: ["rental-property-insurance", "social-and-community-housing-insurance", "landlord-insurance"],
  },
  {
    title: "Travel and Accident Insurance Policy",
    edition: "September 2024",
    file: wording("Otta-Travel-and-Accident-Insurance-Policy-September-2024.pdf"),
    productSlugs: ["corporate-travel-insurance"],
  },
  {
    title: "Inbound Workers Travel and Accident Insurance Policy",
    file: wording("Otta-Inbound-Workers-Travel-and-Accident-Policy.pdf"),
    productSlugs: ["corporate-travel-insurance"],
  },
  {
    title: "Personal Accident and Illness Policy",
    edition: "September 2022",
    file: wording("Otta-Personal-Accident-and-Illness-Policy-September-2022.pdf"),
    productSlugs: ["personal-accident-insurance"],
  },
  {
    title: "Liability Policy",
    file: wording("Otta-Liability-Policy.pdf"),
    productSlugs: ["liability-insurance"],
  },
  {
    title: "Liability Policy, Technology",
    file: wording("Otta-Liability-Policy-Technology.pdf"),
    productSlugs: ["liability-insurance"],
  },
  {
    title: "Professional Indemnity Policy",
    file: wording("Otta-Professional-Indemnity-Policy.pdf"),
    productSlugs: ["liability-insurance"],
  },
  {
    title: "Professional Indemnity Policy, Recruitment",
    file: wording("Otta-Professional-Indemnity-Policy-Recruitment.pdf"),
    productSlugs: ["liability-insurance"],
  },
];

export const wordingsFor = (productSlug: string) => policyWordings.filter((d) => d.productSlugs.includes(productSlug));
