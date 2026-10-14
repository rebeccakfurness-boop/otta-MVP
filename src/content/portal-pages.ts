// Wording for the broker portal's book, claims, policy wordings and training pages.
import { site } from "./site";

export const portalBook = {
  tile: "Your active book",
  tileNote: (count: number) => `Annual premium across ${count} active ${count === 1 ? "policy" : "policies"}`,
  title: "Your book with Otta",
  intro: "Annual premium of your clients' active policies, by product.",
  empty: "Once you place a policy with Otta, your book shows here.",
};

export const portalClaims = {
  title: "Claims",
  intro: "Your clients' claims with Otta, where each one is up to, and how to lodge a new one.",
  stats: { open: "Open claims", paid: "Paid in the last 12 months", total: "Claims in the last 12 months" },
  listTitle: "Your clients' claims",
  empty: "No claims yet. When a client makes a claim, you can follow it here.",
  online: "Claims sent online",
  onlineEmpty: "Claim forms you complete online, or your clients complete from your link, appear here.",
  lodge: {
    title: "Lodge a claim",
    text: "Complete the claim form for the policy online, or download the PDF and email it to us. We'll confirm we've received it and who is handling it.",
    forms: "Claim forms",
  },
  emergency: {
    title: "In an emergency",
    text: `If your client needs urgent help, such as emergency medical assistance overseas or making a property safe, call us on ${site.phone} straight away. They can lodge the claim afterwards.`,
    email: site.claimsEmail,
  },
  detail: {
    back: "All claims",
    details: "Claim details",
    progress: "Progress",
    contact: "Questions about this claim?",
    contactText: "Email the claims team, quoting the claim number.",
  },
};

export const portalWordings = {
  title: "Policy wordings",
  intro: "The current policy wording for every Otta product, and fact sheets where we have them. Check the wording before you recommend cover, and share it with your clients. Each one opens in a new tab.",
  appliesTo: "Applies to",
  view: "View wording",
  viewSheet: "View fact sheet",
  factSheets: "Fact sheets for the other products are coming soon.",
};

export const portalTraining = {
  title: "Training",
  intro: "Everything you need to get the most out of the Otta Broker Portal. Work through the walkthrough below, or download the guide to keep.",
  download: "Download the guide (PDF)",
  stepsTitle: "Getting started in five steps",
  walkthroughTitle: "Walkthrough",
  steps: [
    { title: "Set your password", text: "Use the link in your welcome email. Next time, sign in with your password, your Microsoft or Google work account, or an emailed sign-in link." },
    { title: "Find your way around", text: "Your dashboard shows your active book, open quote requests, active policies and renewals due." },
    { title: "Complete or send a form", text: "Fill in a form online and submit it straight to Otta, or create a secure link and send it to your client yourself." },
    { title: "Track it", text: "Applications shows everything sent to us. Bind accepted quotes from Quote requests, and follow claims under Claims." },
    { title: "Ask us anything", text: "Help & contact puts you straight through to the underwriters who make the decisions." },
  ],
  help: "Still stuck? Call us on " + site.phone + " or email " + site.email + ".",
};

/** Walkthrough screens. Each step matches a numbered callout on its screenshot (public/images/portal-training). */
export const trainingWalkthrough: { image: string; title: string; steps: string[] }[] = [
  {
    image: "portal-dashboard",
    title: "Your dashboard",
    steps: [
      "The menu takes you to every part of the portal.",
      "Your active book: the annual premium of your clients' active policies.",
      "Open quote requests, active policies and renewals due. Select one to see the list.",
      "Shortcuts to proposal forms, renewal declarations, claim forms and general forms.",
    ],
  },
  {
    image: "portal-forms",
    title: "Finding the right form",
    steps: [
      "Choose proposal forms, renewal declarations, claim forms or general forms.",
      "Search, or filter by product.",
      "Forms are grouped by product.",
      "Select a form to complete it online.",
      "Or create a secure link to send to your client.",
    ],
  },
  {
    image: "portal-form",
    title: "Completing a form online",
    steps: ["Jump to any section.", "Each section is clearly headed.", "Fill in the answers.", "Download a PDF copy at any time.", "Submit. It goes straight to the right Otta team."],
  },
  {
    image: "portal-send-2",
    title: "Sending a form to your client",
    steps: ["Choose the form, then enter your client's name.", "Create link, then copy it and send it to your client yourself. Otta never contacts your clients."],
  },
  {
    image: "portal-applications",
    title: "Tracking applications",
    steps: ["Everything sent to Otta, by you or your clients.", "Links you've created for clients, and whether they're done.", "Create another client link, or fill in a form online."],
  },
  {
    image: "portal-bind",
    title: "Binding a quote",
    steps: ["Open the quote.", "Bind this quote, once your client accepts.", "Choose the inception date.", "Confirm your client has accepted the quote and terms.", "Instruct Otta to bind. We're told straight away."],
  },
  {
    image: "portal-claims",
    title: "Following your clients' claims",
    steps: ["Open claims and what has been paid.", "Each claim and where it is up to. Select one for its progress.", "Lodge a new claim with the right claim form."],
  },
  {
    image: "portal-wordings",
    title: "Policy wordings",
    steps: ["Every current Otta policy wording.", "The products each wording applies to.", "View or download the wording."],
  },
];
