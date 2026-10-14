/**
 * An organisation that signs in to the broker portal. Most are brokerages; a
 * network (e.g. Steadfast) sees the business of its member brokerages, and a
 * coverholder (e.g. Beazley for property) sees the business on its products.
 */
export type OrgKind = "brokerage" | "network" | "coverholder";

export type Brokerage = {
  id: string;
  name: string;
  /** Defaults to "brokerage". */
  kind?: OrgKind;
  /** Brokerages only: the network they belong to. */
  networkId?: string;
  /** Coverholders only: the products they write. */
  productSlugs?: string[];
  /** Email domains whose staff can sign in with SSO. */
  domains: string[];
  /** Microsoft Entra tenant IDs trusted for this brokerage's SSO. */
  microsoftTenantIds: string[];
};

/** Where a record came from: typed in by Otta staff, or synced from InsuredHQ. */
export type RecordSource = "manual" | "ihq";

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Underwriter" | "Operations";
  passwordHash?: string;
};

export type PortalUser = {
  id: string;
  name: string;
  email: string;
  brokerageId: string;
  /** bcrypt hash; absent for SSO-only users. */
  passwordHash?: string;
  /**
   * Brokerage users only, set by Otta: "own" sees only the business they placed,
   * "brokerage" sees the whole brokerage's. Never shown to the broker.
   */
  sees?: "own" | "brokerage";
};

export type QuoteStatus = "Submitted" | "In review" | "Quoted" | "Bound" | "Declined";

export type QuoteRequest = {
  ref: string;
  brokerageId: string;
  insured: string;
  productSlug: string;
  submitted: string; // ISO date
  status: QuoteStatus;
  summary: string;
  underwriter: string;
  history: { date: string; event: string }[];
  /** Policy created when the quote was bound. */
  policyId?: string;
  /** The broker who placed it. */
  brokerUserId?: string;
  source: RecordSource;
};

export type PolicyDocument = { id: string; name: string; kind: string; issued: string; file?: string };

export type Policy = {
  id: string;
  number: string;
  brokerageId: string;
  insured: string;
  productSlug: string;
  start: string;
  end: string;
  premium: number;
  sumInsured?: string;
  documents: PolicyDocument[];
  source: RecordSource;
  /** Reference in InsuredHQ, when synced from there. */
  ihqRef?: string;
  /** The broker who placed it. */
  brokerUserId?: string;
};

export type FormType = "Proposal form" | "Renewal declaration" | "Claim form" | "General";

export type PortalForm = {
  id: string;
  title: string;
  type: FormType;
  productSlug?: string;
  updated: string;
  file?: string;
};

export type ClaimStatus = "Lodged" | "Being assessed" | "Approved" | "Settled" | "Declined";

export type Claim = {
  id: string;
  number: string;
  brokerageId: string;
  policyId: string;
  insured: string;
  productSlug: string;
  lodged: string; // ISO date
  dateOfLoss: string;
  description: string;
  status: ClaimStatus;
  /** Amount claimed, when known. */
  claimed?: number;
  /** Amount paid so far. */
  paid?: number;
  handler: string;
  /** The broker who placed the policy. */
  brokerUserId?: string;
  history: { date: string; event: string }[];
  source: RecordSource;
};
