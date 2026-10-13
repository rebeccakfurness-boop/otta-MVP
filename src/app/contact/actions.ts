"use server";

import { sendEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { contactSchema } from "@/lib/schemas";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
  values?: Record<string, string>;
};

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = Object.fromEntries(
    [...formData.entries()].filter(([k]) => !k.startsWith("$")).map(([k, v]) => [k, String(v)]),
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

  const d = parsed.data;
  try {
    await sendEmail({
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
      ].join("\n"),
    });
  } catch (err) {
    console.error("Contact form email failed", err);
    return {
      status: "error",
      message: "Sorry, we couldn't send your message. Please call or email us directly.",
      values: raw,
    };
  }

  return { status: "success", message: "Thanks, we've received your enquiry and will be in touch shortly." };
}
