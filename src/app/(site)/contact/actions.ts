"use server";

import { sendEmail } from "@/lib/email";
import { adminUrl } from "@/lib/applications/urls";
import { saveEnquiry, type Enquiry } from "@/lib/enquiries";
import { env } from "@/lib/env";
import { contactSchema } from "@/lib/schemas";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
  values?: Record<string, string>;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = Object.fromEntries(
    [...formData.entries()]
      .filter(([k]) => !k.startsWith("$"))
      .map(([k, v]) => [k, String(v)]),
  );
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: raw,
    };
  }

  const d = { ...parsed.data };
  delete d.website; // the honeypot, always empty here
  // Saved first, so the enquiry shows in the admin portal even if the email fails.
  const enquiry: Enquiry = {
    ...d,
    id: `enq-${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
    emailed: "not-sent",
  };
  await saveEnquiry(enquiry).catch((err) =>
    console.error("[contact] could not save the enquiry", err),
  );

  try {
    const sent = await sendEmail({
      to: env.enquiryToEmail,
      replyTo: d.email,
      subject: `Website enquiry: ${d.enquiryType}${d.product ? `: ${d.product}` : ""}`,
      text: [
        `Name: ${d.name}`,
        `Email: ${d.email}`,
        `Phone: ${d.phone || "-"}`,
        `Company: ${d.company || "-"}`,
        `Enquiry type: ${d.enquiryType}`,
        `Product: ${d.product || "-"}`,
        "",
        d.message,
        "",
        `See all enquiries in the admin portal: ${await adminUrl("/enquiries")}`,
      ].join("\n"),
    });
    if (!sent)
      console.warn(
        "[contact] BREVO_API_KEY isn't set on this deployment: the enquiry was saved but not emailed.",
      );
    await saveEnquiry({
      ...enquiry,
      emailed: sent ? "sent" : "not-sent",
    }).catch(() => {});
  } catch (err) {
    // The enquiry is saved, so the visitor doesn't need to try again.
    console.error("[contact] enquiry email failed", err);
    await saveEnquiry({ ...enquiry, emailed: "failed" }).catch(() => {});
  }

  return {
    status: "success",
    message:
      "Thanks, we've received your enquiry and will be in touch shortly.",
  };
}
