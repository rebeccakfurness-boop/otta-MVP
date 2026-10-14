import { inviteFor, type FormDefinition } from "./types";

// The Group Personal Accident and Illness Proposal (10/2022 edition), as
// structured data (see building.ts).

export const paGroupProposal: FormDefinition = {
  id: "pa-group",
  slug: "group-personal-accident-proposal",
  title: "Group Personal Accident and Illness Proposal",
  pdfTitle: ["Group Personal Accident", "and Illness Proposal"],
  shortTitle: "Group personal accident proposal",
  summary:
    "Apply for group personal accident and illness cover for employees or members. Fill it in online and send it straight to the Otta team, or download it as a PDF.",
  fileName: "Otta-Group-Personal-Accident-and-Illness-Proposal",
  sendTo: "the Otta accident team",
  teamEmail: "travel@ottainsurance.co.nz",
  productSlugs: ["personal-accident-insurance"],
  keyFields: { name: "policyOwner", detail: "address" },
  invite: inviteFor("group personal accident and illness proposal"),
  parts: [
    {
      id: "introduction",
      band: "Introduction",
      sections: [],
      text: [
        {
          heading: "Introduction: form completion",
          paragraphs: [
            "Please answer all questions and provide details as requested.",
            "There are certain words used in this Proposal that start with a capital letter. These words have special meanings that are set out in the Definitions section of the Policy.",
          ],
        },
        {
          heading: "Privacy",
          paragraphs: [
            "The information collected in this Proposal will be used to assess Your request for insurance and to provide other insurance services in accordance with our privacy policy. The information is collected and held by Insurance Wholesale Limited, trading as Otta. The Insured has rights of access to and the right to correct this information in accordance with the provisions of the Privacy Act 2020.",
          ],
        },
        {
          heading: "Important: Your duty of disclosure",
          paragraphs: [
            "Before You enter into a contract of insurance with an insurer, You have a duty to disclose to the insurer every matter that You know, or could reasonably be expected to know, is material to the insurer's decision whether to accept the risk of the insurance and, if so, on what terms.",
            "You have the same duty to disclose those matters to the insurer before You renew, extend, vary or reinstate a contract of general insurance.",
            "You are to give Us in writing as soon as possible details of any change materially varying any of the facts or circumstances existing at the commencement of this insurance. Your duty, however, does not require disclosure of a matter:",
          ],
          bullets: [
            "That diminishes the risk undertaken by the insurer;",
            "That is common knowledge;",
            "That Your insurer knows or, in the ordinary course of their business, ought to know; and",
            "As to which compliance with Your duty is waived by the insurer.",
          ],
        },
        {
          heading: "Non-disclosure",
          paragraphs: [
            "If You fail to comply with Your duty of disclosure, the insurer may be entitled to reduce their liability under the contract in respect of a claim or may cancel the contract.",
            "If Your non-disclosure is fraudulent, the insurer may also have the option of avoiding the contract from its inception.",
          ],
        },
        {
          heading: "Who needs to tell us?",
          paragraphs: ["You must answer Our questions in this way for You and for anyone else You wish to be covered by the Policy."],
        },
      ],
    },
    {
      id: "proposal",
      band: "The policy owner and insureds",
      sections: [
        {
          id: "owner",
          title: "The Policy Owner",
          fields: [
            { kind: "text", name: "policyOwner", label: "Full name of Policy Owner" },
            { kind: "text", name: "address", label: "Address for notices", placeholder: "Start typing an address", address: {} },
            { kind: "tel", name: "phone", label: "Phone", span: 2, optional: true },
            { kind: "tel", name: "mobile", label: "Mobile", span: 2, optional: true },
            { kind: "email", name: "email", label: "Email", span: 2 },
            {
              kind: "choice",
              name: "relationship",
              label: "Relationship to the people to be insured",
              options: ["Employer", "Member of Association", "Beneficiary"],
            },
          ],
        },
        {
          id: "claims",
          title: "Claims Information",
          fields: [
            { kind: "yesno", name: "offWork", label: "Have there been any incidents which have led to an Insured person being off work for more than 7 days?" },
            { kind: "textarea", name: "offWorkDetails", label: "Please provide details", showIf: { field: "offWork", equals: "yes" } },
          ],
        },
        {
          id: "healthAndSafety",
          title: "Health and Safety Log",
          note: "Please attach your Health and Safety incident log: email it to the Otta team with your application reference, or reply to the confirmation email.",
          fields: [
            { kind: "yesno", name: "hasIncidentLog", label: "Do you keep a Health and Safety incident log?" },
          ],
        },
        {
          id: "insureds",
          title: "Proposed Insureds",
          intro: "Add each person to be insured. For a large group, list the first few here and email the full list as a spreadsheet.",
          note: "The weekly benefit is a maximum of 75% of weekly income. The stand-down period is a minimum of 7 days for office jobs and 14 days for manual jobs. Lump sum benefits are a maximum of 3 times annual income. Pre-existing medical conditions are not covered by the policy.",
          fields: [
            {
              kind: "units",
              name: "insureds",
              label: "Proposed insureds",
              addLabel: "Add a person",
              columns: [
                { key: "name", label: "Name", kind: "text", placeholder: "Full name" },
                { key: "dob", label: "Date of birth", kind: "text", placeholder: "DD/MM/YYYY" },
                { key: "jobTitle", label: "Job title", kind: "text", placeholder: "e.g. Site manager" },
                { key: "jobType", label: "Job type", kind: "text", placeholder: "Admin or manual" },
                { key: "annualIncome", label: "Annual income", kind: "money", placeholder: "$" },
                { key: "weeklyBenefit", label: "Weekly benefit", kind: "money", placeholder: "$" },
                { key: "standDown", label: "Stand-down period", kind: "text", placeholder: "e.g. 7 days" },
                { key: "lumpSum", label: "Lump sum benefit", kind: "money", placeholder: "$" },
              ],
            },
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
            "I / We declare that all information provided in this Proposal form is true and correct, and that no material facts have been misstated or omitted after enquiry with all applicants.",
            "I / We understand that the information provided will form the basis of any insurance contract and that the contract may be avoided if any statement in this Proposal is substantially incorrect and material to the contract.",
            "I / We agree that if any of the information provided in this Proposal form changes between the date of this Proposal and the inception date of the insurance policy then I / We will advise the changes to Otta.",
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
