import { buildingApplication } from "./building";
import { corporateTravelProposal } from "./corporate-travel";
import { landlordProtectApplication } from "./landlord-protect";
import { noClaimsDeclaration } from "./no-claims-declaration";
import { professionalIndemnityProposal } from "./professional-indemnity";
import type { FormDefinition } from "./types";

export type { Condition, Field, FormDefinition, Part, Section, TextBlock } from "./types";
export { buildingApplication, corporateTravelProposal, landlordProtectApplication, noClaimsDeclaration, professionalIndemnityProposal };

/** Every form brokers (and their clients) can fill in online. Add new forms here. */
export const onlineForms: FormDefinition[] = [buildingApplication, landlordProtectApplication, corporateTravelProposal, professionalIndemnityProposal, noClaimsDeclaration];

export const getForm = (id: string | undefined) => onlineForms.find((f) => f.id === (id || "building"));
export const formBySlug = (slug: string) => onlineForms.find((f) => f.slug === slug);
