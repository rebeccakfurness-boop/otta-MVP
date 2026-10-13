"use client";

import { startTransition, useActionState, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Icon } from "@/components/portal/Icon";
import { Card } from "@/components/portal/ui";
import { buildingApplication, type Field, type Section } from "@/content/building-application";
import {
  answersFromFormData,
  CONFIRM_FIELD,
  isShown,
  MAX_UNIT_ROWS,
  validate,
  type Answers,
  type Errors,
  type SubmitState,
  type UnitsField,
} from "@/lib/forms/building-application";

const inputClass =
  "block w-full border bg-white px-3.5 py-2.5 text-[15px] text-charcoal outline-none transition placeholder:text-[#a6a6a6] focus:border-site-teal focus:ring-2 focus:ring-[#e6f4f2]";
const border = (error?: string) => (error ? "border-site-purple" : "border-[#d9d9d9]");
const span = { 2: "md:col-span-2", 3: "md:col-span-3", 4: "md:col-span-4", 6: "md:col-span-6" } as const;
const fieldId = (name: string) => `f-${name}`;
const errorId = (name: string) => `f-${name}-error`;

type Props = {
  /** Who is filling it in: a signed-in broker, or a client from a broker's link. */
  audience: "broker" | "client";
  action: (state: SubmitState, data: FormData) => Promise<SubmitState>;
  defaults: Answers;
  pdfUrl: string;
  /** Broker only: where to go after sending. */
  links?: { back: { href: string; label: string }; applicationsBase?: string };
  /** Client only: the brokerage that sent the link. */
  brokerageName?: string;
};

export function ApplicationForm({ audience, action, defaults, pdfUrl, links, brokerageName }: Props) {
  const isClient = audience === "client";
  const formRef = useRef<HTMLFormElement>(null);
  const [answers, setAnswers] = useState<Answers>(defaults);
  const [showErrors, setShowErrors] = useState(false);
  const [state, dispatch, sending] = useActionState<SubmitState, FormData>(action, { status: "idle" });
  const [download, setDownload] = useState<{ busy: boolean; error?: string }>({ busy: false });
  const [submitted, setSubmitted] = useState<FormData | null>(null);

  const allErrors = useMemo(() => validate(answers), [answers]);
  const errors: Errors = showErrors ? allErrors : {};
  const errorCount = Object.keys(allErrors).length;

  function readForm() {
    return new FormData(formRef.current!);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = readForm();
    const found = validate(answersFromFormData(data));
    setShowErrors(true);
    const first = Object.keys(found)[0];
    if (first) {
      const el = document.getElementById(fieldId(first));
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }
    setSubmitted(data);
    startTransition(() => dispatch(data));
  }

  async function downloadPdf(data: FormData) {
    setDownload({ busy: true });
    try {
      const res = await fetch(pdfUrl, { method: "POST", body: data });
      if (!res.ok) throw new Error(res.status === 401 ? (isClient ? "This link has expired. Please ask your broker for a new one." : "Your session has ended. Please sign in again.") : "The PDF couldn't be created.");
      const blob = await res.blob();
      const name = /filename="([^"]+)"/.exec(res.headers.get("content-disposition") ?? "")?.[1] ?? "application.pdf";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      setDownload({ busy: false });
    } catch (e) {
      setDownload({ busy: false, error: e instanceof Error ? e.message : "The PDF couldn't be created." });
    }
  }

  if (state.status === "sent") {
    return (
      <Card className="mx-auto max-w-2xl px-8 py-12 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-site-teal text-site-teal">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <h2 className="mt-6 text-[26px] tracking-[-0.01em]">{isClient ? "Thank you, your application is in" : "Application sent"}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-body">
          Your reference is <strong className="font-semibold text-charcoal">{state.reference}</strong>.{" "}
          {isClient
            ? `It has gone to ${brokerageName ?? "your broker"} and the Otta team. Your broker will be in touch about the next steps.`
            : `The completed form has gone to ${buildingApplication.sendTo} as a PDF, and it is saved in your Applications.`}
        </p>
        {!state.emailed && (
          <p className="mt-4 border-l-4 border-site-purple bg-[#f8f1fa] px-4 py-3 text-left text-[13px] text-site-purple">
            Demo mode: email sending is not switched on yet, so nothing was actually emailed. Download the PDF to see what would be sent.
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => {
              if (!submitted) return;
              const copy = new FormData();
              submitted.forEach((v, k) => copy.append(k, v));
              copy.set("reference", state.reference);
              downloadPdf(copy);
            }} disabled={download.busy} className={buttonClass("secondary")}>
            <Icon name="download" className="h-4 w-4" />
            {download.busy ? "Preparing PDF" : "Download a copy (PDF)"}
          </button>
          {links?.applicationsBase && state.id && (
            <a href={`${links.applicationsBase}/${state.id}`} className={buttonClass("secondary")}>
              View application
            </a>
          )}
          {links && (
            <a href={links.back.href} className={buttonClass("primary")}>
              {links.back.label}
            </a>
          )}
        </div>
        {download.error && <p className="mt-4 text-[13px] text-site-purple">{download.error}</p>}
      </Card>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[220px_minmax(0,1fr)]">
      <Progress answers={answers} errors={allErrors} />

      <form
        ref={formRef}
        noValidate
        onSubmit={onSubmit}
        onChange={() => setAnswers(answersFromFormData(readForm()))}
        className="min-w-0"
        aria-describedby="form-status"
      >
        <div id="form-status" aria-live="polite">
          {showErrors && errorCount > 0 && (
            <p role="alert" className="mb-6 border-l-4 border-site-purple bg-[#f8f1fa] px-4 py-3 text-[14px] text-site-purple">
              {errorCount === 1 ? "1 answer needs" : `${errorCount} answers need`} checking before you can send the application.
            </p>
          )}
          {state.status === "error" && (
            <p role="alert" className="mb-6 border-l-4 border-site-purple bg-[#f8f1fa] px-4 py-3 text-[14px] text-site-purple">
              {state.message}
            </p>
          )}
        </div>

        <div className="space-y-12">
          {buildingApplication.parts.map((part, i) => (
            <section key={part.id} aria-labelledby={`part-${part.id}`} className="space-y-6">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t-4 border-site-teal bg-site-blue px-5 py-3.5 text-white">
                <span className="text-[11px] font-medium tracking-[0.14em] text-white/70 uppercase">
                  Part {i + 1} of {buildingApplication.parts.length}
                </span>
                <h2 id={`part-${part.id}`} className="text-[17px] font-semibold tracking-normal text-white">
                  {part.band}
                </h2>
              </div>

              {part.sections.map((section) => (
                <SectionCard key={section.id} section={section} answers={answers} errors={errors} defaults={defaults} />
              ))}

              {part.text && (
                <Card className="px-6 py-6 md:px-8">
                  <div className="space-y-6 text-[14px] leading-relaxed text-body">
                    {part.text.map((block) => (
                      <div key={block.heading}>
                        {block.heading && <h3 className="mb-2 text-[17px] font-semibold tracking-normal text-[#2e7d74]">{block.heading}</h3>}
                        {block.paragraphs?.map((p) => (
                          <p key={p} className="mt-2">
                            {p}
                          </p>
                        ))}
                        {block.bullets && (
                          <ul className="mt-2 list-disc space-y-1 pl-5">
                            {block.bullets.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {part.signOff && (
                <Card className="px-6 py-6 md:px-8">
                  <h3 className="text-[19px] font-semibold tracking-normal text-[#2e7d74]">Sign off</h3>
                  <div className="mt-5 grid grid-cols-6 gap-x-5 gap-y-5">
                    {part.signOff.map((field) => (
                      <FieldInput key={field.name} field={field} error={errors[field.name]} defaultValue={defaults[field.name]} />
                    ))}
                  </div>
                  <label className="mt-6 flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-charcoal">
                    <input
                      id={fieldId(CONFIRM_FIELD)}
                      type="checkbox"
                      name={CONFIRM_FIELD}
                      aria-invalid={!!errors[CONFIRM_FIELD]}
                      aria-describedby={errors[CONFIRM_FIELD] ? errorId(CONFIRM_FIELD) : undefined}
                      className="mt-1 h-4 w-4 shrink-0 accent-[#61b9ad]"
                    />
                    <span>
                      {isClient
                        ? "I have read the declaration, duty of disclosure and non-disclosure wording above, and agree to it."
                        : "I confirm the applicant has read the declaration, duty of disclosure and non-disclosure wording above, and agrees to it."}
                    </span>
                  </label>
                  <FieldError name={CONFIRM_FIELD} error={errors[CONFIRM_FIELD]} />
                </Card>
              )}
            </section>
          ))}
        </div>

        {/* Actions stay in reach while scrolling the long form. */}
        <div data-sticky-actions className="sticky bottom-0 z-10 mt-10 -mx-5 flex flex-col gap-3 border-t border-[#eaeaea] bg-white/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between md:mx-0 md:border md:px-6">
          <div className="text-[13px] text-body">
            {download.error ? (
              <span className="text-site-purple">{download.error}</span>
            ) : errorCount === 0 ? (
              "Ready to send."
            ) : (
              "Download the PDF at any time, filled in or blank."
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => downloadPdf(readForm())} disabled={download.busy} className={buttonClass("secondary")}>
              <Icon name="download" className="h-4 w-4" />
              {download.busy ? "Preparing PDF" : "Download PDF"}
            </button>
            <button type="submit" disabled={sending} className={buttonClass("primary")}>
              {sending ? "Sending" : "Submit application"}
              {!sending && <Icon name="arrow" className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function buttonClass(variant: "primary" | "secondary") {
  const base =
    "inline-flex items-center justify-center gap-2 px-5 py-3 text-[12px] font-medium tracking-[0.12em] uppercase transition-colors disabled:cursor-wait disabled:opacity-70";
  return variant === "primary"
    ? `${base} bg-site-teal text-white hover:bg-[#4fa99c]`
    : `${base} border border-[#d6d6d6] bg-white text-charcoal hover:border-site-teal hover:text-site-teal`;
}

function SectionCard({ section, answers, errors, defaults }: { section: Section; answers: Answers; errors: Errors; defaults: Answers }) {
  const hidden = !isShown(section.showIf, answers);
  return (
    <Card className={`scroll-mt-24 px-6 py-6 md:px-8 ${section.shaded ? "border-t-4 border-t-site-teal bg-[#f6f8f8]" : ""}`}>
      <div id={`s-${section.id}`} hidden={hidden} className="scroll-mt-24">
        <h3 className="text-[19px] font-semibold tracking-normal text-[#2e7d74]">{section.title}</h3>
        {section.intro && <p className="mt-2 text-[14px] font-medium text-charcoal">{section.intro}</p>}
        <div className="mt-5 grid grid-cols-6 gap-x-5 gap-y-5">
          {section.fields.map((field) => (
            <div key={field.name} hidden={!isShown(field.showIf, answers)} className={`col-span-6 ${span[field.span ?? 6]}`}>
              {field.kind === "units" ? (
                <UnitsTable field={field} errors={errors} />
              ) : (
                <FieldInput field={field} error={errors[field.name]} defaultValue={defaults[field.name]} />
              )}
            </div>
          ))}
        </div>
        {section.note && <p className="mt-5 bg-[#f1f8f7] px-4 py-3 text-[13px] leading-relaxed text-charcoal">Note: {section.note}</p>}
      </div>
      {hidden && (
        <p className="text-[14px] text-body">
          <span className="font-semibold text-charcoal">{section.title}.</span> This section appears once the year built is before 1940.
        </p>
      )}
    </Card>
  );
}

function Label({ field, htmlFor }: { field: Field; htmlFor?: string }) {
  const content = (
    <>
      {field.label}
      {field.optional && <span className="ml-1 font-normal text-body">(optional)</span>}
    </>
  );
  return htmlFor ? (
    <label htmlFor={htmlFor} className="block text-[14px] leading-snug font-medium text-charcoal">
      {content}
    </label>
  ) : (
    <span className="block text-[14px] leading-snug font-medium text-charcoal">{content}</span>
  );
}

function Hint({ text }: { text?: string }) {
  return text ? <span className="mt-1 block text-[13px] leading-snug text-body">{text}</span> : null;
}

function FieldError({ name, error }: { name: string; error?: string }) {
  return error ? (
    <p id={errorId(name)} className="mt-1.5 text-[13px] text-site-purple">
      {error}
    </p>
  ) : null;
}

function FieldInput({ field, error, defaultValue }: { field: Field; error?: string; defaultValue?: string }) {
  const id = fieldId(field.name);
  const described = [field.hint && `${id}-hint`, error && errorId(field.name)].filter(Boolean).join(" ") || undefined;
  const common = { id, name: field.name, "aria-invalid": !!error, "aria-describedby": described, defaultValue };

  if (field.kind === "yesno") {
    return (
      <fieldset aria-invalid={!!error} aria-describedby={described}>
        <legend className="sr-only">{field.label}</legend>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <span aria-hidden className="block max-w-2xl">
            <Label field={field} />
            <Hint text={field.hint} />
          </span>
          <div className="flex shrink-0">
            {(["yes", "no"] as const).map((v, i) => (
              <label key={v} className="cursor-pointer">
                <input id={i === 0 ? id : undefined} type="radio" name={field.name} value={v} className="peer sr-only" />
                <span
                  className={`flex h-10 w-16 items-center justify-center border text-[12px] font-medium tracking-[0.12em] uppercase transition-colors peer-checked:border-site-teal peer-checked:bg-site-teal peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-site-teal/40 ${i === 1 ? "-ml-px" : ""} ${error ? "border-site-purple text-site-purple" : "border-[#d9d9d9] text-body hover:border-site-teal hover:text-site-teal"}`}
                >
                  {v}
                </span>
              </label>
            ))}
          </div>
        </div>
        {field.hint && (
          <span id={`${id}-hint`} className="sr-only">
            {field.hint}
          </span>
        )}
        <FieldError name={field.name} error={error} />
      </fieldset>
    );
  }

  if (field.kind === "choice") {
    return (
      <fieldset aria-invalid={!!error} aria-describedby={described}>
        <legend>
          <Label field={field} />
        </legend>
        <span id={`${id}-hint`}>
          <Hint text={field.hint} />
        </span>
        <div className={`mt-3 grid gap-2 ${field.options.length > 2 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2"}`}>
          {field.options.map((option, i) => (
            <label key={option} className="cursor-pointer">
              <input id={i === 0 ? id : undefined} type="radio" name={field.name} value={option} className="peer sr-only" />
              <span
                className={`flex h-full items-center gap-3 border px-4 py-3 text-[14px] text-charcoal transition-colors peer-checked:border-site-teal peer-checked:bg-[#f1f8f7] peer-focus-visible:ring-2 peer-focus-visible:ring-site-teal/40 ${border(error)} hover:border-site-teal`}
              >
                <span aria-hidden className="h-4 w-4 shrink-0 rounded-full border border-[#bdbdbd] bg-white [input:checked+span>&]:border-[5px] [input:checked+span>&]:border-site-teal" />
                {option}
              </span>
            </label>
          ))}
        </div>
        <FieldError name={field.name} error={error} />
      </fieldset>
    );
  }

  let control: ReactNode;
  switch (field.kind) {
    case "textarea":
      control = <textarea {...common} rows={3} placeholder={field.placeholder} className={`${inputClass} ${border(error)} resize-y`} />;
      break;
    case "money":
      control = (
        <div className="relative">
          <span aria-hidden className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-[15px] text-body">
            $
          </span>
          <input {...common} inputMode="decimal" placeholder={field.placeholder} className={`${inputClass} ${border(error)} pl-7`} />
        </div>
      );
      break;
    case "number":
    case "year":
      control = (
        <input
          {...common}
          inputMode="numeric"
          maxLength={field.kind === "year" ? 4 : 10}
          placeholder={field.placeholder ?? (field.kind === "year" ? "e.g. 1998" : undefined)}
          className={`${inputClass} ${border(error)}`}
        />
      );
      break;
    default:
      control = (
        <input
          {...common}
          type={field.kind}
          autoComplete={field.kind === "email" ? "off" : undefined}
          placeholder={field.placeholder}
          className={`${inputClass} ${border(error)}`}
        />
      );
  }

  return (
    <div>
      <Label field={field} htmlFor={id} />
      <span id={`${id}-hint`}>
        <Hint text={field.hint} />
      </span>
      <div className="mt-2">{control}</div>
      <FieldError name={field.name} error={error} />
    </div>
  );
}

function UnitsTable({ field, errors }: { field: UnitsField; errors: Errors }) {
  const [rows, setRows] = useState([0]);
  const [nextId, setNextId] = useState(1);

  function addRow() {
    setRows((r) => [...r, nextId]);
    setNextId((n) => n + 1);
  }

  return (
    <div>
      <Label field={field} />
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-[14px]">
          <thead>
            <tr className="bg-site-blue text-left text-white">
              {field.columns.map((c) => (
                <th key={c.key} scope="col" className="px-3 py-2.5 text-[12px] font-medium tracking-[0.1em] uppercase">
                  {c.label}
                </th>
              ))}
              <th className="w-12">
                <span className="sr-only">Remove</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((rowId, i) => (
              <tr key={rowId} className="border-b border-[#eaeaea]">
                {field.columns.map((c) => {
                  const name = `${field.name}.${i}.${c.key}`;
                  return (
                    <td key={c.key} className="px-1.5 py-1.5">
                      <input
                        id={fieldId(name)}
                        name={name}
                        aria-label={`${c.label}, row ${i + 1}`}
                        aria-invalid={!!errors[name]}
                        inputMode={c.kind === "text" ? undefined : c.kind === "money" ? "decimal" : "numeric"}
                        placeholder={i === 0 ? c.placeholder : undefined}
                        className={`${inputClass} ${border(errors[name])} py-2`}
                      />
                    </td>
                  );
                })}
                <td className="text-center">
                  <button
                    type="button"
                    onClick={() => setRows((r) => r.filter((id) => id !== rowId))}
                    disabled={rows.length === 1}
                    className="p-2 text-body hover:text-site-purple disabled:opacity-30"
                    aria-label={`Remove row ${i + 1}`}
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        id={fieldId(field.name)}
        type="button"
        onClick={addRow}
        disabled={rows.length >= MAX_UNIT_ROWS}
        className="mt-3 inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.12em] text-[#2e7d74] uppercase hover:text-site-teal"
      >
        <Icon name="plus" className="h-4 w-4" /> Add a unit
      </button>
      <FieldError name={field.name} error={errors[field.name] ?? (Object.keys(errors).some((k) => k.startsWith(`${field.name}.`)) ? "Complete every column for each unit" : undefined)} />
    </div>
  );
}

/** Section list with a tick once each section is complete. */
function Progress({ answers, errors }: { answers: Answers; errors: Errors }) {
  return (
    <nav aria-label="Form sections" className="hidden xl:block">
      <ol className="sticky top-8 space-y-6 text-[13px]">
        {buildingApplication.parts.map((part, i) => (
          <li key={part.id}>
            <p className="text-[11px] font-medium tracking-[0.14em] text-body uppercase">Part {i + 1}</p>
            <ul className="mt-2 space-y-1.5 border-l border-[#e3e3e3]">
              {part.sections
                .filter((s) => isShown(s.showIf, answers))
                .map((s) => {
                  const done = s.fields.every(
                    (f) => !isShown(f.showIf, answers) || !Object.keys(errors).some((k) => k === f.name || k.startsWith(`${f.name}.`)),
                  );
                  return (
                    <li key={s.id}>
                      <a href={`#s-${s.id}`} className="-ml-px flex items-center gap-2 border-l-2 border-transparent py-0.5 pl-3 text-body hover:border-site-teal hover:text-charcoal">
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${done ? "bg-site-teal text-white" : "border border-[#cfcfcf]"}`}
                        >
                          {done && <Icon name="check" className="h-3 w-3" />}
                        </span>
                        <span className="leading-snug">{s.title.replace(/, please complete the following section$/, "")}</span>
                      </a>
                    </li>
                  );
                })}
              {part.signOff && (
                <li>
                  <span className="-ml-px flex items-center gap-2 border-l-2 border-transparent py-0.5 pl-3 text-body">
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                        part.signOff.every((f) => !errors[f.name]) && !errors[CONFIRM_FIELD] ? "bg-site-teal text-white" : "border border-[#cfcfcf]"
                      }`}
                    >
                      {part.signOff.every((f) => !errors[f.name]) && !errors[CONFIRM_FIELD] && <Icon name="check" className="h-3 w-3" />}
                    </span>
                    Declaration and sign off
                  </span>
                </li>
              )}
            </ul>
          </li>
        ))}
      </ol>
    </nav>
  );
}
