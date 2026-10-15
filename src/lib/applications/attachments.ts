import "server-only";
import { getRecord, putRecord } from "@/lib/db/records";

// Supporting documents sent with an online form: valuations, photos,
// inspection reports, receipts. Kept with the application (Neon when
// connected), attached to the email to the Otta team, and downloadable from
// the admin portal and the broker's portal.
//
// Vercel limits a request to 4.5 MB, so a submission carries at most 4 MB of
// files; the form shrinks photos in the browser first. For larger files, move
// storage to Vercel Blob with direct uploads.

export const MAX_FILES = 10;
export const MAX_TOTAL_BYTES = 4 * 1024 * 1024;

const ALLOWED = /^(image\/(jpeg|png|webp|heic|heif|gif)|application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|spreadsheetml\.sheet)|application\/vnd\.ms-excel|text\/plain|text\/csv)$/;

export type AttachmentInfo = { id: string; name: string; type: string; size: number };
type StoredAttachment = AttachmentInfo & { applicationId: string; data: string };
export type IncomingFile = { name: string; type: string; size: number; bytes: Buffer };

const safeName = (name: string) => name.replace(/[^\w.\- ()]+/g, "_").slice(0, 120) || "document";

/** The files sent with a form, checked. Returns an error message to show instead when they don't fit. */
export async function readAttachments(formData: FormData): Promise<{ files: IncomingFile[] } | { error: string }> {
  const files = formData.getAll("attachments").filter((f): f is File => typeof f !== "string" && f.size > 0);
  if (files.length > MAX_FILES) return { error: `Attach up to ${MAX_FILES} documents.` };
  const total = files.reduce((n, f) => n + f.size, 0);
  if (total > MAX_TOTAL_BYTES) return { error: "The documents add up to more than 4 MB. Remove some, or email the larger ones to the Otta team." };
  const bad = files.find((f) => !ALLOWED.test(f.type));
  if (bad) return { error: `${bad.name} can't be attached. Use PDF, Word, Excel or photos.` };
  return {
    files: await Promise.all(files.map(async (f) => ({ name: safeName(f.name), type: f.type, size: f.size, bytes: Buffer.from(await f.arrayBuffer()) }))),
  };
}

export async function saveAttachments(applicationId: string, files: IncomingFile[]): Promise<AttachmentInfo[]> {
  return Promise.all(
    files.map(async (f, i) => {
      const info: AttachmentInfo = { id: `${applicationId}-f${i + 1}`, name: f.name, type: f.type, size: f.size };
      await putRecord<StoredAttachment>("attachments", info.id, { ...info, applicationId, data: f.bytes.toString("base64") });
      return info;
    }),
  );
}

/** One attachment's bytes, only if it belongs to that application. */
export async function getAttachment(applicationId: string, id: string) {
  const stored = await getRecord<StoredAttachment>("attachments", id);
  if (!stored || stored.applicationId !== applicationId) return null;
  return { ...stored, bytes: Buffer.from(stored.data, "base64") };
}

export function attachmentResponse(file: { name: string; type: string; bytes: Buffer }) {
  return new Response(new Uint8Array(file.bytes), {
    headers: {
      "content-type": file.type || "application/octet-stream",
      "content-disposition": `inline; filename="${file.name.replace(/"/g, "")}"`,
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

export const fileSize = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);
