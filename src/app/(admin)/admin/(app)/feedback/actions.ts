"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { complaintCategories, complaintStatuses, feedbackChannels, feedbackCopy, feedbackFrom, feedbackStatusEvents } from "@/content/admin-feedback";
import { products } from "@/content/products";
import { readAdminSession } from "@/lib/admin/session";
import { getFeedback, nextReference, nzToday, saveFeedback, type ComplaintStatus, type Feedback } from "@/lib/feedback";

export type FeedbackState = { ok?: boolean; message?: string; error?: string; reference?: string };

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a date.");
const text = (max: number) => z.string().trim().max(max);
const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || undefined);

const entrySchema = z.object({
  type: z.enum(["compliment", "complaint"]),
  receivedOn: date,
  fromName: text(120).min(1, "Who it came from is required."),
  fromType: z.enum(feedbackFrom),
  organisation: optional(120),
  channel: z.enum(feedbackChannels),
  productSlug: z
    .string()
    .refine((s) => !s || products.some((p) => p.slug === s))
    .transform((v) => v || undefined),
  policyRef: optional(60),
  about: optional(120),
  category: z.string().optional(),
  summary: text(4000).min(1, "Describe the feedback."),
});

const field = (formData: FormData, name: string) => String(formData.get(name) ?? "");

/** Adds a compliment or complaint to the register. */
export async function logFeedback(_prev: FeedbackState, formData: FormData): Promise<FeedbackState> {
  const admin = await readAdminSession();
  if (!admin) return { error: "Please sign in again." };
  const parsed = entrySchema.safeParse(Object.fromEntries(["type", "receivedOn", "fromName", "fromType", "organisation", "channel", "productSlug", "policyRef", "about", "category", "summary"].map((k) => [k, field(formData, k)])));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the details and try again." };
  const v = parsed.data;
  if (v.type === "complaint" && !complaintCategories.includes(v.category as (typeof complaintCategories)[number])) return { error: "Choose what the complaint is about." };
  const now = new Date().toISOString();
  const reference = await nextReference();
  const entry: Feedback = {
    id: `fb-${crypto.randomUUID()}`,
    reference,
    ...v,
    category: v.type === "complaint" ? v.category : undefined,
    status: v.type === "complaint" ? "open" : undefined,
    history: [{ date: now, event: `Logged by ${admin.name}` }],
    loggedBy: admin.name,
    createdAt: now,
  };
  await saveFeedback(entry);
  refresh();
  return { ok: true, reference, message: `${reference} ${feedbackCopy.saved}` };
}

const updateSchema = z.object({
  status: z.enum(Object.keys(complaintStatuses) as [ComplaintStatus, ...ComplaintStatus[]]),
  acknowledgedOn: z.union([date, z.literal("")]),
  resolvedOn: z.union([date, z.literal("")]),
  outcome: text(4000),
  rootCause: text(2000),
});

/** Moves a complaint along: acknowledged, resolved, referred, closed. */
export async function updateComplaint(_prev: FeedbackState, formData: FormData): Promise<FeedbackState> {
  const admin = await readAdminSession();
  if (!admin) return { error: "Please sign in again." };
  const entry = await getFeedback(field(formData, "id"));
  if (!entry || entry.type !== "complaint") return { error: "Complaint not found." };
  const parsed = updateSchema.safeParse(Object.fromEntries(["status", "acknowledgedOn", "resolvedOn", "outcome", "rootCause"].map((k) => [k, field(formData, k)])));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the details and try again." };
  const v = parsed.data;
  const today = nzToday();
  const acknowledgedOn = v.acknowledgedOn || (v.status !== "open" ? (entry.acknowledgedOn ?? today) : undefined);
  const resolvedOn = v.resolvedOn || (v.status === "resolved" || v.status === "closed" ? (entry.resolvedOn ?? today) : undefined);
  if ((v.status === "resolved" || v.status === "closed") && !v.outcome) return { error: "Add the outcome before resolving the complaint." };

  const now = new Date().toISOString();
  const events: string[] = [];
  if (v.status !== entry.status) events.push(`${feedbackStatusEvents[v.status]} by ${admin.name}`);
  if (v.outcome !== (entry.outcome ?? "") || v.rootCause !== (entry.rootCause ?? "")) events.push(`Notes updated by ${admin.name}`);
  await saveFeedback({
    ...entry,
    status: v.status,
    acknowledgedOn,
    resolvedOn,
    outcome: v.outcome || undefined,
    rootCause: v.rootCause || undefined,
    history: [...entry.history, ...events.map((event) => ({ date: now, event }))],
  });
  refresh();
  return { ok: true, message: "Complaint updated." };
}
