import { inviteFor, type FormDefinition } from "./types";

// The Declaration of Health for weekly accident and illness and lump sum
// accident cover (06/2024 edition), as structured data (see building.ts).

export const paHealthDeclaration: FormDefinition = {
  id: "pa-health",
  slug: "declaration-of-health",
  title: "Declaration of Health",
  pdfTitle: ["Declaration of", "Health"],
  shortTitle: "Declaration of health",
  summary:
    "A health declaration for each person to be covered for weekly accident and illness, or lump sum accident, benefits. Fill it in online and send it straight to the Otta team, or download it as a PDF.",
  fileName: "Otta-Declaration-of-Health",
  sendTo: "the Otta accident team",
  teamEmail: "travel@ottainsurance.co.nz",
  productSlugs: ["personal-accident-insurance"],
  keyFields: { name: "name", detail: "company" },
  invite: inviteFor("declaration of health"),
  parts: [
    {
      id: "declaration",
      band: "Weekly accident and illness, lump sum accident",
      sections: [
        {
          id: "person",
          title: "Your Details",
          fields: [
            { kind: "text", name: "name", label: "Name", span: 4 },
            { kind: "date", name: "dateOfBirth", label: "Date of birth", span: 2 },
            { kind: "text", name: "company", label: "Company" },
            { kind: "text", name: "address", label: "Address", placeholder: "Start typing an address", address: {} },
            { kind: "number", name: "height", label: "Height (cm)", span: 2 },
            { kind: "number", name: "weight", label: "Weight (kg)", span: 2 },
            { kind: "text", name: "occupation", label: "Current occupation(s)" },
            { kind: "yesno", name: "activelyAtWork", label: "I am currently actively at work." },
          ],
        },
        {
          id: "doctor",
          title: "Medical History",
          fields: [
            { kind: "yesno", name: "seenDoctor", label: "Have you been to your doctor in the past 12 months?" },
            {
              kind: "units",
              name: "visits",
              label: "Please provide details",
              addLabel: "Add a visit",
              showIf: { field: "seenDoctor", equals: "yes" },
              columns: [
                { key: "reason", label: "Reason", kind: "text", placeholder: "Reason for the visit" },
                { key: "date", label: "Date", kind: "text", placeholder: "DD/MM/YYYY" },
                { key: "medicine", label: "Medicine", kind: "text", placeholder: "Any medicine prescribed" },
                { key: "gp", label: "GP's name and address", kind: "text", placeholder: "Dr name, practice" },
              ],
            },
          ],
        },
      ],
      text: [
        {
          heading: "Declaration",
          paragraphs: [
            "I hereby declare, subject to any contrary disclosure within this form, that the state of my health is excellent and does not interfere with my occupation.",
            "I fully understand that any pre-existing condition(s) will not be covered under this policy.",
            "Pursuant to the Privacy Act 2020, I hereby authorise the release of the above information for any treatment provider and additionally authorise any treatment provider to release any information in relation to my past or present condition to Insurance Wholesale Limited (Otta), Level 1, 3/527A Rosebank Road, Avondale, Auckland 1026.",
          ],
        },
      ],
      signOff: [
        { kind: "text", name: "signature", label: "Signed", hint: "Type your name to sign.", span: 3 },
        { kind: "date", name: "signedDate", label: "Date", span: 3 },
      ],
    },
  ],
};
