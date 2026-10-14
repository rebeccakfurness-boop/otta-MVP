import { inviteFor, type FormDefinition } from "./types";

// The Corporate Travel Proposal Form, as structured data (see building.ts).

const regions = [
  { key: "internal", label: "Internal" },
  { key: "australiaPacificUk", label: "Australia / Pacific / UK" },
  { key: "europe", label: "Europe" },
  { key: "restOfWorld", label: "Rest of World" },
  { key: "usaCanada", label: "USA & Canada" },
];

const dangerousWork = ["underground", "heights", "toxic", "machinery", "security"];
const riskQuestions = ["highRiskActivities", "nonScheduledFlights", "doNotTravel", "largeGroups", ...dangerousWork];

export const corporateTravelProposal: FormDefinition = {
  id: "corporate-travel",
  slug: "corporate-travel-proposal",
  title: "Corporate Travel Proposal Form",
  pdfTitle: ["Corporate Travel", "Proposal Form"],
  shortTitle: "Corporate travel proposal",
  summary:
    "Apply for corporate travel insurance for a business and its people. Fill it in online and send it straight to the Otta team, or download it as a PDF.",
  fileName: "Otta-Corporate-Travel-Proposal",
  sendTo: "the Otta travel team",
  teamEmail: "travel@ottainsurance.co.nz",
  productSlugs: ["corporate-travel-insurance"],
  keyFields: { name: "namedInsured", detail: "address" },
  invite: inviteFor("corporate travel proposal"),
  parts: [
    {
      id: "proposal",
      band: "Applicant and travel details",
      sections: [
        {
          id: "applicant",
          title: "Applicant Details",
          fields: [
            { kind: "text", name: "namedInsured", label: "Named insured", span: 4 },
            { kind: "date", name: "inceptionDate", label: "Inception date", span: 2 },
            { kind: "text", name: "address", label: "Address", placeholder: "Start typing an address", address: {} },
          ],
        },
        {
          id: "business",
          title: "Business Details",
          fields: [
            {
              kind: "textarea",
              name: "businessActivities",
              label: "Please provide a detailed description of your business activities",
              hint: "Include anything travelling with your people, such as equipment and its value.",
            },
          ],
        },
        {
          id: "travel",
          title: "Travel Information",
          fields: [
            {
              kind: "grid",
              name: "travelDays",
              label: "Please provide travel days by region",
              hint: "Enter the total number of days a year. Leave a region blank if no one travels there.",
              rows: regions,
              columns: [
                { key: "business", label: "Business & Associated Leisure Days" },
                { key: "leisure", label: "Pure Leisure Days" },
              ],
              total: true,
            },
          ],
        },
        {
          id: "additional",
          title: "Additional Information",
          fields: [
            {
              kind: "yesno",
              name: "highRiskActivities",
              label:
                "Will the Insured be involved in any high risk activity such as SCUBA diving, sky diving, motorcycle riding, motorsport, professional sport, mountaineering, snow sports etc?",
            },
            { kind: "yesno", name: "nonScheduledFlights", label: "Will the Insured travel on a non-scheduled flight (fixed wing or helicopter)?" },
            {
              kind: "grid",
              name: "aircraft",
              label: "Please provide the following information",
              showIf: { field: "nonScheduledFlights", equals: "yes" },
              rows: [
                { key: "helicopter", label: "Helicopter" },
                { key: "singleEngine", label: "Fixed wing, single engine" },
                { key: "twinEngine", label: "Fixed wing, twin engine" },
              ],
              columns: [
                { key: "flights", label: "Number of Flights" },
                { key: "avgPeople", label: "Avg no. of people per flight" },
                { key: "maxPeople", label: "Max no. of people per flight" },
              ],
              total: ["flights"],
            },
            {
              kind: "text",
              name: "flightRoutes",
              label: "Where are flights to and from?",
              showIf: { field: "nonScheduledFlights", equals: "yes" },
            },
            {
              kind: "yesno",
              name: "doNotTravel",
              label:
                "Will the Insured travel into or within a location listed under a \"Do not travel\" advisory on the New Zealand Ministry of Foreign Affairs and Trade (MFAT) website at www.safetravel.govt.nz?",
            },
            {
              kind: "yesno",
              name: "largeGroups",
              label:
                "Will there be any large groups of more than ten insured persons travelling together (for instance on a bus, plane or boat, attending the same conference or staying at the same accommodation)?",
            },
          ],
        },
        {
          id: "dangerousWork",
          title: "Dangerous Work Activities",
          intro: "Is the Insured involved in any dangerous work activities, including but not limited to work:",
          note: "You do not need to disclose light manual work carried out at ground level.",
          fields: [
            { kind: "yesno", name: "underground", label: "Underground or underwater, involving mining or scuba diving?" },
            {
              kind: "yesno",
              name: "heights",
              label:
                "At elevations above 10m, such as roofing or window cleaning, installation or maintenance outdoors, building and construction?",
            },
            { kind: "yesno", name: "toxic", label: "Involving the use of toxic substances or explosives?" },
            { kind: "yesno", name: "machinery", label: "Involving heavy machinery or work aboard a marine vessel or structure?" },
            {
              kind: "yesno",
              name: "security",
              label:
                "To provide security services, humanitarian aid or peacekeeping, as part of military or police forces, or in response to civil defence emergencies?",
            },
            {
              kind: "textarea",
              name: "riskDetails",
              label: "If you answered yes to any of the questions above, please provide further information",
              showIf: { anyOf: riskQuestions, equals: "yes" },
            },
          ],
        },
        {
          id: "claims",
          title: "Claims Details",
          fields: [
            {
              kind: "yesno",
              name: "claims",
              label:
                "Has the policyholder (or to the best of your knowledge any insured persons) had any claims in relation to travel insurance in the last three years?",
            },
            {
              kind: "textarea",
              name: "claimsDetails",
              label: "Please provide full details of each claim",
              showIf: { field: "claims", equals: "yes" },
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
            "I / We declare that all information provided in this declaration form is true and correct, and that no material facts have been misstated or omitted after enquiry with all applicants. The information provided will form the basis of any insurance contract and the contract may be avoided if any statement in this proposal is substantially incorrect or material to the contract.",
            "I / We agree that if any of the information provided in this declaration form changes between the date of this form and the inception date of the insurance policy then I / We will give notice thereof.",
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
