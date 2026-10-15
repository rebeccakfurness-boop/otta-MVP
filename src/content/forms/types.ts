// The shape of an online form (Building Insurance Application, Corporate
// Travel Proposal, ...). Each form is plain data: the web form, validation,
// emailed summary and PDF are all built from its definition.

export type Condition =
  | { field: string; equals: string }
  /** Shown when the field holds a number below the given value. */
  | { field: string; below: number }
  /** Shown when any of the fields holds the value (e.g. "yes" to any question above). */
  | { anyOf: string[]; equals: string };

type Base = {
  name: string;
  label: string;
  hint?: string;
  /** Not every question applies to everyone; these may be left blank. */
  optional?: boolean;
  showIf?: Condition;
  /** Columns out of 6 on wide screens. Defaults to the full row. */
  span?: 2 | 3 | 4 | 6;
  placeholder?: string;
  /** Suggest NZ addresses as the person types (and fill in a post code field). */
  address?: { postcodeField?: string };
  /** The only acceptable answer, e.g. "no" to "Is this a holiday home?", with the message shown otherwise. */
  mustEqual?: { value: string; message: string };
};

export type Field =
  | (Base & { kind: "text" | "email" | "tel" | "date" | "money" | "number" | "year" | "textarea" })
  /** An electronic signature: the signer's printed name, plus a drawn or typed signature image. */
  | (Base & { kind: "signature" })
  | (Base & { kind: "yesno" })
  | (Base & {
      kind: "choice";
      options: string[];
      /** A short explanation shown from a "?" beside each option. */
      optionHelp?: Record<string, string>;
      /** A link under each explanation, e.g. to a comparison table (#id) or a document. */
      optionHelpLink?: { label: string; href: string };
    })
  /** A table the person adds rows to (e.g. units in a block). */
  | (Base & {
      kind: "units";
      columns: { key: string; label: string; kind: "text" | "money" | "number"; placeholder: string }[];
      /** Button text for adding a row, e.g. "Add a unit". */
      addLabel?: string;
    })
  /** A fixed table of numbers (rows by columns) with a totals row, e.g. travel days by region. */
  | (Base & { kind: "grid"; rows: { key: string; label: string }[]; columns: { key: string; label: string }[];
      /** Add a totals row: true for every column, or the keys of the columns to total. */
      total?: boolean | string[];
      /** Show totals as dollars. */
      money?: boolean;
    });

export type TextBlock = {
  /** Anchor for links to this block, e.g. "compare" for #compare. */
  id?: string;
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Numbered points, shown after the paragraphs. */
  numbered?: string[];
  /** A simple comparison table (first column is the row label). */
  table?: { head: string[]; rows: string[][] };
};

export type Section = {
  id: string;
  title: string;
  intro?: string;
  note?: string;
  /** Shaded panel, as the pre-1940 questions are on the paper form. */
  shaded?: boolean;
  showIf?: Condition;
  /** Shown in place of the section while it doesn't apply yet. Without it the section is hidden. */
  hiddenHint?: string;
  fields: Field[];
};

export type Part = {
  id: string;
  /** The coloured band at the top of each page of the paper form. */
  band: string;
  sections: Section[];
  /** Read-only wording shown after the questions. */
  text?: TextBlock[];
  /** Sign-off fields shown after the wording. */
  signOff?: Field[];
};

export type FormDefinition = {
  /** Stable id, stored with each application and used in client links (/apply/<id>/...). */
  id: string;
  /** Broker portal address: /forms/<slug>. */
  slug: string;
  title: string;
  /** The title as it is split over two lines at the top of the PDF. */
  pdfTitle: [string, string];
  shortTitle: string;
  summary: string;
  fileName: string;
  sendTo: string;
  /** The Otta team inbox completed forms are emailed to. */
  teamEmail: string;
  /** Products this form belongs to, and the Resources page it is listed on. */
  productSlugs: string[];
  resource?: "proposal-forms" | "renewal-declarations" | "claim-forms";
  /** The fields that name the application in lists and email subjects (several name fields are joined). */
  keyFields: { name: string | string[]; detail: string };
  /** Wording of the confirmation tick box above the submit button. */
  confirm?: { broker: string; client: string };
  /** Building only: attach the underwriting worksheet and flood map links. */
  underwriting?: boolean;
  parts: Part[];
};
