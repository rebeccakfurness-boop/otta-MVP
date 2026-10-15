import type { FormDefinition } from "./types";

// The Travel and Accident Insurance Claim Form (07/2020 edition), as
// structured data (see building.ts). The claimant says what they are claiming
// for, and only those sections are shown.

const luggage = { field: "claimLuggage", equals: "yes" };
const cancellation = { field: "claimCancellation", equals: "yes" };
const medical = { field: "claimMedical", equals: "yes" };
const other = { field: "claimOther", equals: "yes" };

export const travelClaimForm: FormDefinition = {
  id: "travel-claim",
  slug: "travel-claim",
  title: "Travel and Accident Insurance Claim Form",
  pdfTitle: ["Travel and Accident", "Insurance Claim Form"],
  shortTitle: "Travel claim",
  summary:
    "Make a claim under a travel and accident policy: luggage and money, cancellation, medical, and other claims. Fill it in online and send it straight to the Otta claims team, or download it as a PDF.",
  fileName: "Otta-Travel-and-Accident-Claim-Form",
  sendTo: "the Otta claims team",
  teamEmail: "claims@ottainsurance.co.nz",
  productSlugs: ["corporate-travel-insurance"],
  resource: "claim-forms",
  keyFields: { name: "claimantName", detail: "insuredName" },
  confirm: {
    broker: "I confirm the claimant has read the privacy consent and declaration, and the information in this claim form is true and correct.",
    client: "I have read the privacy consent and declaration, and the information in this claim form is true and correct.",
  },
  parts: [
    {
      id: "claim",
      band: "Your claim",
      sections: [
        {
          id: "details",
          title: "1. Insured's and Claimant's Details",
          intro: "To help us consider your claim as soon as possible, please answer all questions in full.",
          fields: [
            { kind: "text", name: "insuredName", label: "Name of insured", hint: "The business or person the policy is in the name of.", span: 4 },
            { kind: "text", name: "policyNumber", label: "Policy number", span: 2 },
            { kind: "text", name: "claimantName", label: "Name of claimant", span: 4 },
            { kind: "email", name: "email", label: "Email", span: 2 },
            { kind: "text", name: "address", label: "Claimant's residential address", placeholder: "Start typing an address", address: {} },
            { kind: "tel", name: "phoneResidential", label: "Residential phone", span: 2, optional: true },
            { kind: "tel", name: "phoneBusiness", label: "Business phone", span: 2, optional: true },
            { kind: "tel", name: "phoneMobile", label: "Mobile", span: 2 },
            { kind: "date", name: "departureDate", label: "Date you left (or intended to leave) home or work for the journey from New Zealand", span: 3 },
            { kind: "date", name: "returnDate", label: "Date you returned (or intend to return) home or work after the journey", span: 3 },
          ],
        },
        {
          id: "claimTypes",
          title: "What are you claiming for?",
          intro: "Answer yes to each that applies. Only the sections you need will show.",
          fields: [
            { kind: "yesno", name: "claimLuggage", label: "Luggage, personal effects, travel documents, money or credit cards" },
            { kind: "yesno", name: "claimCancellation", label: "Travel cancellation, curtailment, additional expenses or a missed transport connection" },
            { kind: "yesno", name: "claimMedical", label: "Personal injury, medical expenses or medical evacuation" },
            { kind: "yesno", name: "claimOther", label: "Something else (for example personal liability, rental vehicle damage or kidnap and ransom)" },
          ],
        },
        {
          id: "luggage",
          title: "2. Luggage, Personal Effects, Travel Documents, Money, Credit Cards",
          showIf: luggage,
          note: "Please attach a copy of any police, airline or hotel report, receipts for the items and any other correspondence.",
          fields: [
            { kind: "date", name: "lossDate", label: "Date of the loss, theft or damage", span: 2 },
            { kind: "text", name: "lossTime", label: "Time", placeholder: "e.g. 3:15 pm", span: 2 },
            { kind: "text", name: "lossPlace", label: "Place", span: 2 },
            { kind: "textarea", name: "lossWhatHappened", label: "Please describe exactly what happened" },
            { kind: "yesno", name: "reported", label: "Was the matter reported to the police, airline or hotel?" },
            { kind: "textarea", name: "notReportedReason", label: "Please explain why it wasn't reported", showIf: { field: "reported", equals: "no" } },
            { kind: "textarea", name: "recoverySteps", label: "What other steps have been taken to recover the property?" },
            { kind: "yesno", name: "otherInsurance", label: "Do you have any other insurance on the property, e.g. householder's contents insurance?" },
            { kind: "textarea", name: "otherInsuranceDetails", label: "Please provide details", showIf: { field: "otherInsurance", equals: "yes" } },
            {
              kind: "units",
              name: "lostItems",
              label: "Property lost or damaged",
              addLabel: "Add an item",
              columns: [
                { key: "description", label: "Description", kind: "text", placeholder: "e.g. Laptop" },
                { key: "wherePurchased", label: "Where purchased", kind: "text", placeholder: "Store" },
                { key: "datePurchased", label: "Date of purchase", kind: "text", placeholder: "MM/YYYY" },
                { key: "originalCost", label: "Original cost", kind: "money", placeholder: "$" },
                { key: "replacementValue", label: "Replacement value or repair cost", kind: "money", placeholder: "$" },
              ],
            },
          ],
        },
        {
          id: "cancellation",
          title: "3. Travel Cancellation, Curtailment and Additional Expenses; Missed Transport Connection",
          showIf: cancellation,
          note: "For loss of deposit claims, please attach a detailed planned itinerary, including dates of departure and return.",
          fields: [
            {
              kind: "units",
              name: "cancellationCosts",
              label: "Costs paid and refunded",
              addLabel: "Add a provider",
              columns: [
                { key: "provider", label: "Airline, hotel, rental car company etc. (name, address, phone)", kind: "text", placeholder: "e.g. Air New Zealand" },
                { key: "amountPaid", label: "Amount paid NZ$", kind: "money", placeholder: "$" },
                { key: "amountRefunded", label: "Amount refunded NZ$", kind: "money", placeholder: "$" },
                { key: "residualLoss", label: "Residual loss NZ$", kind: "money", placeholder: "$" },
              ],
            },
            { kind: "date", name: "depositDate", label: "What date was the deposit paid?", span: 3 },
            { kind: "date", name: "cancellationDate", label: "Date of the cancellation", span: 3 },
            { kind: "textarea", name: "cancellationReason", label: "Reason for the cancellation of your journey" },
            {
              kind: "text",
              name: "otherPersonName",
              label: "If the cancellation was due to the illness, accident or death of someone other than the claimant: their name",
              optional: true,
              span: 4,
            },
            { kind: "number", name: "otherPersonAge", label: "Their age", optional: true, span: 2 },
            { kind: "text", name: "otherPersonRelationship", label: "Their relationship to the claimant", optional: true },
          ],
        },
        {
          id: "agent",
          title: "Declaration by Travel Consultant or Agent (loss of deposit claims only)",
          showIf: cancellation,
          intro:
            "I declare the information provided on this form is correct and I have taken all possible steps to recover the maximum refundable amount. The amounts claimed have not been and cannot be recovered.",
          fields: [
            { kind: "text", name: "agentName", label: "Agent's name", optional: true, span: 3 },
            { kind: "text", name: "agentCompany", label: "Company name", optional: true, span: 3 },
            { kind: "text", name: "agentAddress", label: "Company address", optional: true },
            { kind: "text", name: "agentSignature", label: "Agent's signature", hint: "The agent types their name to sign.", optional: true, span: 3 },
            { kind: "date", name: "agentDate", label: "Date", optional: true, span: 3 },
          ],
        },
        {
          id: "medical",
          title: "4. Personal Injury; Medical; Medical Evacuation",
          showIf: medical,
          note: "If your claim is the result of a medical condition, please attach a letter from your doctor detailing the date of diagnosis, treatment provided and so on.",
          fields: [
            { kind: "text", name: "patientName", label: "Patient's name", span: 4 },
            { kind: "date", name: "patientDob", label: "Date of birth", span: 2 },
            { kind: "date", name: "injuryDate", label: "Date the injury or illness first occurred", span: 2 },
            { kind: "text", name: "injuryTime", label: "Time", placeholder: "e.g. 9:00 am", span: 2 },
            { kind: "text", name: "injuryLocation", label: "Location and country", span: 2 },
            { kind: "textarea", name: "injuryNature", label: "Describe the nature of the injury or illness" },
            { kind: "textarea", name: "injuryHow", label: "How did the injury or illness occur?" },
            { kind: "yesno", name: "sufferedBefore", label: "Have you ever suffered from this injury or illness before?" },
            { kind: "textarea", name: "sufferedBeforeDetails", label: "Please state when and provide full details", showIf: { field: "sufferedBefore", equals: "yes" } },
            {
              kind: "units",
              name: "doctors",
              label: "Your general practitioner and treating doctor(s)",
              addLabel: "Add a doctor",
              columns: [
                { key: "name", label: "Doctor's name", kind: "text", placeholder: "Dr name" },
                { key: "address", label: "Address", kind: "text", placeholder: "Practice or hospital" },
                { key: "phone", label: "Phone", kind: "text", placeholder: "Phone number" },
              ],
            },
            { kind: "yesno", name: "recoverable", label: "Are these expenses recoverable from any other society, organisation or insurer?" },
            { kind: "textarea", name: "recoverableDetails", label: "Please provide details", showIf: { field: "recoverable", equals: "yes" } },
            {
              kind: "units",
              name: "medicalExpenses",
              label: "Itemise the expenses incurred",
              addLabel: "Add an expense",
              columns: [
                { key: "provider", label: "Name and address of medical provider", kind: "text", placeholder: "Hospital or clinic" },
                { key: "treatment", label: "Nature of injury or illness and treatment", kind: "text", placeholder: "e.g. X-ray and cast" },
                { key: "amount", label: "Amount NZ$", kind: "money", placeholder: "$" },
              ],
            },
          ],
        },
        {
          id: "other",
          title: "5. Other",
          showIf: other,
          note: "Please attach all available documents, receipts and invoices that support your claim.",
          fields: [
            {
              kind: "choice",
              name: "otherType",
              label: "What is the claim for?",
              options: [
                "Repatriation of mortal remains",
                "Personal liability",
                "Alternative employee or resumption of assignment expenses",
                "Rental vehicle collision damage and theft",
                "Extra-territorial workers' compensation",
                "Kidnap, ransom and extortion",
                "Political and natural disaster evacuation",
                "Traveller's family assistance",
              ],
            },
            { kind: "date", name: "eventDate", label: "Date of event", span: 3 },
            { kind: "text", name: "eventLocation", label: "Location and country", span: 3 },
            { kind: "textarea", name: "eventWhatHappened", label: "Describe exactly what happened" },
            {
              kind: "units",
              name: "otherExpenses",
              label: "Itemise the expenses incurred",
              addLabel: "Add an expense",
              columns: [
                { key: "provider", label: "Service provider", kind: "text", placeholder: "Provider" },
                { key: "description", label: "What the expenses were for", kind: "text", placeholder: "Description" },
                { key: "amount", label: "Amount NZ$", kind: "money", placeholder: "$" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "privacy",
      band: "Privacy consent and declaration",
      sections: [],
      text: [
        {
          heading: "6. Privacy",
          paragraphs: [
            "Insurance Wholesale Limited, trading as Otta, collects, uses and retains your personal information only in accordance with the principles in the Privacy Act 2020. Your personal information will be used by Otta, or any third party that provides the information to Otta, for the purpose of assessing your claim or your entitlement to benefits and, if the claim is accepted, for administration of the claim and for planning, product development and research purposes.",
            "Your personal information includes:",
          ],
          bullets: [
            "any information provided in relation to your claim;",
            "any information that is health information or sensitive information;",
            "any other personal information that you may provide to Insurance Wholesale Limited or its third party contractors;",
            "any information relating to the insurance policy on your life, including terms and conditions and claims history;",
            "details of your employment including position, period of employment, remuneration, hours worked and duties performed; and",
            "any other information relating to your income and solvency.",
          ],
        },
        {
          paragraphs: [
            "To process your claim Otta may need to collect your personal information from third parties such as your insurance broker, claims reference services, government organisations (for example social security agencies or taxation offices), any forensic accountant retained by Otta, your employers (past and present), your accountant and any businesses which provide information about the commercial activities of persons or, if you are, or have been, bankrupt the trustee of your estate (the \"Parties\"). You agree that the Parties may disclose your personal information, including health and sensitive information, to third parties, including contractors and contracted service providers engaged by us to deliver our services (such as assessors), other insurers, our reinsurers, and government agencies (where we are compelled to by law). These third parties may be located outside New Zealand. Otta may also disclose your personal information to witnesses in respect of your claim.",
            "You agree to us using and disclosing your personal information pursuant to this Claims Privacy Consent. In the event of any conflict between the documents, this Claims Privacy Consent shall be determinative. This consent remains valid unless you alter or revoke it by giving written notice to our privacy officer.",
            "If you do not consent to the terms of this Claims Privacy Consent or revoke your consent, Otta may not be able to process or assess your claim.",
          ],
        },
        {
          heading: "Declaration",
          paragraphs: [
            "I declare that to the best of my knowledge the particulars are true and correct, and that I have not withheld any information that is relevant to this claim. I will notify Otta immediately if any of the lost or stolen property mentioned in this claim is subsequently recovered and surrender the property or refund the amount of money received in compensation to Otta.",
            "I accept that wilful or reckless exaggeration or inflation of the amounts claimed will result in automatic forfeiture of the claim and the policy shall be void.",
            "I request and authorise any hospital, doctor, or other person who has attended or examined me to furnish to Otta or its representative all information concerning any illness or injury suffered, medical history, consultants, prescriptions, or treatments including X-ray plates and copies of all hospital or medical records, so that they may be included as a part of the proofs of the claim submitted. A photocopy of this authorisation will be considered as effective and valid as the original.",
            "I authorise the disclosure to Insurance Wholesale Limited of personal information held by any other person or organisation regarding or affecting this claim and authorise Insurance Brokers (International) Limited and First Assistance Limited to release to any other relevant person or organisation information regarding or affecting this claim.",
          ],
        },
      ],
      signOff: [
        { kind: "signature", name: "signature", label: "Claimant's signature", hint: "Type your name, then sign with your finger, mouse or by typing.", span: 3 },
        { kind: "date", name: "signedDate", label: "Date", span: 3 },
        { kind: "text", name: "witnessName", label: "Witness name", optional: true, span: 3 },
        { kind: "text", name: "witnessAddress", label: "Witness address", optional: true, span: 3 },
        { kind: "text", name: "relatedPersonName", label: "Person the expenses relate to, if other than the claimant", optional: true, span: 3 },
        { kind: "text", name: "relatedPersonSignature", label: "Their signature", hint: "They type their name to sign.", optional: true, span: 3 },
      ],
    },
  ],
};
