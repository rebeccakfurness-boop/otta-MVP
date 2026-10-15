import { products } from "../products";
import type { FormDefinition } from "./types";

// The No Claims / Material Changes Declaration, completed by the insured
// before a policy is bound or renewed (see building.ts for how forms work).

export const noClaimsDeclaration: FormDefinition = {
  id: "no-claims-declaration",
  slug: "no-claims-declaration",
  title: "No Claims / Material Changes Declaration",
  pdfTitle: ["No Claims / Material", "Changes Declaration"],
  shortTitle: "No claims declaration",
  summary:
    "Confirm nothing has changed since the proposal form and there have been no losses. Complete it online and send it straight to the Otta team, or download it as a PDF.",
  fileName: "Otta-No-Claims-Material-Changes-Declaration",
  sendTo: "the Otta team",
  teamEmail: "hello@ottainsurance.co.nz",
  productSlugs: products.map((p) => p.slug),
  resource: "renewal-declarations",
  keyFields: { name: "company", detail: "policyNumber" },
  confirm: {
    broker:
      "I confirm the insured has made the declaration below: after enquiry, the information given in the proposal form has not materially altered and there have been no known or reported losses or circumstances which might give rise to a claim.",
    client:
      "I / We declare that, after enquiry, the information given in the proposal form has not materially altered and that there have been no known or reported losses or circumstances which might give rise to a claim.",
  },
  parts: [
    {
      id: "declaration",
      band: "To be completed by the Insured",
      sections: [
        {
          id: "details",
          title: "Details",
          fields: [
            { kind: "text", name: "company", label: "Insured or company name", span: 4 },
            { kind: "text", name: "policyNumber", label: "Policy or quote number", optional: true, span: 2 },
            { kind: "date", name: "proposalDate", label: "Date of the proposal form", span: 2 },
          ],
        },
      ],
      text: [
        {
          heading: "Declaration",
          paragraphs: [
            "I / We declare that, after enquiry, the information given in the proposal form dated above has not materially altered and that there have been no known or reported losses or circumstances which might give rise to a Claim.",
          ],
        },
      ],
      signOff: [
        { kind: "signature", name: "signature", label: "Signed", hint: "Type your name, then sign with your finger, mouse or by typing.", span: 2 },
        { kind: "text", name: "signatoryName", label: "Full name", span: 2 },
        { kind: "date", name: "signedDate", label: "Date", span: 2 },
      ],
    },
  ],
};
