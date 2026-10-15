import type { FormDefinition } from "./types";

// The Accountants Supplementary Questionnaire (06/2024 edition), completed by
// accounting practices with the Professional Indemnity proposal.

const activities = [
  ["accounts", "Accounts preparation"],
  ["taxAdvisory", "Tax advisory"],
  ["taxAgent", "Tax agent"],
  ["bookKeeping", "Book keeping"],
  ["consultancy", "Consultancy"],
  ["directorships", "Directorships"],
  ["trusteeships", "Trusteeships"],
  ["estatePlanning", "Estate planning"],
  ["auditPrivate", "Audit: private company"],
  ["auditPublic", "Audit: public company"],
  ["companySecretary", "Company secretary"],
  ["administration", "Administration services"],
  ["mergers", "Mergers, acquisitions or disposals"],
  ["insolvency", "Insolvency, liquidations or receiverships"],
  ["itConsultancy", "IT consultancy"],
  ["other", "Other (please describe below)"],
].map(([key, label]) => ({ key, label }));

export const accountantsQuestionnaire: FormDefinition = {
  id: "accountants",
  slug: "accountants-supplementary-questionnaire",
  title: "Accountants Supplementary Questionnaire",
  pdfTitle: ["Accountants Supplementary", "Questionnaire"],
  shortTitle: "Accountants questionnaire",
  summary:
    "For accounting practices applying for professional indemnity cover, with the Professional Indemnity proposal: revenue by activity and two practice questions. Fill it in online and send it straight to the Otta team, or download it as a PDF.",
  fileName: "Otta-Accountants-Supplementary-Questionnaire",
  sendTo: "the Otta liability team",
  teamEmail: "liability@ottainsurance.co.nz",
  productSlugs: ["liability-insurance"],
  keyFields: { name: "practiceName", detail: "practiceName" },
  parts: [
    {
      id: "questionnaire",
      band: "Accountants supplementary questionnaire",
      sections: [
        {
          id: "practice",
          title: "The Practice",
          fields: [{ kind: "text", name: "practiceName", label: "Name of the practice", hint: "As named on the Professional Indemnity proposal." }],
        },
        {
          id: "activities",
          title: "Activities",
          fields: [
            {
              kind: "grid",
              name: "revenue",
              label: "Please provide a full breakdown of your revenue by activity (%)",
              hint: "The total of all activities listed should equal 100%. Leave an activity blank if you don't do it.",
              rows: activities,
              columns: [{ key: "percent", label: "% of revenue" }],
              total: true,
            },
            { kind: "textarea", name: "otherWork", label: "Description of \"other\" work", optional: true },
          ],
        },
        {
          id: "questions",
          title: "Questions",
          fields: [
            {
              kind: "yesno",
              name: "taxSchemes",
              label: "Have you ever been involved in the promotion or creation of investment geared taxation schemes, wrap mortgages or other tax minimisation schemes?",
            },
            { kind: "textarea", name: "taxSchemesDetails", label: "Please provide full details", showIf: { field: "taxSchemes", equals: "yes" } },
            { kind: "yesno", name: "reviewed", label: "Has the practice been the subject of a review by an independent review body in the last 5 years?" },
            { kind: "textarea", name: "reviewedDetails", label: "Please provide details and the outcome", showIf: { field: "reviewed", equals: "yes" } },
          ],
        },
      ],
      signOff: [
        { kind: "signature", name: "signature", label: "Authorised signature", hint: "Type your name, then sign with your finger, mouse or by typing.", span: 3 },
        { kind: "text", name: "signatoryName", label: "Full name of individual", span: 3 },
        { kind: "text", name: "position", label: "Position", span: 3 },
        { kind: "date", name: "signedDate", label: "Date", span: 3 },
      ],
    },
  ],
};
