"use server";

import { readAdminSession } from "@/lib/admin/session";
import { getEnquiry, saveEnquiry } from "@/lib/enquiries";

/** Marks an enquiry handled (or open again). */
export async function setHandled(id: string, handled: boolean) {
  const admin = await readAdminSession();
  if (!admin) return { error: "Please sign in again." };
  const enquiry = await getEnquiry(id);
  if (!enquiry) return { error: "Enquiry not found." };
  await saveEnquiry(
    handled
      ? {
          ...enquiry,
          handledAt: new Date().toISOString(),
          handledBy: admin.name,
        }
      : { ...enquiry, handledAt: undefined, handledBy: undefined },
  );
  return { ok: true };
}
