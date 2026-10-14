// Demo data for the broker portal prototype. Replace with Neon Postgres
// queries in src/lib/portal/data.ts; nothing else reads this file.
import { wordingsFor } from "@/content/documents";
import { products } from "@/content/products";
import type { Brokerage, Claim, FormType, Policy, PortalForm, PortalUser, QuoteRequest, StaffUser } from "./types";

export const brokerages: Brokerage[] = [
  { id: "brk-harbour", name: "Harbour Insurance Brokers", domains: ["harbourbrokers.co.nz"], microsoftTenantIds: [] },
  { id: "brk-southern", name: "Southern Alps Brokers", domains: ["southernalpsbrokers.co.nz"], microsoftTenantIds: [] },
  { id: "brk-kowhai", name: "Kowhai Property Management", domains: ["kowhaipm.co.nz"], microsoftTenantIds: [] },
];

// Otta staff who can sign in to the admin portal.
export const staff: StaffUser[] = [
  {
    id: "stf-admin",
    name: "Otta Admin",
    email: "admin@ottainsurance.co.nz",
    role: "Admin",
    // Demo password: OttaAdmin2026!
    passwordHash: "$2b$12$PwcjONkhb9JEAqYsH/IF0uqtz0RdbncvjfiRNRjt05Hh.iFv3NkkC",
  },
];

export const users: PortalUser[] = [
  {
    id: "usr-alex",
    name: "Alex Morgan",
    email: "demo@harbourbrokers.co.nz",
    brokerageId: "brk-harbour",
    // Demo password: OttaDemo2026!
    passwordHash: "$2b$12$kgw6YZ.3I6gyPzLWMBC.3.dB5rb1sN1UMjvrXtE.1eYFyA.vI.j4u",
  },
  { id: "usr-priya", name: "Priya Shah", email: "priya@harbourbrokers.co.nz", brokerageId: "brk-harbour" },
  { id: "usr-tom", name: "Tom Ngata", email: "tom@southernalpsbrokers.co.nz", brokerageId: "brk-southern" },
  { id: "usr-mere", name: "Mere Tipene", email: "mere@kowhaipm.co.nz", brokerageId: "brk-kowhai" },
];

const B = "brk-harbour";

export const quotes: QuoteRequest[] = [
  {
    ref: "Q-26-0148", brokerageId: B, insured: "Kauri Ridge Engineering Ltd", productSlug: "liability-insurance",
    submitted: "2026-10-09", status: "In review", underwriter: "Liability team",
    summary: "Professional Indemnity, $2m limit, consulting engineers, 14 staff.",
    history: [{ date: "2026-10-09", event: "Quote request submitted" }, { date: "2026-10-10", event: "Underwriter reviewing" }],
    source: "ihq",
  },
  {
    ref: "Q-26-0146", brokerageId: B, insured: "Southern Lights Rowing Club", productSlug: "corporate-travel-insurance",
    submitted: "2026-10-06", status: "Quoted", underwriter: "Travel team",
    summary: "Annual team travel for 22 athletes including competition and equipment in transit.",
    history: [{ date: "2026-10-06", event: "Quote request submitted" }, { date: "2026-10-07", event: "Underwriter reviewing" }, { date: "2026-10-08", event: "Quote issued" }],
    source: "ihq",
  },
  {
    ref: "Q-26-0141", brokerageId: B, insured: "Tamaki Community Homes Trust", productSlug: "social-and-community-housing-insurance",
    submitted: "2026-10-01", status: "Submitted", underwriter: "Property team",
    summary: "Portfolio of 36 community housing units across South Auckland.",
    history: [{ date: "2026-10-01", event: "Quote request submitted" }],
    source: "ihq",
  },
  {
    ref: "Q-26-0137", brokerageId: B, insured: "Hana Williams", productSlug: "personal-accident-insurance",
    submitted: "2026-09-24", status: "Bound", underwriter: "Accident team", policyId: "pol-pa-2611",
    summary: "Agreed value Personal Accident and Illness for a commercial helicopter pilot.",
    history: [{ date: "2026-09-24", event: "Quote request submitted" }, { date: "2026-09-25", event: "Quote issued" }, { date: "2026-09-29", event: "Policy bound" }],
    source: "ihq",
  },
  {
    ref: "Q-26-0129", brokerageId: B, insured: "Greenlane Property Holdings", productSlug: "rental-property-insurance",
    submitted: "2026-09-15", status: "Bound", underwriter: "Property team", policyId: "pol-rp-2604",
    summary: "Four residential rental properties, combined site sum insured $3.1m.",
    history: [{ date: "2026-09-15", event: "Quote request submitted" }, { date: "2026-09-17", event: "Quote issued" }, { date: "2026-09-20", event: "Policy bound" }],
    source: "ihq",
  },
  {
    ref: "Q-26-0118", brokerageId: B, insured: "Coastal Charter Flights Ltd", productSlug: "corporate-travel-insurance",
    submitted: "2026-08-28", status: "Declined", underwriter: "Travel team",
    summary: "Travel cover for staff including travel to a sanctioned territory.",
    history: [{ date: "2026-08-28", event: "Quote request submitted" }, { date: "2026-08-30", event: "Declined: travel to sanctioned territories is excluded" }],
    source: "ihq",
  },
  {
    ref: "Q-26-0150", brokerageId: "brk-southern", insured: "Remarkables Heli Tours Ltd", productSlug: "personal-accident-insurance",
    submitted: "2026-10-11", status: "Submitted", underwriter: "Accident team",
    summary: "Personal Accident and Illness for four commercial helicopter pilots.",
    history: [{ date: "2026-10-11", event: "Quote request submitted" }],
    source: "ihq",
  },
  {
    ref: "Q-26-0144", brokerageId: "brk-southern", insured: "Wanaka Outdoor Education Trust", productSlug: "corporate-travel-insurance",
    submitted: "2026-10-03", status: "In review", underwriter: "Travel team",
    summary: "Staff and instructor travel for international expeditions.",
    history: [{ date: "2026-10-03", event: "Quote request submitted" }, { date: "2026-10-05", event: "Underwriter reviewing" }],
    source: "manual",
  },
  {
    ref: "Q-26-0139", brokerageId: "brk-kowhai", insured: "Kowhai managed portfolio (12 properties)", productSlug: "landlord-insurance",
    submitted: "2026-09-27", status: "Quoted", underwriter: "Landlord team",
    summary: "Landlord insurance for 12 professionally managed rental properties.",
    history: [{ date: "2026-09-27", event: "Quote request submitted" }, { date: "2026-09-30", event: "Quote issued" }],
    source: "ihq",
  },
  {
    ref: "Q-26-0122", brokerageId: "brk-southern", insured: "Queenstown Surveyors Ltd", productSlug: "liability-insurance",
    submitted: "2026-09-02", status: "Bound", underwriter: "Liability team", policyId: "pol-li-2622",
    summary: "Professional Indemnity, $1m limit, land surveyors.",
    history: [{ date: "2026-09-02", event: "Quote request submitted" }, { date: "2026-09-04", event: "Quote issued" }, { date: "2026-09-08", event: "Policy bound" }],
    source: "ihq",
  },
];

function docs(prefix: string, issued: string) {
  return [
    { id: `${prefix}-sch`, name: "Policy schedule", kind: "Schedule", issued },
    { id: `${prefix}-wording`, name: "Policy wording", kind: "Wording", issued },
    { id: `${prefix}-coc`, name: "Certificate of currency", kind: "Certificate", issued },
    { id: `${prefix}-inv`, name: "Tax invoice", kind: "Invoice", issued },
  ];
}

export const policies: Policy[] = [
  { id: "pol-pa-2611", number: "OTT-PA-26-0611", brokerageId: B, insured: "Hana Williams", productSlug: "personal-accident-insurance", start: "2026-09-29", end: "2027-09-29", premium: 2840, sumInsured: "$2,000 weekly benefit", documents: docs("pa2611", "2026-09-29"), source: "ihq", ihqRef: "IHQ-104611" },
  { id: "pol-rp-2604", number: "OTT-RP-26-0604", brokerageId: B, insured: "Greenlane Property Holdings", productSlug: "rental-property-insurance", start: "2026-09-20", end: "2027-09-20", premium: 9415, sumInsured: "$3,100,000", documents: docs("rp2604", "2026-09-20"), source: "ihq", ihqRef: "IHQ-104604" },
  { id: "pol-tr-2519", number: "OTT-TR-25-0519", brokerageId: B, insured: "Aotea Engineering Group", productSlug: "corporate-travel-insurance", start: "2025-11-30", end: "2026-11-30", premium: 6120, documents: docs("tr2519", "2025-11-30"), source: "manual" },
  { id: "pol-ll-2547", number: "OTT-LL-25-0547", brokerageId: B, insured: "Westshore Property Management", productSlug: "landlord-insurance", start: "2025-12-15", end: "2026-12-15", premium: 3380, documents: docs("ll2547", "2025-12-15"), source: "manual" },
  { id: "pol-li-2533", number: "OTT-LI-25-0533", brokerageId: B, insured: "Fernbird Architects Ltd", productSlug: "liability-insurance", start: "2026-02-01", end: "2027-02-01", premium: 4975, sumInsured: "$1,000,000 limit", documents: docs("li2533", "2026-02-01"), source: "ihq", ihqRef: "IHQ-103533" },
  { id: "pol-sc-2490", number: "OTT-SC-24-0490", brokerageId: B, insured: "Tamaki Community Homes Trust", productSlug: "social-and-community-housing-insurance", start: "2024-10-01", end: "2025-10-01", premium: 21800, documents: docs("sc2490", "2024-10-01"), source: "manual" },
  { id: "pol-li-2622", number: "OTT-LI-26-0622", brokerageId: "brk-southern", insured: "Queenstown Surveyors Ltd", productSlug: "liability-insurance", start: "2026-09-08", end: "2027-09-08", premium: 3890, sumInsured: "$1,000,000 limit", documents: docs("li2622", "2026-09-08"), source: "ihq", ihqRef: "IHQ-104622" },
  { id: "pol-tr-2588", number: "OTT-TR-25-0588", brokerageId: "brk-southern", insured: "Central Otago Wine Co", productSlug: "corporate-travel-insurance", start: "2025-12-01", end: "2026-12-01", premium: 4410, documents: docs("tr2588", "2025-12-01"), source: "manual" },
  { id: "pol-ll-2601", number: "OTT-LL-26-0601", brokerageId: "brk-kowhai", insured: "Kowhai managed portfolio (8 properties)", productSlug: "landlord-insurance", start: "2026-03-01", end: "2027-03-01", premium: 5260, documents: docs("ll2601", "2026-03-01"), source: "ihq", ihqRef: "IHQ-103601" },
  { id: "pol-rp-2575", number: "OTT-RP-25-0575", brokerageId: "brk-kowhai", insured: "Hutt Valley Rentals Ltd", productSlug: "rental-property-insurance", start: "2025-11-20", end: "2026-11-20", premium: 7140, sumInsured: "$2,400,000", documents: docs("rp2575", "2025-11-20"), source: "manual" },
];

export const claims: Claim[] = [
  {
    id: "clm-2611-01", number: "CL-26-0412", brokerageId: B, policyId: "pol-pa-2611", insured: "Hana Williams", productSlug: "personal-accident-insurance",
    lodged: "2026-10-06", dateOfLoss: "2026-10-02", status: "Being assessed", claimed: 8000, handler: "Accident team",
    description: "Fractured wrist in a fall at home. Unable to fly for an estimated 6 weeks; weekly benefit claimed.",
    history: [{ date: "2026-10-06", event: "Claim lodged" }, { date: "2026-10-08", event: "Medical certificate received" }, { date: "2026-10-09", event: "Being assessed" }],
    source: "ihq",
  },
  {
    id: "clm-2604-01", number: "CL-26-0398", brokerageId: B, policyId: "pol-rp-2604", insured: "Greenlane Property Holdings", productSlug: "rental-property-insurance",
    lodged: "2026-09-28", dateOfLoss: "2026-09-25", status: "Approved", claimed: 14200, handler: "Property team",
    description: "Water damage to kitchen and hallway at 14 Ranfurly Road from a burst hot water cylinder.",
    history: [{ date: "2026-09-28", event: "Claim lodged" }, { date: "2026-09-30", event: "Loss adjuster appointed" }, { date: "2026-10-07", event: "Claim approved, repairs authorised" }],
    source: "ihq",
  },
  {
    id: "clm-2519-01", number: "CL-26-0331", brokerageId: B, policyId: "pol-tr-2519", insured: "Aotea Engineering Group", productSlug: "corporate-travel-insurance",
    lodged: "2026-07-14", dateOfLoss: "2026-07-03", status: "Settled", claimed: 3650, paid: 3650, handler: "Travel team",
    description: "Laptop and luggage stolen from a hotel in Singapore during a site visit.",
    history: [{ date: "2026-07-14", event: "Claim lodged" }, { date: "2026-07-20", event: "Police report received" }, { date: "2026-07-24", event: "Claim settled" }],
    source: "ihq",
  },
  {
    id: "clm-2547-01", number: "CL-26-0287", brokerageId: B, policyId: "pol-ll-2547", insured: "Westshore Property Management", productSlug: "landlord-insurance",
    lodged: "2026-05-19", dateOfLoss: "2026-05-01", status: "Settled", claimed: 5200, paid: 4600, handler: "Landlord team",
    description: "Tenant left owing six weeks' rent at 3 Harbour View Road. Paid less the policy excess.",
    history: [{ date: "2026-05-19", event: "Claim lodged" }, { date: "2026-05-27", event: "Tenancy Tribunal order received" }, { date: "2026-06-03", event: "Claim settled" }],
    source: "manual",
  },
  {
    id: "clm-2533-01", number: "CL-26-0205", brokerageId: B, policyId: "pol-li-2533", insured: "Fernbird Architects Ltd", productSlug: "liability-insurance",
    lodged: "2026-03-11", dateOfLoss: "2026-02-20", status: "Declined", claimed: 22000, handler: "Liability team",
    description: "Notification of a client complaint about a design delay. Declined: the circumstances were known before the policy started.",
    history: [{ date: "2026-03-11", event: "Claim lodged" }, { date: "2026-03-25", event: "Declined: prior known circumstances" }],
    source: "ihq",
  },
  {
    id: "clm-2588-01", number: "CL-26-0405", brokerageId: "brk-southern", policyId: "pol-tr-2588", insured: "Central Otago Wine Co", productSlug: "corporate-travel-insurance",
    lodged: "2026-10-02", dateOfLoss: "2026-09-29", status: "Lodged", claimed: 2100, handler: "Travel team",
    description: "Flight cancellation costs for two staff travelling to a trade fair in Sydney.",
    history: [{ date: "2026-10-02", event: "Claim lodged" }],
    source: "ihq",
  },
  {
    id: "clm-2575-01", number: "CL-26-0366", brokerageId: "brk-kowhai", policyId: "pol-rp-2575", insured: "Hutt Valley Rentals Ltd", productSlug: "rental-property-insurance",
    lodged: "2026-08-21", dateOfLoss: "2026-08-14", status: "Settled", claimed: 9800, paid: 8800, handler: "Property team",
    description: "Storm damage to the roof and guttering of a rental in Naenae.",
    history: [{ date: "2026-08-21", event: "Claim lodged" }, { date: "2026-08-26", event: "Builder's quote received" }, { date: "2026-09-04", event: "Claim settled" }],
    source: "ihq",
  },
];

const formTypes: FormType[] = ["Proposal form", "Renewal declaration", "Claim form"];

export const forms: PortalForm[] = [
  ...products.flatMap((p) =>
    formTypes.map((type) => ({
      id: `${p.slug}-${type.toLowerCase().replace(/ /g, "-")}`,
      title: `${p.name.replace(" Insurance", "")} ${type.toLowerCase()}`,
      type,
      productSlug: p.slug,
      updated: "2026-09-01",
    })),
  ),
  { id: "general-broker-of-record", title: "Broker of record change", type: "General", updated: "2026-09-01" },
  { id: "general-mid-term-alteration", title: "Mid-term alteration request", type: "General", updated: "2026-09-01" },
  { id: "general-cancellation", title: "Policy cancellation request", type: "General", updated: "2026-09-01" },
];

// Link each policy's "Policy wording" to the current wording for its product.
for (const policy of policies) {
  const file = wordingsFor(policy.productSlug)[0]?.file;
  for (const doc of policy.documents) if (doc.kind === "Wording" && file) doc.file = file;
}
