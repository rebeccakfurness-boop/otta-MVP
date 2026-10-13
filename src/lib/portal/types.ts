export type Brokerage = {
  id: string;
  name: string;
  /** Email domains whose staff can sign in with SSO. */
  domains: string[];
  /** Microsoft Entra tenant IDs trusted for this brokerage's SSO. */
  microsoftTenantIds: string[];
};

export type PortalUser = {
  id: string;
  name: string;
  email: string;
  brokerageId: string;
  /** bcrypt hash; absent for SSO-only users. */
  passwordHash?: string;
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
