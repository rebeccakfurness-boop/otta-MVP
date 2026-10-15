import type { FormDefinition } from "./types";

// The Personal Accident and Illness Claim Form (09/2022 edition), as
// structured data (see building.ts). The doctor's statement is completed by
// the claimant's doctor, online or on the PDF.

const accident = { field: "claimType", equals: "An accident" };
const illness = { field: "claimType", equals: "An illness" };

export const paClaimForm: FormDefinition = {
  id: "pa-claim",
  slug: "personal-accident-claim",
  title: "Personal Accident and Illness Claim Form",
  pdfTitle: ["Personal Accident and", "Illness Claim Form"],
  shortTitle: "Personal accident claim",
  summary:
    "Make a claim under a personal accident and illness policy: the claimant's statement and the doctor's statement. Fill it in online and send it straight to the Otta claims team, or download it as a PDF.",
  fileName: "Otta-Personal-Accident-and-Illness-Claim-Form",
  sendTo: "the Otta claims team",
  teamEmail: "claims@ottainsurance.co.nz",
  productSlugs: ["personal-accident-insurance"],
  resource: "claim-forms",
  keyFields: { name: "insuredName", detail: "occupation" },
  confirm: {
    broker: "I confirm the claimant has seen this claim form and the information in it is true and correct.",
    client: "I declare that all information in this claim form is true and correct.",
  },
  parts: [
    {
      id: "claimant",
      band: "Statement and declaration during disablement",
      sections: [
        {
          id: "insured",
          title: "The Insured",
          fields: [
            { kind: "text", name: "insuredName", label: "Full name of insured", span: 4 },
            { kind: "date", name: "dateOfBirth", label: "Date of birth", span: 2 },
            { kind: "text", name: "address", label: "Address", placeholder: "Start typing an address", address: {} },
            { kind: "text", name: "occupation", label: "Occupation", span: 2 },
            { kind: "email", name: "email", label: "Email", span: 2 },
            { kind: "tel", name: "phone", label: "Phone", span: 2 },
            { kind: "choice", name: "claimType", label: "Is this claim for an accident or an illness?", options: ["An accident", "An illness"] },
          ],
        },
        {
          id: "accident",
          title: "Complete this section for an accident",
          showIf: accident,
          fields: [
            { kind: "date", name: "accidentDate", label: "Date of accident", span: 2 },
            { kind: "text", name: "accidentTime", label: "Time", placeholder: "e.g. 2:30 pm", span: 2 },
            { kind: "text", name: "accidentPlace", label: "Place of accident", span: 2 },
            { kind: "textarea", name: "whatHappened", label: "Describe fully what happened and what you were doing at the time" },
            { kind: "textarea", name: "injuries", label: "Describe the nature and extent of your injuries" },
            { kind: "yesno", name: "freeFromDisease", label: "Were you perfectly free from any kind of disease or physical disability at the time of the accident?" },
            { kind: "textarea", name: "witnesses", label: "Name and contact details of any witnesses to the accident", optional: true },
          ],
        },
        {
          id: "illness",
          title: "Complete this section for an illness",
          showIf: illness,
          fields: [
            { kind: "date", name: "illDate", label: "On what date were you taken ill?", span: 2 },
            { kind: "textarea", name: "illness", label: "Describe the illness from which you are suffering" },
            { kind: "yesno", name: "sufferedBefore", label: "Have you ever suffered from the same or a similar illness before?" },
            { kind: "text", name: "sufferedWhen", label: "When?", span: 2, showIf: { field: "sufferedBefore", equals: "yes" } },
            { kind: "text", name: "previousPractitioner", label: "Name of the medical practitioner who attended you", span: 4, showIf: { field: "sufferedBefore", equals: "yes" } },
          ],
        },
        {
          id: "allCases",
          title: "Complete this section in all cases",
          fields: [
            { kind: "date", name: "firstAdvice", label: "When did you first obtain medical advice?", span: 3 },
            { kind: "date", name: "ceasedWork", label: "On what date did you cease work?", span: 3 },
            { kind: "yesno", name: "doctorAttending", label: "Is the doctor still attending you?" },
            { kind: "text", name: "doctorDetails", label: "Doctor's name and address", showIf: { field: "doctorAttending", equals: "yes" } },
            { kind: "yesno", name: "confinedToHouse", label: "Are you necessarily confined to the house?" },
            { kind: "textarea", name: "usualOccupation", label: "Are you able to attend to any portion of your usual occupation?" },
            { kind: "date", name: "resumeDate", label: "On what date do you estimate you will be able to resume the whole of your ordinary or similar occupation?", span: 3 },
            {
              kind: "yesno",
              name: "otherCompensation",
              label: "Are you claiming or entitled to claim compensation from ACC or any insurer, company, society, organisation or other source?",
            },
            { kind: "textarea", name: "otherCompensationDetails", label: "Please give particulars", showIf: { field: "otherCompensation", equals: "yes" } },
            { kind: "textarea", name: "remarks", label: "General remarks", optional: true },
          ],
        },
      ],
    },
    {
      id: "doctor",
      band: "Doctor's statement",
      sections: [
        {
          id: "doctorStatement",
          title: "Doctor's declaration",
          intro: "To be completed by the claimant's doctor. If the doctor isn't completing it online, leave this section blank and send them the PDF.",
          fields: [
            { kind: "text", name: "drName", label: "Doctor's name", span: 3, optional: true },
            { kind: "text", name: "drAddress", label: "Address", span: 3, optional: true },
            { kind: "textarea", name: "drNature", label: "What is the nature of the ailment or accident?", optional: true },
            { kind: "date", name: "drAware", label: "On what date did the patient first become aware of the ailment?", span: 3, optional: true },
            { kind: "date", name: "drAdvice", label: "On what date did the patient first obtain medical advice?", span: 3, optional: true },
            { kind: "date", name: "drCeased", label: "On what date did the patient cease work?", span: 3, optional: true },
            { kind: "yesno", name: "drBefore", label: "Has the patient ever suffered from this same or a similar ailment before?", optional: true },
            { kind: "textarea", name: "drBeforeDetails", label: "Please supply details", showIf: { field: "drBefore", equals: "yes" }, optional: true },
            { kind: "date", name: "drPartial", label: "When do you estimate the patient will be fit for partial duties?", span: 3, optional: true },
            { kind: "date", name: "drFull", label: "When do you estimate the patient will be fit for full duties?", span: 3, optional: true },
            { kind: "textarea", name: "drPrognosis", label: "Prognosis and general remarks relating to current and ongoing treatment required", optional: true },
            { kind: "text", name: "drSignature", label: "Doctor's signature", hint: "The doctor types their name to sign.", span: 3, optional: true },
            { kind: "date", name: "drDate", label: "Date", span: 3, optional: true },
          ],
        },
      ],
    },
    {
      id: "declaration",
      band: "Declarations",
      sections: [],
      text: [
        {
          heading: "Declaration",
          paragraphs: [
            "The declaration below must be completed by the claimant before the claim can be assessed. I declare that all information contained in this claim form is true and correct.",
          ],
        },
        {
          heading: "Release of medical records",
          paragraphs: [
            "I hereby authorise any treatment provider to release any information in relation to my past or present medical condition to Wholesale Insurance Services, PO Box 10027, Wellington 6143.",
          ],
        },
      ],
      signOff: [
        { kind: "signature", name: "signature", label: "Claimant's signature", hint: "The claimant types their name to sign.", span: 3 },
        { kind: "date", name: "signedDate", label: "Date", span: 3 },
      ],
    },
  ],
};
