// Copy and settings for the admin portal's compliments and complaints register.

export const feedbackCopy = {
  title: "Compliments and complaints",
  intro:
    "The register of feedback about Otta. Log every compliment and complaint here, from brokers, clients or anyone else, so the team can see what is working and fix what isn't.",
  log: "Log feedback",
  logIntro: "Record a compliment or complaint as soon as it comes in.",
  saved: "Saved to the register.",
  export: "Download register (CSV)",
  tabs: { all: "All", compliment: "Compliments", complaint: "Complaints" },
  stats: {
    compliments: "Compliments this year",
    open: "Open complaints",
    overdue: "Past a target date",
    resolved: "Complaints resolved this year",
  },
  empty: { title: "Nothing logged yet", body: "Compliments and complaints you log appear here." },
  update: "Update complaint",
  updateIntro: "Move the complaint along as it is handled. Each change is added to its history.",
  history: "History",
  back: "Compliments and complaints",
  // Otta's targets for handling a complaint. Confirm against the approved
  // complaints process (copy tracker item 1.2) before go-live.
  targets: {
    acknowledgeWorkingDays: 5,
    resolveDays: 60,
    note: "Otta targets: acknowledge within 5 working days, and resolve within 2 months or tell the complainant they can take it to the dispute resolution scheme.",
  },
};

export const feedbackTypes = { compliment: "Compliment", complaint: "Complaint" } as const;

export const feedbackFrom = ["Broker", "Client or insured", "Property manager", "Claimant", "Partner or insurer", "Other"] as const;

export const feedbackChannels = ["Email", "Phone", "Website", "In person", "Broker portal", "Other"] as const;

export const complaintCategories = [
  "Claims handling",
  "Underwriting decision",
  "Service or response time",
  "Communication",
  "Premium or pricing",
  "Policy wording",
  "Website or portal",
  "Other",
] as const;

export const complaintStatuses = {
  open: "Received",
  acknowledged: "Acknowledged",
  resolved: "Resolved",
  referred: "Referred to dispute scheme",
  closed: "Closed",
} as const;

/** How a status change reads in a complaint's history. */
export const feedbackStatusEvents: Record<keyof typeof complaintStatuses, string> = {
  open: "Reopened",
  acknowledged: "Acknowledged",
  resolved: "Resolved",
  referred: "Referred to the dispute resolution scheme",
  closed: "Closed",
};
