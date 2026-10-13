// Demo data for the broker portal prototype. Replace with Neon Postgres
// queries in src/lib/portal/data.ts; nothing else reads this file.
import { products } from "@/content/products";
import type { Brokerage, FormType, Policy, PortalForm, PortalUser, QuoteRequest } from "./types";

export const brokerages: Brokerage[] = [
  { id: "brk-harbour", name: "Harbour Insurance Brokers", domains: ["harbourbrokers.co.nz"], microsoftTenantIds: [] },
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
];

const B = "brk-harbour";

export const quotes: QuoteRequest[] = [
  {
    ref: "Q-26-0148", brokerageId: B, insured: "Kauri Ridge Engineering Ltd", productSlug: "liability-insurance",
    submitted: "2026-10-09", status: "In review", underwriter: "Liability team",
    summary: "Professional Indemnity, $2m limit, consulting engineers, 14 staff.",
    history: [{ date: "2026-10-09", event: "Quote request submitted" }, { date: "2026-10-10", event: "Underwriter reviewing" }],
  },
  {
    ref: "Q-26-0146", brokerageId: B, insured: "Southern Lights Rowing Club", productSlug: "corporate-travel-insurance",
    submitted: "2026-10-06", status: "Quoted", underwriter: "Travel team",
    summary: "Annual team travel for 22 athletes including competition and equipment in transit.",
    history: [{ date: "2026-10-06", event: "Quote request submitted" }, { date: "2026-10-07", event: "Underwriter reviewing" }, { date: "2026-10-08", event: "Quote issued" }],
  },
  {
    ref: "Q-26-0141", brokerageId: B, insured: "Tamaki Community Homes Trust", productSlug: "social-and-community-housing-insurance",
    submitted: "2026-10-01", status: "Submitted", underwriter: "Property team",
    summary: "Portfolio of 36 community housing units across South Auckland.",
    history: [{ date: "2026-10-01", event: "Quote request submitted" }],
  },
  {
    ref: "Q-26-0137", brokerageId: B, insured: "Hana Williams", productSlug: "personal-accident-insurance",
    submitted: "2026-09-24", status: "Bound", underwriter: "Accident team", policyId: "pol-pa-2611",
    summary: "Agreed value Personal Accident and Illness for a commercial helicopter pilot.",
    history: [{ date: "2026-09-24", event: "Quote request submitted" }, { date: "2026-09-25", event: "Quote issued" }, { date: "2026-09-29", event: "Policy bound" }],
  },
  {
    ref: "Q-26-0129", brokerageId: B, insured: "Greenlane Property Holdings", productSlug: "rental-property-insurance",
    submitted: "2026-09-15", status: "Bound", underwriter: "Property team", policyId: "pol-rp-2604",
    summary: "Four residential rental properties, combined site sum insured $3.1m.",
    history: [{ date: "2026-09-15", event: "Quote request submitted" }, { date: "2026-09-17", event: "Quote issued" }, { date: "2026-09-20", event: "Policy bound" }],
  },
  {
    ref: "Q-26-0118", brokerageId: B, insured: "Coastal Charter Flights Ltd", productSlug: "corporate-travel-insurance",
    submitted: "2026-08-28", status: "Declined", underwriter: "Travel team",
    summary: "Travel cover for staff including travel to a sanctioned territory.",
    history: [{ date: "2026-08-28", event: "Quote request submitted" }, { date: "2026-08-30", event: "Declined: travel to sanctioned territories is excluded" }],
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
  { id: "pol-pa-2611", number: "OTT-PA-26-0611", brokerageId: B, insured: "Hana Williams", productSlug: "personal-accident-insurance", start: "2026-09-29", end: "2027-09-29", premium: 2840, sumInsured: "$2,000 weekly benefit", documents: docs("pa2611", "2026-09-29") },
  { id: "pol-rp-2604", number: "OTT-RP-26-0604", brokerageId: B, insured: "Greenlane Property Holdings", productSlug: "rental-property-insurance", start: "2026-09-20", end: "2027-09-20", premium: 9415, sumInsured: "$3,100,000", documents: docs("rp2604", "2026-09-20") },
  { id: "pol-tr-2519", number: "OTT-TR-25-0519", brokerageId: B, insured: "Aotea Engineering Group", productSlug: "corporate-travel-insurance", start: "2025-11-30", end: "2026-11-30", premium: 6120, documents: docs("tr2519", "2025-11-30") },
  { id: "pol-ll-2547", number: "OTT-LL-25-0547", brokerageId: B, insured: "Westshore Property Management", productSlug: "landlord-insurance", start: "2025-12-15", end: "2026-12-15", premium: 3380, documents: docs("ll2547", "2025-12-15") },
  { id: "pol-li-2533", number: "OTT-LI-25-0533", brokerageId: B, insured: "Fernbird Architects Ltd", productSlug: "liability-insurance", start: "2026-02-01", end: "2027-02-01", premium: 4975, sumInsured: "$1,000,000 limit", documents: docs("li2533", "2026-02-01") },
  { id: "pol-sc-2490", number: "OTT-SC-24-0490", brokerageId: B, insured: "Tamaki Community Homes Trust", productSlug: "social-and-community-housing-insurance", start: "2024-10-01", end: "2025-10-01", premium: 21800, documents: docs("sc2490", "2024-10-01") },
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
