import { inviteFor, type FormDefinition } from "./types";

// The Professional Indemnity Renewal Declaration (06/2024 edition), as
// structured data (see building.ts).

export const piRenewalDeclaration: FormDefinition = {
  id: "pi-renewal",
  slug: "professional-indemnity-renewal-declaration",
  title: "Professional Indemnity Renewal Declaration",
  pdfTitle: ["Professional Indemnity", "Renewal Declaration"],
  shortTitle: "Professional indemnity renewal",
  summary:
    "Renew a professional indemnity policy: confirm the business, income by region and any claims or circumstances. Fill it in online and send it straight to the Otta team, or download it as a PDF.",
  fileName: "Otta-Professional-Indemnity-Renewal-Declaration",
  sendTo: "the Otta liability team",
  teamEmail: "liability@ottainsurance.co.nz",
  productSlugs: ["liability-insurance"],
  resource: "renewal-declarations",
  keyFields: { name: "namedInsured", detail: "policyNumber" },
  invite: inviteFor("professional indemnity renewal declaration"),
  parts: [
    {
      id: "renewal",
      band: "Applicant, business and financial information",
      sections: [
        {
          id: "applicant",
          title: "Applicant Details",
          fields: [
            { kind: "text", name: "policyNumber", label: "Policy number", span: 4 },
            { kind: "date", name: "inceptionDate", label: "Inception date", span: 2 },
            { kind: "text", name: "namedInsured", label: "Named insured" },
            { kind: "text", name: "address", label: "Address", placeholder: "Start typing an address", address: {} },
          ],
        },
        {
          id: "business",
          title: "Business Details",
          fields: [
            { kind: "textarea", name: "professionalBusiness", label: "Please provide a detailed description of your Professional Business which is to be covered by this policy" },
          ],
        },
        {
          id: "financial",
          title: "Financial Information",
          fields: [
            {
              kind: "grid",
              name: "income",
              label: "Total gross income by region and financial year ($)",
              hint: "Leave a region blank if you have no income there.",
              rows: [
                { key: "nz", label: "New Zealand" },
                { key: "australia", label: "Australia" },
                { key: "pacific", label: "Pacific Islands" },
                { key: "asia", label: "Asia" },
                { key: "ukEurope", label: "UK & Europe" },
                { key: "usaCanada", label: "USA & Canada" },
                { key: "other", label: "Other" },
              ],
              columns: [
                { key: "current", label: "Current financial year" },
                { key: "next", label: "Next financial year" },
              ],
              total: true,
              money: true,
            },
            { kind: "text", name: "otherRegions", label: "Other regions (please specify)", optional: true },
          ],
        },
        {
          id: "claims",
          title: "Claims Details",
          fields: [
            {
              kind: "yesno",
              name: "claimsOrCircumstances",
              label:
                "Are you, or any partner, principal, director or employee, after enquiry, aware of any claims or circumstances which might result in claims against you or your predecessors in business, or any present or former partner, principal, director or employee of the business?",
            },
            { kind: "textarea", name: "claimsDetails", label: "Please provide full details", showIf: { field: "claimsOrCircumstances", equals: "yes" } },
          ],
        },
      ],
    },
    {
      id: "declaration",
      band: "Declaration",
      sections: [],
      text: [
        {
          heading: "Declaration",
          paragraphs: [
            "I / We declare that all information provided in this declaration is true and correct, and that no material facts have been misstated or omitted after enquiry with all applicants. The information provided will form the basis of any insurance contract and the contract may be avoided if any statement in this declaration is substantially incorrect or material to the contract.",
            "I / We agree that if any of the information provided in this declaration changes between the date of this declaration and the inception date of the insurance policy then I / We will give notice thereof.",
          ],
        },
      ],
      signOff: [
        { kind: "text", name: "signature", label: "Authorised signature", hint: "Type your name to sign.", span: 3 },
        { kind: "text", name: "signatoryName", label: "Full name of individual", span: 3 },
        { kind: "text", name: "position", label: "Position", span: 3 },
        { kind: "date", name: "signedDate", label: "Date", span: 3 },
      ],
    },
  ],
};
