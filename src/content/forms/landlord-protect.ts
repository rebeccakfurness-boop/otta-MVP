import { site } from "../site";
import type { FormDefinition } from "./types";

// The Landlord Protect Policy Application Form, as structured data (see building.ts).

const questions = ["lossHistory", "insuranceHistory", "otherInformation", "methContamination"];

export const landlordProtectApplication: FormDefinition = {
  id: "landlord-protect",
  slug: "landlord-protect-application",
  title: "Landlord Protect Application Form",
  pdfTitle: ["Landlord Protect Policy", "Application Form"],
  shortTitle: "Landlord Protect application",
  summary:
    "Apply for Landlord Protect cover for permanent residential tenancies. Fill it in online and send it straight to the Otta team, or download it as a PDF.",
  fileName: "Otta-Landlord-Protect-Application",
  sendTo: "the Otta property team",
  teamEmail: "real@ottainsurance.co.nz",
  productSlugs: ["landlord-insurance"],
  keyFields: { name: ["firstName", "surname"], detail: "postalAddress" },
  confirm: {
    broker: "I confirm the applicant has read the Important Notice above, and that the answers given are true and complete.",
    client: "I have read the Important Notice above, and the answers I have given are true and complete.",
  },
  parts: [
    {
      id: "application",
      band: "All fields on this form need to be completed",
      sections: [
        {
          id: "eligibility",
          title: "Eligibility",
          fields: [
            {
              kind: "yesno",
              name: "shortTermRental",
              label: "Is this a holiday home or short-term rental?",
              mustEqual: {
                value: "no",
                message: "Stop! We are unable to assist, as we only insure permanent tenancies.",
              },
            },
          ],
        },
        {
          id: "applicant",
          title: "Details of Applicant/s (Insured Party)",
          fields: [
            { kind: "text", name: "firstName", label: "First name", span: 2 },
            { kind: "text", name: "surname", label: "Surname", span: 2 },
            { kind: "tel", name: "mobile", label: "Mobile", span: 2 },
            {
              kind: "text",
              name: "companyOrTrust",
              label: "Company or trust name that the property is held in",
              hint: "Leave blank if the property is held in personal names.",
              optional: true,
            },
            {
              kind: "text",
              name: "postalAddress",
              label: "Postal address",
              placeholder: "Start typing an address",
              span: 4,
              address: { postcodeField: "postCode" },
            },
            { kind: "text", name: "postCode", label: "Post code", span: 2 },
            { kind: "email", name: "email", label: "Applicant's email", span: 3 },
            { kind: "text", name: "broker", label: "Insurance broker", hint: "Leave blank if you are applying without a broker.", optional: true, span: 3 },
            { kind: "date", name: "inceptionDate", label: "Policy inception date", span: 2 },
          ],
        },
        {
          id: "properties",
          title: "Rental Properties",
          fields: [
            {
              kind: "units",
              name: "properties",
              label: "Please cover the following rental property(s)",
              hint: "Note that insurance cover cannot be backdated.",
              addLabel: "Add a property",
              columns: [
                { key: "address", label: "Property address", kind: "text", placeholder: "e.g. 12 Rata Street, Mount Eden" },
                { key: "weeklyRent", label: "Weekly rent estimate ($)", kind: "money", placeholder: "$650" },
              ],
            },
          ],
        },
        {
          id: "cover",
          title: "Cover",
          fields: [
            {
              kind: "choice",
              name: "coverOption",
              label: "Select the cover you require",
              hint: "Tap ? on an option for what it covers, or see the comparison of the four policies at the end of this form.",
              options: ["Protect", "Protect +", "Protect Multi", "Protect Prime"],
              optionHelp: {
                Protect: "Our essential cover. Loss of rent up to $1,400 a week, landlord's contents up to $25,000 and intentional damage up to $25,000. No methamphetamine decontamination cover.",
                "Protect +": "More cover than Protect. Loss of rent up to $2,000 a week, contents up to $50,000, intentional damage up to $25,000, and methamphetamine decontamination up to $15,000.",
                "Protect Multi": "Loss of rent up to $500 per room, to a combined maximum of $2,000 a week. Contents up to $25,000 including common areas, and intentional damage up to $25,000. No methamphetamine decontamination cover.",
                "Protect Prime": "Our highest cover. Loss of rent up to $4,000 a week, contents up to $75,000, intentional damage up to $25,000, and methamphetamine decontamination up to $30,000.",
              },
              optionHelpLink: { label: "Compare all four policies", href: "#compare" },
            },
            {
              kind: "choice",
              name: "paymentOption",
              label: "How would you like to pay?",
              hint: "Otta will confirm the premium. For monthly direct debit, contact us direct to arrange payment.",
              options: ["Yearly, by direct credit", "Yearly, by Visa or MasterCard", "Monthly direct debit"],
            },
          ],
        },
      ],
      text: [
        {
          heading: "Important Notice",
          paragraphs: [
            "Material facts. 'You' (this includes every person or entity to be insured under this insurance) are under a duty to disclose all material facts that could influence the Insurer's decision to accept this insurance and, if so, on what terms. You need to disclose facts both known to you and those which you could have been reasonably expected to know about. If you are in any doubt as to whether or not a fact may be material, you should disclose it to ensure that any cover is not prejudiced.",
            "Non-disclosure or misstatement. If you fail to comply with your duty of disclosure, the Insurer may be entitled to void the contract altogether, and therefore decline to pay any claim.",
            "Jurisdiction. Except where the parties agree otherwise, the laws of New Zealand apply to this form and any dealings between the parties arising from this form. The New Zealand courts have exclusive jurisdiction in relation to any disputes that arise.",
          ],
        },
      ],
    },
    {
      id: "questions",
      band: "Questions",
      sections: [
        {
          id: "questions",
          title: "Questions",
          intro: "Have you or anyone to be covered under the proposed insurance:",
          fields: [
            {
              kind: "yesno",
              name: "lossHistory",
              label: "Experienced any loss, whether or not a claim was made, to home, contents or any property in the last five years?",
            },
            {
              kind: "yesno",
              name: "insuranceHistory",
              label: "Ever had any insurance declined, refused, cancelled, voided, renewal refused, terms imposed or a claim declined?",
            },
            { kind: "yesno", name: "otherInformation", label: "Is there any other information likely to affect this insurance?" },
            {
              kind: "yesno",
              name: "methContamination",
              label: "Are you aware of any meth contamination level being present in the property, at any time?",
            },
            {
              kind: "textarea",
              name: "questionDetails",
              label: "You have answered yes to one or more questions. Please provide details",
              showIf: { anyOf: questions, equals: "yes" },
            },
          ],
        },
      ],
      signOff: [
        { kind: "signature", name: "signature", label: "Landlord's signature", hint: "Type your name, then sign with your finger, mouse or by typing.", span: 3 },
        { kind: "date", name: "signedDate", label: "Date", span: 3 },
      ],
    },
    {
      id: "about",
      band: "Landlord Protect Policies",
      sections: [],
      text: [
        {
          id: "compare",
          heading: "Compare the policies",
          table: {
            head: ["", "Protect", "Protect +", "Protect Multi", "Protect Prime"],
            rows: [
              ["Loss of rents", "up to $1,400 pw", "up to $2,000 pw", "up to $500 per room, to a combined maximum of $2,000 pw", "up to $4,000 pw"],
              ["Contents", "up to $25,000", "up to $50,000", "up to $25,000 (including common areas)", "up to $75,000"],
              ["Intentional damage", "up to $25,000", "up to $25,000", "up to $25,000", "up to $25,000"],
              ["Methamphetamine decontamination", "Not covered", "up to $15,000", "Not covered", "up to $30,000"],
            ],
          },
          paragraphs: [`For full details of cover, please refer to the Policy Wording, or call us on ${site.phone}.`],
        },
        {
          heading: "What do you need to do to be eligible?",
          paragraphs: [
            "You must undertake the necessary and lawful steps to manage the property efficiently, thus minimising the risks involved in Residential Property Investment. The property owner is the Insured Party, however all correspondence, invoices etc. are directed through the Insurance Broker. They will also assist with claims on your behalf.",
          ],
        },
        {
          heading: "When should I start my policy?",
          paragraphs: [
            "As soon as your property is available for rent and it is being marketed. You may not have a tenant in the home, however you may still receive the policy benefits. If your rental property is already tenanted at the policy inception, then the arrears clause applies if:",
          ],
          numbered: [
            "Cover is not placed at the beginning of the tenancy, and",
            "At any time during the two calendar months prior to cover being requested, the tenant's rental payments were in arrears for 10 days or more, excluding statutory holidays. We will only provide cover under Section 2, Cover for Landlords Contents (but excluding intentional damage by tenants), and Section 4, Landlords Liability, until such time as the tenant has maintained rental payments for two consecutive months without falling into arrears of more than 10 days at a time.",
          ],
        },
        {
          heading: "Changing your mind",
          paragraphs: [
            "If you are not happy with your Protect policy, you can change your mind, provided you tell us within 30 days of the date your Protect Policy started. We will treat your Protect Policy as if it never existed and refund in full any premium you have paid. This does not apply to renewals or if a claim is made.",
          ],
        },
        {
          heading: "Current house insurance policy",
          paragraphs: [
            "The Protect policies are designed to complement a Building/Dwelling policy, they do not replace it. Consider purchasing a 'Combo' Package with an Otta Building/Dwelling Policy for comprehensive cover.",
          ],
        },
        {
          heading: "Vacant rental property",
          paragraphs: [
            "We do not cover your house when it is left unoccupied. This policy does not cover any loss, damage or liability if your house is left unoccupied for more than 90 consecutive days.",
            "Your Protect Policy may be continued, if you tell us that no one will be residing at the rental property and we agree that cover will continue. We may at this time change the terms of the policy and impose a higher excess.",
          ],
        },
        {
          heading: "When should I cancel my policy?",
          paragraphs: ["When your rental property has been sold, or your property is no longer available for residential tenancies."],
          bullets: [
            "If you cancel your policy after the 30 day period provided for you to change your mind, we will refund the unused portion of your premium less an administration fee. There is no refund of premium if there has been a claim during the period of cover.",
            "We recommend you do not cancel the policy at the end of a tenancy as claims can arise after tenants have vacated (refer to limitation of cover).",
            "If you notify us 3 months after your property was sold, you will need to provide written proof of the date of the sale.",
            "If the date of cancellation is less than 1 month prior to your policy renewal date, no refund will be issued.",
          ],
        },
      ],
    },
  ],
};
