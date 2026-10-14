import { z } from "zod";
import type { Condition, Field, FormDefinition, Section } from "@/content/forms";

// Shared by the browser (instant feedback) and the server (the real check).

export type Answers = Record<string, string>;
export type Errors = Record<string, string>;

export type SubmitState =
  | { status: "idle" }
  | { status: "invalid"; errors: Errors }
  | { status: "error"; message: string }
  | { status: "sent"; reference: string; emailed: boolean; id?: string };
export type UnitsField = Extract<Field, { kind: "units" }>;
export type GridField = Extract<Field, { kind: "grid" }>;

export const CONFIRM_FIELD = "declarationConfirmed";
export const MAX_UNIT_ROWS = 40;

export function answersFromFormData(data: FormData): Answers {
  const answers: Answers = {};
  for (const [key, value] of data.entries()) {
    if (typeof value === "string" && key.length < 64 && !key.startsWith("$")) answers[key] = value.trim().slice(0, 4000);
  }
  return answers;
}

export function isShown(condition: Condition | undefined, answers: Answers) {
  if (!condition) return true;
  if ("anyOf" in condition) return condition.anyOf.some((f) => answers[f] === condition.equals);
  const value = answers[condition.field] ?? "";
  if ("equals" in condition) return value === condition.equals;
  const n = Number(value);
  return value !== "" && Number.isFinite(n) && n < condition.below;
}

/** Every section with the fields that currently apply, in form order. */
export function visibleSections(form: FormDefinition, answers: Answers, showAll = false) {
  return form.parts.flatMap((part) =>
    part.sections
      .filter((s) => showAll || isShown(s.showIf, answers))
      .map((s): Section & { part: string } => ({
        ...s,
        part: part.id,
        fields: s.fields.filter((f) => showAll || isShown(f.showIf, answers)),
      })),
  );
}

export function signOffFields(form: FormDefinition) {
  return form.parts.flatMap((p) => p.signOff ?? []);
}

export function visibleFields(form: FormDefinition, answers: Answers) {
  return [...visibleSections(form, answers).flatMap((s) => s.fields), ...signOffFields(form)];
}

const clean = (v: string | undefined) => (v ?? "").replace(/[$,\s]/g, "");
const num = (v: string | undefined) => (clean(v) && Number.isFinite(Number(clean(v))) ? Number(clean(v)) : 0);

/** A grid's rows with their values, plus column totals. */
/** A grid total as it should be shown (dollars for money grids). */
export function gridTotal(field: GridField, value: number | null) {
  if (value === null) return "";
  return field.money ? value.toLocaleString("en-NZ", { style: "currency", currency: "NZD", maximumFractionDigits: 0 }) : String(value);
}

export function gridValues(field: GridField, answers: Answers) {
  const rows = field.rows.map((r) => ({
    ...r,
    values: Object.fromEntries(field.columns.map((c) => [c.key, answers[`${field.name}.${r.key}.${c.key}`] ?? ""])),
  }));
  const totalled = (key: string) => field.total === true || (Array.isArray(field.total) && field.total.includes(key));
  const totals: Record<string, number | null> = Object.fromEntries(
    field.columns.map((c) => [c.key, totalled(c.key) ? rows.reduce((sum, r) => sum + num(r.values[c.key]), 0) : null]),
  );
  const filled = rows.some((r) => Object.values(r.values).some(Boolean));
  return { rows, totals, filled };
}

export function unitRows(field: UnitsField, answers: Answers) {
  const rows: Record<string, string>[] = [];
  for (let i = 0; i < MAX_UNIT_ROWS; i++) {
    const row = Object.fromEntries(field.columns.map((c) => [c.key, answers[`${field.name}.${i}.${c.key}`] ?? ""]));
    if (Object.values(row).some(Boolean)) rows.push(row);
  }
  return rows;
}

const money = z
  .string()
  .transform((v) => v.replace(/[$,\s]/g, ""))
  .pipe(z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter an amount in dollars, for example 650,000"));

const checks: Partial<Record<Field["kind"], z.ZodType>> = {
  email: z.email("Enter a valid email address"),
  tel: z.string().regex(/^[0-9+() -]{6,20}$/, "Enter a valid phone number"),
  date: z.iso.date("Enter a valid date"),
  money,
  number: z.string().regex(/^\d+(\.\d+)?$/, "Enter a number"),
  year: z
    .string()
    .regex(/^\d{4}$/, "Enter a 4 digit year")
    .refine((v) => Number(v) >= 1800 && Number(v) <= new Date().getFullYear() + 2, "Enter a realistic year"),
  yesno: z.enum(["yes", "no"], "Choose yes or no"),
};

function requiredMessage(field: Field) {
  if (field.kind === "yesno") return "Choose yes or no";
  if (field.kind === "choice") return "Choose an option";
  return "This field is required";
}

export function validate(form: FormDefinition, answers: Answers): Errors {
  const errors: Errors = {};
  for (const field of visibleFields(form, answers)) {
    if (field.kind === "grid") {
      const grid = gridValues(field, answers);
      if (!grid.filled && !field.optional) errors[field.name] = "Fill in at least one row";
      for (const row of grid.rows) {
        for (const col of field.columns) {
          const key = `${field.name}.${row.key}.${col.key}`;
          if (row.values[col.key] && !/^\d+(\.\d+)?$/.test(clean(row.values[col.key]))) errors[key] = "Enter a number";
        }
      }
      continue;
    }
    if (field.kind === "units") {
      const rows = unitRows(field, answers);
      if (rows.length === 0) errors[field.name] = field.addLabel ? `${field.addLabel} (at least one)` : "Add at least one unit";
      rows.forEach((row, i) => {
        for (const col of field.columns) {
          const key = `${field.name}.${i}.${col.key}`;
          if (!row[col.key]) errors[key] = "Required";
          else if (col.kind !== "text" && !checks[col.kind]!.safeParse(row[col.key]).success) errors[key] = "Check this value";
        }
      });
      continue;
    }
    const value = answers[field.name] ?? "";
    if (!value) {
      if (!field.optional) errors[field.name] = requiredMessage(field);
      continue;
    }
    if (field.kind === "choice" && !field.options.includes(value)) errors[field.name] = "Choose an option";
    if (field.mustEqual && value !== field.mustEqual.value) errors[field.name] = field.mustEqual.message;
    const check = checks[field.kind];
    if (check) {
      const result = check.safeParse(value);
      if (!result.success) errors[field.name] = result.error.issues[0]?.message ?? "Check this value";
    }
  }
  if (answers[CONFIRM_FIELD] !== "on") errors[CONFIRM_FIELD] = "Please confirm the declaration";
  return errors;
}

/** A field's answer as it should read in the email and PDF. */
export function displayValue(field: Field, value: string | undefined) {
  if (!value) return "";
  switch (field.kind) {
    case "yesno":
      return value === "yes" ? "Yes" : value === "no" ? "No" : value;
    case "money": {
      const n = Number(value.replace(/[$,\s]/g, ""));
      return Number.isFinite(n) ? n.toLocaleString("en-NZ", { style: "currency", currency: "NZD", maximumFractionDigits: 2 }) : value;
    }
    case "date": {
      const d = new Date(`${value}T00:00:00`);
      return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric" });
    }
    default:
      return value;
  }
}

export function moneyText(value: string) {
  return displayValue({ kind: "money", name: "", label: "" }, value);
}

/** Plain-text version of the application, for the body of the email. */
export function summaryText(form: FormDefinition, answers: Answers) {
  const lines: string[] = [];
  for (const section of visibleSections(form, answers)) {
    lines.push("", section.title.toUpperCase());
    for (const field of section.fields) {
      if (field.kind === "grid") {
        const grid = gridValues(field, answers);
        lines.push(`  ${field.label}:`);
        for (const row of grid.rows.filter((r) => Object.values(r.values).some(Boolean))) {
          lines.push(`    ${row.label}: ${field.columns.map((c) => `${c.label} ${row.values[c.key] || "0"}`).join(", ")}`);
        }
        if (field.total) {
          const totalled = field.columns.filter((c) => grid.totals[c.key] !== null);
          lines.push(`    Total: ${totalled.map((c) => `${c.label} ${gridTotal(field, grid.totals[c.key])}`).join(", ")}`);
        }
      } else if (field.kind === "units") {
        unitRows(field, answers).forEach((row) => {
          lines.push(`  ${field.columns.map((c) => `${c.label}: ${c.kind === "money" ? moneyText(row[c.key]) : row[c.key]}`).join(", ")}`);
        });
      } else {
        lines.push(`  ${field.label}: ${displayValue(field, answers[field.name]) || "(not provided)"}`);
      }
    }
  }
  lines.push("", "DECLARATION");
  for (const field of signOffFields(form)) {
    lines.push(`  ${field.label}: ${displayValue(field, answers[field.name])}`);
  }
  lines.push(`  Declaration confirmed: ${answers[CONFIRM_FIELD] === "on" ? "Yes" : "No"}`);
  return lines.join("\n").trim();
}

/** The name that identifies an application (e.g. the insured), from the form's key fields. */
export function keyName(form: FormDefinition, answers: Answers) {
  const fields = Array.isArray(form.keyFields.name) ? form.keyFields.name : [form.keyFields.name];
  return fields.map((f) => answers[f] ?? "").filter(Boolean).join(" ");
}

/** Prefill the key name fields from a full name (first word, then the rest). */
export function keyNameDefaults(form: FormDefinition, fullName: string): Answers {
  const fields = Array.isArray(form.keyFields.name) ? form.keyFields.name : [form.keyFields.name];
  if (fields.length === 1) return { [fields[0]]: fullName };
  const [first, ...rest] = fullName.trim().split(/\s+/);
  return { [fields[0]]: first ?? "", [fields[1]]: rest.join(" ") };
}

/**
 * A form as it is shown to someone applying directly on the website: the same
 * questions, plus their contact details first (there is no broker to contact).
 */
export function withContact(form: FormDefinition): FormDefinition {
  const [first, ...rest] = form.parts;
  return {
    ...form,
    parts: [
      {
        ...first,
        sections: [
          {
            id: "contact",
            title: "Your Contact Details",
            intro: "We'll use these to get in touch about your application.",
            fields: [
              { kind: "text", name: "contactName", label: "Your name", span: 2 },
              { kind: "email", name: "contactEmail", label: "Email", span: 2 },
              { kind: "tel", name: "contactPhone", label: "Phone", span: 2 },
            ],
          },
          ...first.sections,
        ],
      },
      ...rest,
    ],
  };
}
