import type { FormDefinition } from "./types";

// The Professional Indemnity Insurance Proposal, as structured data (see building.ts).

const claimsYes = (field: string) => ({ field, equals: "yes" });

export const professionalIndemnityProposal: FormDefinition = {
  id: "professional-indemnity",
  slug: "professional-indemnity-proposal",
  title: "Professional Indemnity Insurance Proposal",
  pdfTitle: ["Professional Indemnity", "Insurance Proposal"],
  shortTitle: "Professional indemnity proposal",
  summary:
    "Apply for professional indemnity insurance (a claims made policy). Fill it in online and send it straight to the Otta team, or download it as a PDF.",
  fileName: "Otta-Professional-Indemnity-Proposal",
  sendTo: "the Otta liability team",
  teamEmail: "liability@ottainsurance.co.nz",
  productSlugs: ["liability-insurance"],
  keyFields: { name: "namedInsured", detail: "principalAddress" },
  parts: [
    {
      id: "notice",
      band: "Notice",
      sections: [],
      text: [
        {
          heading: "Notice",
          paragraphs: [
            "This proposal form is for a claims made policy. The policy will only respond to claims which are first made against You and notified during the policy period.",
            "Before You enter into a contract of insurance with an insurer, You have a duty to disclose to the insurer every matter that You know, or could reasonably be expected to know, is material to the insurer's decision whether to accept the risk of the insurance and, if so, on what terms.",
            "You have the same duty to disclose those matters to the insurer before You renew, extend, vary or reinstate a contract of general insurance.",
            "You are required to advise Us in writing of any changes to material facts that may affect the insurance as soon as possible. However, Your duty does not require You to disclose facts:",
          ],
          bullets: [
            "That diminish the risk undertaken by the insurer;",
            "That are common knowledge;",
            "That Your insurer knows or, in the ordinary course of their business, ought to know; and",
            "As to which compliance with Your duty is waived by the insurer.",
          ],
        },
        {
          heading: "Who needs to tell Us",
          paragraphs: ["You must answer Our questions in this way for You and for anyone else You wish to be covered by the Policy."],
        },
        {
          heading: "Non-Disclosure",
          paragraphs: [
            "If You fail to comply with Your duty of disclosure, the insurer may be entitled to reduce their liability under the contract in respect of a claim or may cancel the contract.",
            "If Your non-disclosure is fraudulent, the insurer may also have the option of avoiding the contract from its beginning.",
          ],
        },
      ],
    },
    {
      id: "proposal",
      band: "Applicant and Business",
      sections: [
        {
          id: "applicant",
          title: "Applicant Details",
          fields: [
            { kind: "text", name: "namedInsured", label: "Name insured", span: 4 },
            { kind: "year", name: "yearEstablished", label: "Year established", span: 2 },
            { kind: "text", name: "subsidiaries", label: "Names of subsidiaries", optional: true, hint: "Leave blank if none." },
            { kind: "text", name: "principalAddress", label: "Principal address", placeholder: "Start typing an address", address: {} },
            { kind: "text", name: "postalAddress", label: "Postal address", span: 4 },
            { kind: "text", name: "website", label: "Website", optional: true, span: 2 },
            {
              kind: "yesno",
              name: "nameChanged",
              label:
                "During the past five years has the name been changed, any other business been purchased, any merger or consolidation taken place or has the nature of the business changed significantly?",
            },
            { kind: "textarea", name: "nameChangedDetails", label: "Please provide details", showIf: claimsYes("nameChanged") },
          ],
        },
        {
          id: "business",
          title: "Business Details",
          fields: [
            {
              kind: "textarea",
              name: "professionalBusiness",
              label: "Please provide a detailed description of your Professional Business which is to be covered by this policy",
            },
            {
              kind: "units",
              name: "activities",
              label: "Percentage of your total gross income for each activity from your last financial year",
              hint: "The percentages should add up to 100%.",
              addLabel: "Add an activity",
              columns: [
                { key: "details", label: "Details of activities", kind: "text", placeholder: "e.g. Structural engineering design" },
                { key: "percentage", label: "Percentage (%)", kind: "number", placeholder: "60" },
              ],
            },
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
              hint: "Last year actual, current year projected, next year estimated. Leave a region blank if you have no income there.",
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
                { key: "last", label: "Last financial year (actual)" },
                { key: "current", label: "Current financial year (projected)" },
                { key: "next", label: "Next financial year (estimate)" },
              ],
              total: true,
              money: true,
            },
            { kind: "text", name: "otherRegions", label: "Other regions (please specify)", optional: true },
            { kind: "number", name: "subcontractedPercent", label: "What percentage of your fee income is paid to subcontractors or consultants?", span: 3 },
            { kind: "textarea", name: "subcontractedWork", label: "Please describe what work is subcontracted out", optional: true },
            { kind: "yesno", name: "largeClient", label: "Does any one client account for more than 25% of your annual income?" },
            {
              kind: "units",
              name: "largestContracts",
              label: "Please provide the following details of your 3 largest contracts",
              addLabel: "Add a contract",
              columns: [
                { key: "principal", label: "Name of principal", kind: "text", placeholder: "e.g. Auckland Council" },
                { key: "details", label: "Contract details, services and duration", kind: "text", placeholder: "Design review, 18 months" },
                { key: "fees", label: "Fees earned ($)", kind: "money", placeholder: "$120,000" },
              ],
            },
          ],
        },
        {
          id: "staff",
          title: "Staff Details",
          fields: [
            {
              kind: "grid",
              name: "staff",
              label: "Please provide the number of employees in each category",
              rows: [
                { key: "principals", label: "Principals, partners and directors" },
                { key: "professionals", label: "Qualified professionals" },
                { key: "technical", label: "Other technical staff" },
              ],
              columns: [{ key: "number", label: "Number" }],
              total: true,
            },
            {
              kind: "units",
              name: "principals",
              label: "Please provide details in respect of all principals, partners and directors",
              addLabel: "Add a person",
              columns: [
                { key: "name", label: "Name", kind: "text", placeholder: "Full name" },
                { key: "qualifications", label: "Qualifications", kind: "text", placeholder: "e.g. BE (Civil), CPEng" },
                { key: "qualified", label: "Year qualified", kind: "number", placeholder: "2008" },
                { key: "years", label: "Years as principal, partner or director", kind: "number", placeholder: "10" },
              ],
            },
          ],
        },
        {
          id: "contracts",
          title: "Contractual Agreements",
          fields: [
            {
              kind: "yesno",
              name: "standardClientContract",
              label: "Do you use a standard contractual agreement with your clients?",
              hint: "If yes, please email a copy to the Otta liability team with this proposal.",
            },
            {
              kind: "yesno",
              name: "guarantees",
              label: "Do you ever provide contractual guarantees or agree to hold another party harmless?",
              showIf: { field: "standardClientContract", equals: "no" },
            },
            { kind: "yesno", name: "consultantAgreement", label: "Do you use a standard contractual agreement when engaging independent consultants or contractors?" },
            {
              kind: "yesno",
              name: "consultantInsurance",
              label: "Do you ensure that independent consultants or contractors maintain their own professional indemnity insurance?",
            },
          ],
        },
      ],
    },
    {
      id: "history",
      band: "Insurance and Claims History",
      sections: [
        {
          id: "insuranceHistory",
          title: "Insurance History",
          fields: [
            {
              kind: "yesno",
              name: "declined",
              label: "Have you ever had any insurance declined or cancelled, renewal refused, special conditions imposed or a claim rejected?",
            },
            { kind: "textarea", name: "declinedDetails", label: "Please provide full details", showIf: claimsYes("declined") },
            { kind: "yesno", name: "currentCover", label: "Do you currently have professional indemnity insurance?" },
            { kind: "text", name: "currentInsurer", label: "Insurer", span: 4, showIf: claimsYes("currentCover") },
            { kind: "date", name: "currentExpiry", label: "Expiry date", span: 2, showIf: claimsYes("currentCover") },
            { kind: "money", name: "currentLimit", label: "Limit", span: 2, showIf: claimsYes("currentCover") },
            { kind: "money", name: "currentExcess", label: "Excess", span: 2, showIf: claimsYes("currentCover") },
            { kind: "money", name: "currentPremium", label: "Premium", span: 2, showIf: claimsYes("currentCover") },
          ],
        },
        {
          id: "claimsHistory",
          title: "Claims History",
          note: "If a current loss summary is available from your present and past insurers, please email a copy to the Otta liability team.",
          fields: [
            {
              kind: "yesno",
              name: "disciplinary",
              label: "Has any partner, principal, director or staff member ever been the subject of disciplinary proceedings for professional misconduct?",
            },
            { kind: "textarea", name: "disciplinaryDetails", label: "Please provide full details", showIf: claimsYes("disciplinary") },
            {
              kind: "yesno",
              name: "negligenceClaims",
              label: "Have any claims for professional negligence ever been made against any party who is to be insured by this policy?",
            },
            {
              kind: "textarea",
              name: "negligenceClaimsDetails",
              label:
                "Please provide full details for each matter, including the date notified, the name of the insurer, details of the allegations, the amounts claimed, any amounts paid and the current status of the claim",
              showIf: claimsYes("negligenceClaims"),
            },
            {
              kind: "yesno",
              name: "circumstances",
              label:
                "Are you, or any partner, principal, director or employee, after enquiry, aware of any claims or circumstances which might result in claims against you or your predecessors in business or any present or former partner, principal, director or employee of the business?",
            },
            {
              kind: "textarea",
              name: "circumstancesDetails",
              label:
                "Please provide full details for each matter, including the name of the claimant or potential claimant, a description of the allegations and an estimate of the amount of potential liability",
              showIf: claimsYes("circumstances"),
            },
          ],
        },
        {
          id: "cover",
          title: "Cover Required",
          fields: [
            { kind: "choice", name: "limit", label: "Limit of indemnity required", options: ["$1M", "$2M", "$5M", "Other"] },
            { kind: "money", name: "limitOther", label: "Other limit of indemnity", span: 3, showIf: { field: "limit", equals: "Other" } },
            { kind: "choice", name: "excess", label: "Level of excess required", options: ["$2,000", "$5,000", "$10,000", "$20,000", "Other"] },
            { kind: "money", name: "excessOther", label: "Other level of excess", span: 3, showIf: { field: "excess", equals: "Other" } },
          ],
        },
      ],
      text: [
        {
          heading: "Declaration",
          paragraphs: [
            "I / We declare that all information provided in this proposal form is true and correct, and that no material facts have been misstated or omitted after enquiry with all applicants. The information provided will form the basis of any insurance contract and the contract may be avoided if any statement in this proposal is substantially incorrect or material to the contract.",
            "I / We agree that if any of the information provided in this proposal form changes between the date of this proposal and the inception date of the insurance policy then I / We will give notice thereof.",
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
