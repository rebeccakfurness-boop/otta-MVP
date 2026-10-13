import { getProduct } from "@/content/products";
import { contactTeams } from "@/content/steve-ui";

export function productName(slug?: string) {
  return slug ? (getProduct(slug)?.name ?? slug) : "All products";
}

const teamByProduct: Record<string, string> = {
  "corporate-travel-insurance": "Travel",
  "personal-accident-insurance": "General",
  "landlord-insurance": "Landlord cover",
  "rental-property-insurance": "Property",
  "social-and-community-housing-insurance": "Property",
  "liability-insurance": "Liability",
};

/** The Otta team email that looks after a product. */
export function teamEmail(slug?: string) {
  const label = (slug && teamByProduct[slug]) || "General";
  return contactTeams.find((t) => t.label === label)?.email ?? contactTeams[contactTeams.length - 1].email;
}
