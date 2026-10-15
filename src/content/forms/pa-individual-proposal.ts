import type { FormDefinition } from "./types";

// The Personal Accident and Illness Proposal for one person (09/2022 edition),
// as structured data (see building.ts).

const conditions = ["conditionsCirculatory", "conditionsSystems", "conditionsBody", "conditionsAddiction"];
const extensions: [string, string][] = [
  ["extAirTravel", "Air travel other than as a passenger in a properly licensed multi-engined aircraft operated by a licensed commercial air carrier"],
  ["extExtraRisk", "Any other occupation, sport (including contact sports such as rugby), pastime or activity which is likely to involve extra risk of accident"],
  ["extRacing", "Driving or riding in any kind of race or competition"],
  ["extHangGliding", "Hang-gliding or parachuting"],
  ["extHunting", "Hunting"],
  ["extCaving", "Potholing or caving"],
  ["extMotorcycles", "Riding motor cycles or motor scooters"],
  ["extClimbing", "Rock climbing or mountaineering"],
  ["extDiving", "Skin diving involving the use of a breathing apparatus"],
  ["extWinterSports", "Winter sports"],
];

export const paIndividualProposal: FormDefinition = {
  id: "pa-individual",
  slug: "personal-accident-proposal",
  title: "Personal Accident and Illness Proposal",
  pdfTitle: ["Personal Accident and", "Illness Proposal"],
  shortTitle: "Personal accident proposal",
  summary:
    "Apply for personal accident and illness cover for one person: lump sum and weekly benefits. Fill it in online and send it straight to the Otta team, or download it as a PDF.",
  fileName: "Otta-Personal-Accident-and-Illness-Proposal",
  sendTo: "the Otta accident team",
  teamEmail: "travel@ottainsurance.co.nz",
  productSlugs: ["personal-accident-insurance"],
  keyFields: { name: "insuredName", detail: "occupation" },
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
            "Prior to entering into a contract of insurance You have a duty to disclose certain information. You have the same duty to disclose prior to renewing, extending, varying or reinstating an insurance contract. This is Your Duty of Disclosure.",
            "What You must tell Us: Your Duty of Disclosure means that when answering the questions in this Proposal, You have a legal obligation to tell Us everything You know, or which a reasonable person in Your circumstances would know, that is relevant to Our decision to insure You.",
            "But Your Duty of Disclosure is not limited simply to the questions in this Proposal. It extends to any information that is relevant to Our decision to offer You insurance. We will use Your answers and the information You have provided to Us in deciding whether to insure You, and on what terms We will offer to insure You.",
            "Also, Your Duty of Disclosure does not end when You have answered the questions in this Proposal. You are also required to tell Us if circumstances change between the time You complete this Proposal, and the date recorded on Your Schedule that the Policy starts. On each renewal or change to Your Policy, You also have a Duty of Disclosure.",
            "If You do not comply with Your Duty of Disclosure and complete the questions in the Proposal accurately, and also provide Us with all information relevant to Our decision to offer You insurance, We may refuse to pay a claim, or cancel or avoid Your Policy (avoidance means that the Policy has never legally existed). We may also have the right to retain premiums that You have paid, regardless that the Policy has been avoided.",
            "Please read this Proposal and the notes contained in it carefully to ensure:",
          ],
          bullets: [
            "You are aware of all Your contractual and legal rights and obligations;",
            "The Policy provides the insurance cover that You require;",
            "You are aware of the limits regarding Policy coverage, and what We will pay You under the Policy.",
          ],
        },
      ],
    },
    {
      id: "people",
      band: "The policy owner and the insured",
      sections: [
        {
          id: "owner",
          title: "The Policy Owner",
          fields: [
            { kind: "text", name: "policyOwner", label: "Full name of Policy Owner" },
            { kind: "text", name: "ownerAddress", label: "Address for notices", placeholder: "Start typing an address", address: {} },
            { kind: "tel", name: "ownerPhone", label: "Phone", span: 2, optional: true },
            { kind: "tel", name: "ownerMobile", label: "Mobile", span: 2, optional: true },
            { kind: "email", name: "ownerEmail", label: "Email", span: 2 },
            {
              kind: "yesno",
              name: "ownerBankruptCriminal",
              label: "Has the Policy Owner ever been declared bankrupt, or committed or been charged with, or convicted of any, criminal offence?",
            },
            {
              kind: "textarea",
              name: "ownerBankruptCriminalDetails",
              label: "Please provide details, including the nature of the bankruptcy or crime (whether alleged or convicted) and when it occurred",
              showIf: { field: "ownerBankruptCriminal", equals: "yes" },
            },
            { kind: "text", name: "relationship", label: "Relationship to the person to be insured", placeholder: "e.g. Employer, Self" },
          ],
        },
        {
          id: "insured",
          title: "The Proposed Insured",
          intro: "Referred to from here on as the Insured.",
          fields: [
            { kind: "text", name: "insuredName", label: "Full name of Insured", span: 4 },
            { kind: "date", name: "insuredDob", label: "Date of birth", span: 2 },
            { kind: "text", name: "insuredAddress", label: "Address", placeholder: "Start typing an address", address: {} },
            { kind: "tel", name: "insuredPhone", label: "Phone", span: 2, optional: true },
            { kind: "tel", name: "insuredMobile", label: "Mobile", span: 2, optional: true },
            { kind: "email", name: "insuredEmail", label: "Email", span: 2 },
            { kind: "number", name: "height", label: "Height (cm)", span: 2 },
            { kind: "number", name: "weight", label: "Weight (kg)", span: 2 },
            { kind: "number", name: "hoursPerWeek", label: "Hours worked per week", span: 2 },
            { kind: "text", name: "occupation", label: "Full description of the Insured's occupation" },
            { kind: "yesno", name: "nzResident", label: "Is the Insured a New Zealand resident?" },
            { kind: "textarea", name: "tasks", label: "What are the Insured's tasks and responsibilities in their occupation?" },
            { kind: "text", name: "yearsInBusiness", label: "How long has the Insured been in this business?", span: 3 },
            { kind: "text", name: "yearsAtLocation", label: "How long at this location?", span: 3 },
            { kind: "yesno", name: "otherBusiness", label: "Does the Insured engage in any other business?" },
            { kind: "text", name: "otherBusinessDetails", label: "Please specify", showIf: { field: "otherBusiness", equals: "yes" } },
            { kind: "money", name: "weeklyIncome", label: "What is the Insured's average weekly income?", span: 3 },
            {
              kind: "yesno",
              name: "insuredBankruptCriminal",
              label: "Has the Insured ever been declared bankrupt, or committed or been charged with, or convicted of any, criminal offence?",
            },
            {
              kind: "textarea",
              name: "insuredBankruptCriminalDetails",
              label: "Please provide details, including the nature of the bankruptcy or crime (whether alleged or convicted) and when it occurred",
              showIf: { field: "insuredBankruptCriminal", equals: "yes" },
            },
          ],
        },
      ],
    },
    {
      id: "cover",
      band: "Benefits and cover required",
      sections: [
        {
          id: "benefits",
          title: "Benefits and Cover Required",
          note: "The Lump Sum Benefit maximum is $150,000. The Weekly Benefit maximum is $1,500.",
          fields: [
            { kind: "money", name: "lumpSum", label: "Lump Sum Benefit", span: 3 },
            { kind: "money", name: "weeklyBenefit", label: "Weekly Benefit", span: 3 },
            { kind: "text", name: "periodOfInsurance", label: "Period of insurance and commencement date", placeholder: "e.g. 12 months from 1 December 2026" },
          ],
        },
        {
          id: "benefitPeriod",
          title: "Weekly Benefit: Benefit Period",
          note:
            "Please note: 1. The Policy includes Medical Expenses of up to 15% of the total amount of any claim paid for Temporary Total Disablement or Temporary Partial Disablement, without additional premium. 2. To be eligible for Us to consider this Proposal, the Insured must be less than 55 years of age. 3. The maximum Weekly Benefit We will insure is 75% of the Insured's income at the time this Proposal is completed. 4. We will not pay Weekly Benefits when an Insured is more than 70 years of age, even if the full Benefit Period has not expired at the time of the claim.",
          fields: [
            { kind: "number", name: "benefitWeeks", label: "Benefit period (weeks)", hint: "The maximum Benefit Period We will agree to is 104 weeks.", span: 3 },
            { kind: "choice", name: "waitPeriod", label: "Wait period", options: ["7 days", "14 days", "28 days", "60 days", "90 days", "180 days"] },
          ],
        },
        {
          id: "personal",
          title: "Personal Details",
          fields: [
            { kind: "yesno", name: "previouslyInsured", label: "Has the Insured been insured against accident or illness now or previously?" },
            { kind: "text", name: "previousInsurers", label: "Name of previous insurer(s)", showIf: { field: "previouslyInsured", equals: "yes" } },
            {
              kind: "yesno",
              name: "specialTerms",
              label: "Have special terms ever been imposed for life or disability insurance, or has such insurance ever been declined, cancelled or renewal refused by an insurer?",
            },
            { kind: "textarea", name: "specialTermsDetails", label: "Please provide full details", showIf: { field: "specialTerms", equals: "yes" } },
            { kind: "yesno", name: "offWork", label: "Has an accident or illness ever prevented the Insured from attending to their business or occupation for a period or periods of more than 7 days?" },
            { kind: "textarea", name: "offWorkDetails", label: "Please provide full details", showIf: { field: "offWork", equals: "yes" } },
          ],
        },
        {
          id: "health",
          title: "Health",
          intro: "Has the Insured ever suffered from, or been treated for, any of the following:",
          fields: [
            {
              kind: "yesno",
              name: "conditionsCirculatory",
              label: "Abnormal blood pressure, hypertension, aneurism, diabetes, gout, rheumatism, rheumatic fever, arthritis, fits, ulcers, cancer, paralysis, varicose veins, hernia, melanoma or asthma?",
            },
            { kind: "yesno", name: "conditionsSystems", label: "Any disease or disorder of the nervous, digestive, genitourinary, reproductive, circulatory or respiratory system?" },
            { kind: "yesno", name: "conditionsBody", label: "Any disorder of the back, spine, limbs, heart, mind, sight or hearing?" },
            { kind: "yesno", name: "conditionsAddiction", label: "Alcoholism or drug addiction?" },
            { kind: "textarea", name: "conditionsDetails", label: "Please provide full details", showIf: { anyOf: conditions, equals: "yes" } },
            {
              kind: "yesno",
              name: "surgery",
              label: "Has the Insured ever been hospitalised, undergone, or have any reason to believe they may need to undergo, any surgical treatment of a serious nature?",
            },
            { kind: "textarea", name: "surgeryDetails", label: "Please provide full details", showIf: { field: "surgery", equals: "yes" } },
            { kind: "yesno", name: "tobacco", label: "Does the Insured smoke or otherwise consume tobacco?" },
            {
              kind: "choice",
              name: "tobaccoType",
              label: "What type?",
              options: ["Cigarettes", "Pipe", "Cigars", "Snuff", "Chewing tobacco"],
              showIf: { field: "tobacco", equals: "yes" },
            },
            { kind: "number", name: "tobaccoPerDay", label: "How many cigarettes, cigars or pipes per day?", span: 3, showIf: { field: "tobacco", equals: "yes" } },
            { kind: "yesno", name: "alcoholDrugs", label: "Does the Insured consume alcohol or drugs (prescription, non-prescription or recreational, for example cannabis)?" },
            {
              kind: "textarea",
              name: "alcoholDrugsDetails",
              label: "Please specify the type, quantity (for alcohol: wine, beer etc) and frequency of use",
              showIf: { field: "alcoholDrugs", equals: "yes" },
            },
          ],
        },
        {
          id: "extensions",
          title: "Optional Extensions",
          intro:
            "Do You wish the Insured to be covered for the following optional extensions? They are not covered unless specifically agreed and endorsed on Your Policy. Selecting an optional extension may alter the premium payable.",
          fields: [
            ...extensions.map(([name, label]) => ({ kind: "yesno" as const, name, label })),
            { kind: "text", name: "extMotorcyclesCc", label: "State the cc rating", span: 3, showIf: { field: "extMotorcycles", equals: "yes" } },
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
            "I hereby declare, subject to any contrary disclosure within this Proposal Form, that the state of my health is excellent and does not interfere with my occupation.",
            "I fully understand that any pre-existing condition(s) will not be covered under this policy.",
            "Pursuant to the Privacy Act 2020, I hereby authorise the release of the above information for any treatment provider and additionally authorise any treatment provider to release any information in relation to my past or present condition to Insurance Wholesale Limited (Otta), Level 1, 3/527A Rosebank Road, Avondale, Auckland 1026.",
          ],
        },
      ],
      signOff: [
        { kind: "signature", name: "signature", label: "Signed", hint: "Type your name, then sign with your finger, mouse or by typing.", span: 3 },
        { kind: "date", name: "signedDate", label: "Date", span: 3 },
      ],
    },
  ],
};
