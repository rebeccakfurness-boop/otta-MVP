import "server-only";
import { getRecord, listRecords, putRecord } from "@/lib/db/records";
import type { ContactInput } from "@/lib/schemas";

// Website enquiries (Contact Us). Each one is saved here for the admin portal
// before it is emailed, so none are lost if an email fails.

export type Enquiry = Omit<ContactInput, "website"> & {
  id: string;
  createdAt: string;
  /** Whether the email to the Otta team went out. */
  emailed: "sent" | "not-sent" | "failed";
  handledAt?: string;
  handledBy?: string;
};

const COLLECTION = "enquiries";

export async function saveEnquiry(enquiry: Enquiry) {
  await putRecord(COLLECTION, enquiry.id, enquiry);
}

export async function listEnquiries() {
  const all = await listRecords<Enquiry>(COLLECTION);
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const getEnquiry = (id: string) => getRecord<Enquiry>(COLLECTION, id);
