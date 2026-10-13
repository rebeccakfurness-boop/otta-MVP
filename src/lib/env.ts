import "server-only";

// Server-side configuration. Every value is optional during the prototype;
// features that need a value fall back gracefully when it is missing.
export const env = {
  brevoApiKey: process.env.BREVO_API_KEY,
  enquiryToEmail: process.env.ENQUIRY_TO_EMAIL ?? "hello@otta.co.nz",
  enquiryFromEmail: process.env.ENQUIRY_FROM_EMAIL ?? "no-reply@otta.co.nz",
};
