import { inviteFor, type FormDefinition } from "./types";

// The Building Insurance Application Form, as structured data. The broker
// portal form, its validation, the emailed summary and the PDF are all built
// from this one definition, so a question only needs changing here.

export const buildingApplication: FormDefinition = {
  id: "building",
  slug: "building-application",
  title: "Building Insurance Application Form",
  pdfTitle: ["Building Insurance", "Application Form"],
  shortTitle: "Building insurance application",
  summary:
    "Apply for building insurance for a rental or investment property. Fill it in online and send it straight to the Otta team, or download it as a PDF.",
  fileName: "Otta-Building-Insurance-Application",
  sendTo: "the Otta property team",
  teamEmail: "property@ottainsurance.co.nz",
  productSlugs: ["rental-property-insurance", "social-and-community-housing-insurance"],
  keyFields: { name: "insuredName", detail: "propertyAddress" },
  underwriting: true,
  invite: inviteFor("building insurance application"),
  parts: [
    {
      id: "application",
      band: "All fields on this form need to be completed",
      sections: [
        {
          id: "applicant",
          title: "Details of Applicant",
          fields: [
            { kind: "text", name: "insuredName", label: "Insured's name", span: 4 },
            { kind: "date", name: "dateOfBirth", label: "Date of birth", span: 2 },
            {
              kind: "text",
              name: "mailingAddress",
              label: "Mailing address",
              placeholder: "Start typing an address",
              span: 4,
              address: { postcodeField: "postCode" },
            },
            { kind: "text", name: "postCode", label: "Post code", span: 2 },
            { kind: "tel", name: "phone", label: "Phone", span: 2 },
            { kind: "email", name: "email", label: "Email", span: 4 },
          ],
        },
        {
          id: "agency",
          title: "Agency Details",
          fields: [
            { kind: "text", name: "broker", label: "Broker", hint: "Leave blank if you are applying without a broker.", optional: true, span: 3 },
            {
              kind: "text",
              name: "propertyManager",
              label: "Property management company",
              hint: "Leave blank if the property is self managed.",
              optional: true,
              span: 3,
            },
          ],
        },
        {
          id: "risk",
          title: "Risk Details",
          fields: [
            { kind: "date", name: "inceptionDate", label: "Policy inception date", span: 2 },
            { kind: "text", name: "propertyAddress", label: "Property address", placeholder: "Start typing the property address", address: {} },
            {
              kind: "choice",
              name: "propertyType",
              label: "What best describes the property?",
              options: ["Free standing house", "Block of units", "House plus units", "Apartment"],
            },
            { kind: "number", name: "levels", label: "Number of levels", span: 2 },
            { kind: "number", name: "selfContainedUnits", label: "Number of self-contained units within the property", span: 2 },
            { kind: "money", name: "sumInsured", label: "Total sum insured incl. GST", span: 2 },
            { kind: "number", name: "internalSqm", label: "Size (SQM) including internal garages and basements", span: 3 },
            { kind: "number", name: "externalSqm", label: "Size (SQM) of external garages and sheds", span: 3 },
            {
              kind: "yesno",
              name: "recreational",
              label: "Does the property have any recreational features?",
              hint: "For example a swimming pool, spa pool, tennis court, solar power or water heating system, boat ramp or jetty.",
            },
            {
              kind: "money",
              name: "recreationalValue",
              label: "Value of recreational features",
              span: 2,
              showIf: { field: "recreational", equals: "yes" },
            },
            { kind: "yesno", name: "retainingWalls", label: "Does the property have garden or retaining walls over $25,000?" },
            { kind: "year", name: "yearBuilt", label: "What year was the property built?", span: 2 },
          ],
        },
        {
          id: "pre1940",
          title: "If pre-1940, please complete the following section",
          shaded: true,
          showIf: { field: "yearBuilt", below: 1940 },
          hiddenHint: "This section appears once the year built is before 1940.",
          fields: [
            { kind: "yesno", name: "rewired", label: "Has the building been re-wired?", span: 3 },
            { kind: "yesno", name: "plumbing", label: "Has the plumbing been replaced?", span: 3 },
            { kind: "yesno", name: "pilings", label: "Have the pilings (if applicable) been inspected, and replaced if necessary?", span: 3 },
            { kind: "yesno", name: "scrim", label: "Does the building have any scrim present, or has this been replaced by plaster board?", span: 3 },
            { kind: "yesno", name: "heritage", label: "Is the building subject to any heritage listing?", span: 3 },
            { kind: "yesno", name: "reroofed", label: "Has the property been re-roofed?", span: 3 },
          ],
        },
        {
          id: "mortgage",
          title: "Mortgage",
          fields: [
            { kind: "yesno", name: "mortgage", label: "Is there a mortgage on this property?" },
            {
              kind: "text",
              name: "mortgagee",
              label: "Mortgagee name",
              placeholder: "e.g. ASB Bank Limited",
              span: 4,
              showIf: { field: "mortgage", equals: "yes" },
            },
          ],
        },
        {
          id: "other",
          title: "Other",
          fields: [
            {
              kind: "yesno",
              name: "convictions",
              label:
                "Subject to the Criminal Records (Clean Slate) Act 2004, do you have any criminal convictions, acquittals or prosecutions pending?",
            },
            { kind: "yesno", name: "bankrupt", label: "In the past 10 years have you been bankrupt or through the No Asset Procedure?" },
          ],
        },
        {
          id: "chattels",
          title: "Landlords Chattels",
          note: "Landlords chattels include furniture, appliances, curtains and other property supplied by the landlord as part of the rental agreement.",
          fields: [
            { kind: "money", name: "chattelsValue", label: "Total value of landlords chattels provided with the property", span: 3 },
          ],
        },
        {
          id: "obligations",
          title: "Landlords Obligations",
          intro: "Do you, or your property manager, carry out:",
          note: "These obligations are a requirement for certain parts of the insurance cover.",
          fields: [
            {
              kind: "yesno",
              name: "inspections",
              label: "External and internal inspection of the property at a minimum of 6 monthly intervals and at the change of every tenancy?",
            },
            { kind: "yesno", name: "inspectionRecords", label: "A written record of the outcome of each inspection?" },
          ],
        },
      ],
    },
    {
      id: "declaration",
      band: "Declaration Questions",
      sections: [
        {
          id: "history",
          title: "Insurance History",
          fields: [
            {
              kind: "yesno",
              name: "insuranceHistory",
              label:
                "Have you ever had an insurance policy declined or cancelled, renewal refused, special conditions imposed or a claim rejected?",
            },
            {
              kind: "textarea",
              name: "insuranceHistoryDetails",
              label: "Please provide full details",
              showIf: { field: "insuranceHistory", equals: "yes" },
            },
            { kind: "yesno", name: "structurallySound", label: "Can you confirm the house is structurally sound, well maintained, watertight and secure?" },
            {
              kind: "yesno",
              name: "naturalHazards",
              label: "Are there any identified natural hazards at the site?",
              hint: "For example flooding, slippage or coastal inundation.",
            },
          ],
        },
        {
          id: "claims",
          title: "Claims History",
          fields: [
            {
              kind: "yesno",
              name: "losses",
              label:
                "In the last 3 years have you suffered any losses, whether a claim was made or not, that would have been covered by a similar insurance policy?",
            },
            {
              kind: "textarea",
              name: "lossesDetails",
              label: "Please provide full details",
              showIf: { field: "losses", equals: "yes" },
            },
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
        {
          heading: "Duty of Disclosure",
          paragraphs: [
            "Before you enter into a contract of insurance with an Insurer, you have a duty to disclose to the Insurer every matter that you know, or could reasonably be expected to know, is material to the Insurer's decision whether to accept the risk of the insurance and, if so, on what terms.",
            "You have the same duty to disclose those matters to the Insurer before you renew, extend, vary or reinstate a contract of general insurance.",
            "You are required to advise us in writing of any changes to material facts that may affect the insurance as soon as possible. However, your duty does not require you to disclose facts:",
          ],
          bullets: [
            "That diminish the risk undertaken by the Insurer.",
            "That are common knowledge.",
            "That your Insurer knows or, in the ordinary course of their business, ought to know.",
            "As to which compliance with your duty is waived by the Insurer.",
          ],
        },
        {
          heading: "Who needs to tell us",
          paragraphs: ["You must answer our questions in this way for you and for anyone else you wish to be covered by the policy."],
        },
        {
          heading: "Non-Disclosure",
          paragraphs: [
            "If you fail to comply with your duty of disclosure, the Insurer may be entitled to reduce their liability under the contract in respect of a claim or may cancel the contract.",
            "If your non-disclosure is fraudulent, the Insurer may also have the option of avoiding the contract from its beginning.",
          ],
        },
      ],
      signOff: [
        {
          kind: "text",
          name: "signature",
          label: "Authorised signature",
          hint: "Type the applicant's name to sign.",
          span: 2,
        },
        { kind: "text", name: "signatoryName", label: "Full name of individual", span: 2 },
        { kind: "date", name: "signedDate", label: "Date", span: 2 },
      ],
    },
    {
      id: "supplementary",
      band: "Supplementary Questionnaire",
      sections: [
        {
          id: "multiUnit",
          title: "Multi Unit Dwelling",
          fields: [
            { kind: "yesno", name: "isMultiUnit", label: "Is this application for a multi unit dwelling?" },
            { kind: "number", name: "unitsTotal", label: "Total number of units to be insured", span: 3, showIf: { field: "isMultiUnit", equals: "yes" } },
            { kind: "money", name: "unitsSumInsured", label: "Total sum insured of all units including GST", span: 3, showIf: { field: "isMultiUnit", equals: "yes" } },
            {
              kind: "units",
              name: "units",
              label: "Units",
              showIf: { field: "isMultiUnit", equals: "yes" },
              columns: [
                { key: "unit", label: "Unit #", kind: "text", placeholder: "e.g. Unit 1" },
                { key: "sumInsured", label: "Sum insured", kind: "money", placeholder: "$300,000" },
                { key: "sqm", label: "SQM", kind: "number", placeholder: "70" },
              ],
            },
            { kind: "yesno", name: "smokeDetectors", label: "Does each unit have a smoke or heat detector installed?", showIf: { field: "isMultiUnit", equals: "yes" } },
            {
              kind: "yesno",
              name: "fireWalls",
              label: "For all attached units, are there fire walls, floors and ceilings separating attached units?",
              showIf: { field: "isMultiUnit", equals: "yes" },
            },
            {
              kind: "yesno",
              name: "stackedUnits",
              label: "For all attached units, are there units stacked above or below the unit to be insured?",
              showIf: { field: "isMultiUnit", equals: "yes" },
            },
          ],
        },
        {
          id: "socialHousing",
          title: "Social Housing / Community Group Housing",
          fields: [
            { kind: "yesno", name: "isSocialHousing", label: "Is the property used for social or community group housing?" },
            {
              kind: "yesno",
              name: "shortTenancy",
              label: "Is any unit available for tenancy periods of less than 28 days?",
              hint: "If so, please also complete the Short-Term Tenancy Questionnaire.",
              showIf: { field: "isSocialHousing", equals: "yes" },
            },
            {
              kind: "textarea",
              name: "housingNature",
              label: "Full description of the nature of the housing, i.e. transitional or emergency",
              showIf: { field: "isSocialHousing", equals: "yes" },
            },
            { kind: "text", name: "lengthOfStay", label: "Anticipated length of stay", span: 3, showIf: { field: "isSocialHousing", equals: "yes" } },
            { kind: "text", name: "housingProvider", label: "Who is the community housing provider?", span: 3, showIf: { field: "isSocialHousing", equals: "yes" } },
            { kind: "textarea", name: "pastoralCare", label: "Please advise detail of the pastoral care provided", showIf: { field: "isSocialHousing", equals: "yes" } },
          ],
        },
        {
          id: "mortgageeSale",
          title: "Mortgagee Sale",
          fields: [
            { kind: "yesno", name: "isMortgageeSale", label: "Is the property being bought at a mortgagee sale?" },
            {
              kind: "textarea",
              name: "contentious",
              label: "How contentious is it? i.e. forced sale, vendor accepting of it, etc.",
              showIf: { field: "isMortgageeSale", equals: "yes" },
            },
            {
              kind: "yesno",
              name: "purchaserInspected",
              label: "Has the purchaser had a chance to access the property and inspect both the inside and outside of the property?",
              showIf: { field: "isMortgageeSale", equals: "yes" },
            },
            {
              kind: "text",
              name: "accessObtained",
              label: "Please clarify the access obtained",
              placeholder: "e.g. viewed the property from the road",
              showIf: { field: "purchaserInspected", equals: "no" },
            },
            {
              kind: "yesno",
              name: "auctionDayInspection",
              label: "Is there a chance to inspect the property on the day of the auction?",
              showIf: { field: "isMortgageeSale", equals: "yes" },
            },
            {
              kind: "choice",
              name: "auctionAgreement",
              label: "Auction agreement",
              hint: "There are 2 types in the market.",
              options: ["Risk transfers at the fall of the hammer", "Risk transfers the day after auction"],
              showIf: { field: "isMortgageeSale", equals: "yes" },
            },
            { kind: "text", name: "settlementPeriod", label: "How long is the settlement period?", span: 3, showIf: { field: "isMortgageeSale", equals: "yes" } },
            {
              kind: "choice",
              name: "possession",
              label: "Is it vacant possession or does the purchaser need to evict the occupier?",
              options: ["Vacant possession", "Purchaser needs to evict the occupier"],
              showIf: { field: "isMortgageeSale", equals: "yes" },
            },
            {
              kind: "choice",
              name: "transactionType",
              label: "Is this a business transaction or retail?",
              hint: "It must be a business transaction, otherwise we cannot offer cover.",
              options: ["Business transaction", "Retail"],
              showIf: { field: "isMortgageeSale", equals: "yes" },
            },
          ],
        },
      ],
    },
  ],
};
