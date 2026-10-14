"use server";

import { after } from "next/server";
import { ratingRegions } from "@/content/rating-regions";
import { readAdminSession } from "@/lib/admin/session";
import { getApplication } from "@/lib/applications/store";
import { generateBrief, markBriefPending, setRatingRegion } from "@/lib/uw/brief";

/** Asks the assistant to write the brief again (it runs in the background). */
export async function rewriteBrief(applicationId: string) {
  if (!(await readAdminSession())) return { error: "Please sign in again." };
  const app = await getApplication(applicationId);
  if (!app) return { error: "Application not found." };
  // In the background: the page shows "writing" and refreshes until it's ready.
  await markBriefPending(app.id);
  after(() => generateBrief(app, { force: true }).catch((error) => console.error("[uw-brief] rewrite failed", error)));
  return { ok: true };
}

export async function chooseRatingRegion(applicationId: string, region: string) {
  if (!(await readAdminSession())) return { error: "Please sign in again." };
  if (!(ratingRegions as readonly string[]).includes(region)) return { error: "Choose a region from the list." };
  await setRatingRegion(applicationId, region);
  return { ok: true };
}
