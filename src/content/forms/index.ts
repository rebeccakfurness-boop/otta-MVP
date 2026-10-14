import { buildingApplication } from "./building";
import { corporateTravelProposal } from "./corporate-travel";
import { landlordProtectApplication } from "./landlord-protect";
import { noClaimsDeclaration } from "./no-claims-declaration";
import { paClaimForm } from "./pa-claim";
import { paGroupProposal } from "./pa-group-proposal";
import { paHealthDeclaration } from "./pa-health-declaration";
import { paIndividualProposal } from "./pa-individual-proposal";
import { travelClaimForm } from "./travel-claim";
import { professionalIndemnityProposal } from "./professional-indemnity";
import type { FormDefinition } from "./types";

export type { Condition, Field, FormDefinition, Part, Section, TextBlock } from "./types";
export {
  buildingApplication,
  corporateTravelProposal,
  landlordProtectApplication,
  noClaimsDeclaration,
  paClaimForm,
  paGroupProposal,
  paHealthDeclaration,
  paIndividualProposal,
  professionalIndemnityProposal,
  travelClaimForm,
};

/** Every form brokers (and their clients) can fill in online. Add new forms here. */
export const onlineForms: FormDefinition[] = [
  buildingApplication,
  landlordProtectApplication,
  corporateTravelProposal,
  paIndividualProposal,
  paGroupProposal,
  paHealthDeclaration,
  professionalIndemnityProposal,
  noClaimsDeclaration,
  travelClaimForm,
  paClaimForm,
];

/** Every proposal form for a product (several for Personal Accident), in the order above. */
export const proposalFormsFor = (productSlug: string) =>
  onlineForms.filter((f) => (f.resource ?? "proposal-forms") === "proposal-forms" && f.productSlugs.includes(productSlug));

export const getForm = (id: string | undefined) => onlineForms.find((f) => f.id === (id || "building"));
/** The proposal form for a product, used by "Apply now" on the product page. */
export const applicationFormFor = (productSlug: string) =>
  onlineForms.find((f) => (f.resource ?? "proposal-forms") === "proposal-forms" && f.productSlugs.includes(productSlug));

export const formBySlug = (slug: string) => onlineForms.find((f) => f.slug === slug);
