import "server-only";
import { complaintStatuses, feedbackCopy } from "@/content/admin-feedback";
import { getRecord, listRecords, putRecord } from "@/lib/db/records";

// The compliments and complaints register (admin portal). Entries are kept in
// the records store (Neon when connected). A few demo entries show alongside
// them; a saved change to a demo entry is stored under the same id and wins.

export type FeedbackType = "compliment" | "complaint";
export type ComplaintStatus = keyof typeof complaintStatuses;

export type Feedback = {
  id: string;
  /** REG-0001 style reference, shown to the team. */
  reference: string;
  type: FeedbackType;
  /** When Otta received it (yyyy-mm-dd). */
  receivedOn: string;
  fromName: string;
  fromType: string;
  organisation?: string;
  channel: string;
  productSlug?: string;
  /** Policy or claim number, if there is one. */
  policyRef?: string;
  /** Who or what it is about: a person, team or process. */
  about?: string;
  summary: string;
  // Complaints only.
  category?: string;
  status?: ComplaintStatus;
  acknowledgedOn?: string;
  resolvedOn?: string;
  outcome?: string;
  rootCause?: string;
  history: { date: string; event: string }[];
  loggedBy: string;
  createdAt: string;
  demo?: boolean;
};

const COLLECTION = "feedback";

const demo: Feedback[] = [
  {
    id: "fb-demo-1",
    reference: "REG-0001",
    type: "compliment",
    receivedOn: "2026-10-09",
    fromName: "Priya Shah",
    fromType: "Broker",
    organisation: "Harbour Insurance Brokers",
    channel: "Email",
    productSlug: "rental-property-insurance",
    about: "Underwriting team",
    summary: "Thanked the team for turning a 14 property rental schedule around in a day, with clear terms she could take straight to her client.",
    history: [{ date: "2026-10-09T21:10:00.000Z", event: "Logged by Otta Admin" }],
    loggedBy: "Otta Admin",
    createdAt: "2026-10-09T21:10:00.000Z",
    demo: true,
  },
  {
    id: "fb-demo-2",
    reference: "REG-0002",
    type: "compliment",
    receivedOn: "2026-09-22",
    fromName: "Mere Tipene",
    fromType: "Property manager",
    organisation: "Kowhai Property Management",
    channel: "Phone",
    productSlug: "landlord-insurance",
    about: "Claims team",
    summary: "Said the tenant damage claim was the smoothest she has had: regular updates and settled within three weeks.",
    history: [{ date: "2026-09-22T02:30:00.000Z", event: "Logged by Otta Admin" }],
    loggedBy: "Otta Admin",
    createdAt: "2026-09-22T02:30:00.000Z",
    demo: true,
  },
  {
    id: "fb-demo-3",
    reference: "REG-0003",
    type: "complaint",
    receivedOn: "2026-10-14",
    fromName: "Tom Ngata",
    fromType: "Broker",
    organisation: "Southern Alps Brokers",
    channel: "Email",
    productSlug: "liability-insurance",
    policyRef: "OTT-LI-25-0533",
    category: "Service or response time",
    status: "open",
    summary: "A mid-term change to the limit of indemnity took over a week to confirm, and his client was chasing him for the certificate.",
    history: [{ date: "2026-10-14T23:45:00.000Z", event: "Logged by Otta Admin" }],
    loggedBy: "Otta Admin",
    createdAt: "2026-10-14T23:45:00.000Z",
    demo: true,
  },
  {
    id: "fb-demo-4",
    reference: "REG-0004",
    type: "complaint",
    receivedOn: "2026-10-01",
    fromName: "Insured (via Harbour Insurance Brokers)",
    fromType: "Client or insured",
    organisation: "Harbour Insurance Brokers",
    channel: "Email",
    productSlug: "corporate-travel-insurance",
    policyRef: "OTT-TR-25-0519",
    category: "Claims handling",
    status: "acknowledged",
    acknowledgedOn: "2026-10-03",
    summary: "Unhappy that a baggage delay claim was declined for missing receipts; says the receipts were sent with the claim form.",
    history: [
      { date: "2026-10-01T20:00:00.000Z", event: "Logged by Otta Admin" },
      { date: "2026-10-03T01:15:00.000Z", event: "Acknowledged by Otta Admin" },
    ],
    loggedBy: "Otta Admin",
    createdAt: "2026-10-01T20:00:00.000Z",
    demo: true,
  },
  {
    id: "fb-demo-5",
    reference: "REG-0005",
    type: "complaint",
    receivedOn: "2026-08-12",
    fromName: "Mere Tipene",
    fromType: "Property manager",
    organisation: "Kowhai Property Management",
    channel: "Phone",
    productSlug: "landlord-insurance",
    category: "Policy wording",
    status: "resolved",
    acknowledgedOn: "2026-08-13",
    resolvedOn: "2026-08-28",
    outcome: "Explained the meth contamination cover and sent the relevant wording section. She was satisfied with the explanation.",
    rootCause: "The wording's meth contamination section is hard to follow. Added to the wording review list.",
    summary: "Felt the meth contamination limit was not clear when the policy was placed.",
    history: [
      { date: "2026-08-12T03:00:00.000Z", event: "Logged by Otta Admin" },
      { date: "2026-08-13T22:00:00.000Z", event: "Acknowledged by Otta Admin" },
      { date: "2026-08-28T04:30:00.000Z", event: "Resolved by Otta Admin" },
    ],
    loggedBy: "Otta Admin",
    createdAt: "2026-08-12T03:00:00.000Z",
    demo: true,
  },
];

export async function listFeedback(): Promise<Feedback[]> {
  const stored = await listRecords<Feedback>(COLLECTION);
  const ids = new Set(stored.map((f) => f.id));
  return [...stored, ...demo.filter((d) => !ids.has(d.id))].sort((a, b) => b.receivedOn.localeCompare(a.receivedOn) || b.createdAt.localeCompare(a.createdAt));
}

export async function getFeedback(id: string) {
  return (await getRecord<Feedback>(COLLECTION, id)) ?? demo.find((d) => d.id === id) ?? null;
}

export async function saveFeedback(entry: Feedback) {
  await putRecord(COLLECTION, entry.id, entry);
}

export async function nextReference() {
  const all = await listFeedback();
  const max = all.reduce((n, f) => Math.max(n, Number(f.reference.replace(/\D/g, "")) || 0), 0);
  return `REG-${String(max + 1).padStart(4, "0")}`;
}

const day = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`);
const ymd = (d: Date) => d.toISOString().slice(0, 10);

function addWorkingDays(from: string, n: number) {
  const d = day(from);
  while (n > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) n--;
  }
  return ymd(d);
}

/** Target dates for a complaint, and whether either has passed. */
export function complaintTargets(f: Feedback, today: string) {
  const acknowledgeBy = addWorkingDays(f.receivedOn, feedbackCopy.targets.acknowledgeWorkingDays);
  const resolve = day(f.receivedOn);
  resolve.setUTCDate(resolve.getUTCDate() + feedbackCopy.targets.resolveDays);
  const resolveBy = ymd(resolve);
  const live = f.status === "open" || f.status === "acknowledged";
  return {
    acknowledgeBy,
    resolveBy,
    acknowledgeOverdue: f.status === "open" && today > acknowledgeBy,
    resolveOverdue: live && today > resolveBy,
  };
}

/** Today's date in New Zealand (yyyy-mm-dd); the server runs in UTC. */
export const nzToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Pacific/Auckland" }).format(new Date());

export const isOpenComplaint = (f: Feedback) => f.type === "complaint" && (f.status === "open" || f.status === "acknowledged");
