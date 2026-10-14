import "server-only";
import { demoReady } from "@/lib/applications/store";
import { listRecords, putRecord } from "@/lib/db/records";

// What has just happened, for the admin portal's live activity feed and its
// "New enquiry!" celebration: website enquiries, quote requests (online
// proposal forms), renewals, claims and bind instructions.

export type ActivityKind = "enquiry" | "quote" | "renewal" | "claim" | "bind";

export type ActivityEvent = {
  id: string;
  kind: ActivityKind;
  /** e.g. "Kowhai Rentals Ltd" */
  title: string;
  /** e.g. "Building insurance application from Harbour Insurance Brokers" */
  detail: string;
  /** Admin portal path (without /admin), e.g. "/enquiries". */
  path: string;
  createdAt: string;
};

export const activityLabel: Record<ActivityKind, string> = {
  enquiry: "New enquiry",
  quote: "New quote request",
  renewal: "New renewal",
  claim: "New claim",
  bind: "New bind instruction",
};

export async function recordActivity(event: Omit<ActivityEvent, "id" | "createdAt"> & { createdAt?: string }) {
  const full: ActivityEvent = { ...event, id: `evt-${crypto.randomUUID().slice(0, 12)}`, createdAt: event.createdAt ?? new Date().toISOString() };
  await putRecord("activity", full.id, full).catch((error) => console.error("[activity] could not record", error));
  return full;
}

/** The latest events, newest first (optionally only those after `since`). */
export async function listActivity({ since, limit = 20 }: { since?: string; limit?: number } = {}) {
  await demoReady();
  const all = await listRecords<ActivityEvent>("activity");
  return all
    .filter((e) => !since || e.createdAt > since)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}
