import { portalLoginUrl } from "@/lib/portal/config";

// Site-wide settings and navigation. Change contact details here and they
// update everywhere (header, footer, contact page, product claim sections).

export const site = {
  name: "Otta",
  tagline: "Insurance that works",
  description:
    "Otta provides simple insurance solutions for complex problems, backed by Lloyd's of London.",
  // TODO(stage 2): confirm the claims email address.
  url: "https://www.ottainsurance.co.nz",
  phone: "0800 003 545",
  email: "hello@ottainsurance.co.nz",
  claimsEmail: "claims@ottainsurance.co.nz",
  claimsPhone: "0800 003 545",
  address: ["Level 1", "3/527A Rosebank Road", "Avondale, Auckland 1026", "New Zealand"],
  // The "Account Login" button: the broker portal on its own subdomain.
  portalUrl: portalLoginUrl,
};

export type NavItem = { label: string; href: string; children?: NavItem[] };

export const solutionsNav: NavItem[] = [
  { label: "Corporate Travel Insurance", href: "/solutions/corporate-travel-insurance" },
  { label: "Landlord Insurance", href: "/solutions/landlord-insurance" },
  { label: "Rental Property Insurance", href: "/solutions/rental-property-insurance" },
  {
    label: "Social and Community Housing Insurance",
    href: "/solutions/social-and-community-housing-insurance",
  },
  { label: "Personal Accident Insurance", href: "/solutions/personal-accident-insurance" },
  { label: "Liability Insurance", href: "/solutions/liability-insurance" },
];

export const resourcesNav: NavItem[] = [
  { label: "Product Fact Sheets", href: "/resources/product-fact-sheets" },
  { label: "Policy Wording", href: "/resources/policy-wording" },
  { label: "Proposal Forms", href: "/resources/proposal-forms" },
  { label: "Renewal Declarations", href: "/resources/renewal-declarations" },
  { label: "Claim Forms", href: "/resources/claim-forms" },
];

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About us",
    href: "/about-us",
    children: [
      { label: "Our Team", href: "/about-us/our-team" },
      { label: "Partners", href: "/about-us/partners" },
      { label: "Case Studies", href: "/about-us/case-studies" },
    ],
  },
  { label: "Solutions", href: "/solutions", children: solutionsNav },
  { label: "Claims", href: "/claims" },
  { label: "Resources", href: "/resources", children: resourcesNav },
  { label: "Contact Us", href: "/contact" },
];
