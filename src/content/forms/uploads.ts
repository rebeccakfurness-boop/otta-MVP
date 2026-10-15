// Wording for the supporting documents box on every online form.
import type { FormDefinition } from "./types";

export const uploadsCopy = {
  title: "Supporting documents",
  optional: "(optional)",
  choose: "Add documents",
  drop: "or drag them here",
  limits: "PDF, Word, Excel or photos. Up to 10 documents, 4 MB in all. Photos are made smaller automatically.",
  tooBig: "That would take the documents over 4 MB. Remove one, or email larger files to the Otta team.",
  tooMany: "You can attach up to 10 documents.",
  wrongType: (name: string) => `${name} can't be attached. Use PDF, Word, Excel or photos.`,
  remove: "Remove",
};

/** What to attach, by kind of form. */
export function uploadHint(form: FormDefinition) {
  if (form.resource === "claim-forms") return "Receipts, invoices, photos of the damage, and medical or police reports.";
  if (form.resource === "renewal-declarations") return "Anything that has changed since last year, such as a new valuation or updated financials.";
  if (form.underwriting) return "Valuations, photos of the property, building or inspection reports, and anything else the underwriter should see.";
  return "Anything that helps the underwriter: schedules, financials, contracts or photos.";
}
