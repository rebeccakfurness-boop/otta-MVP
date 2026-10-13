import "server-only";

// Server-side configuration. Every value is optional during the prototype;
// features that need a value fall back gracefully when it is missing.
export const env = {
  brevoApiKey: process.env.BREVO_API_KEY,
  enquiryToEmail: process.env.ENQUIRY_TO_EMAIL ?? "hello@ottainsurance.co.nz",
  // Where online building insurance applications from the broker portal go.
  applicationToEmail: process.env.APPLICATION_TO_EMAIL ?? "rebecca@tai.co.nz",
  enquiryFromEmail: process.env.ENQUIRY_FROM_EMAIL ?? "no-reply@ottainsurance.co.nz",
};
