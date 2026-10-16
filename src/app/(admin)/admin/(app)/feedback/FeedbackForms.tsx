"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import { complaintCategories, complaintStatuses, feedbackChannels, feedbackCopy as copy, feedbackFrom, feedbackTypes } from "@/content/admin-feedback";
import { logFeedback, updateComplaint, type FeedbackState } from "./actions";

const input = "w-full border border-[#d9d9d9] bg-white px-3 py-2 text-[14px] text-charcoal outline-none focus:border-site-teal";
const labelText = "mb-1.5 block text-[11px] font-semibold tracking-[0.1em] text-body uppercase";
const primary = "bg-site-teal px-5 py-2.5 text-[11px] font-medium tracking-[0.12em] text-white uppercase hover:bg-[#4fa99c] disabled:opacity-60";

function Status({ state }: { state: FeedbackState }) {
  if (state.error) return <span role="alert" className="text-[13px] text-site-purple">{state.error}</span>;
  if (state.ok) return <span role="status" className="text-[13px] text-[#2e7d74]">{state.message}</span>;
  return null;
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className={labelText}>{label}</span>
      {children}
    </label>
  );
}

export function LogFeedbackForm({ today, products }: { today: string; products: { slug: string; name: string }[] }) {
  const [state, action, pending] = useActionState(logFeedback, {});
  const [type, setType] = useState<"compliment" | "complaint">("compliment");
  return (
    <form action={action} className="grid gap-5 px-6 py-6 sm:grid-cols-2">
      <fieldset className="sm:col-span-2">
        <legend className={labelText}>Type</legend>
        <div className="inline-flex border border-[#d9d9d9]">
          {(Object.keys(feedbackTypes) as (keyof typeof feedbackTypes)[]).map((t) => (
            <label key={t} className={`cursor-pointer px-4 py-2 text-[12px] font-medium tracking-[0.08em] uppercase transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-site-teal ${type === t ? "bg-site-teal text-white" : "text-body hover:text-site-teal"}`}>
              <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="sr-only" />
              {feedbackTypes[t]}
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="Received on">
        <input type="date" name="receivedOn" defaultValue={today} max={today} required className={input} />
      </Field>
      <Field label="How it came in">
        <select name="channel" className={input} defaultValue="Email">
          {feedbackChannels.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>
      <Field label="From (name)">
        <input name="fromName" required maxLength={120} className={input} />
      </Field>
      <Field label="They are a">
        <select name="fromType" className={input} defaultValue="Broker">
          {feedbackFrom.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </Field>
      <Field label="Brokerage or company (optional)">
        <input name="organisation" maxLength={120} className={input} />
      </Field>
      <Field label="Product (optional)">
        <select name="productSlug" className={input} defaultValue="">
          <option value="">Not product specific</option>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Policy or claim number (optional)">
        <input name="policyRef" maxLength={60} className={input} />
      </Field>
      {type === "complaint" ? (
        <Field label="What it's about">
          <select name="category" required className={input} defaultValue="">
            <option value="" disabled>
              Choose one
            </option>
            {complaintCategories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
      ) : (
        <Field label="Who or what it's about (optional)">
          <input name="about" maxLength={120} placeholder="A person, team or process" className={input} />
        </Field>
      )}
      <Field label={type === "complaint" ? "The complaint" : "What they said"} wide>
        <textarea name="summary" required rows={4} maxLength={4000} className={input} />
      </Field>
      {type === "complaint" && <p className="text-[13px] leading-relaxed text-body sm:col-span-2">{copy.targets.note}</p>}
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={pending} className={primary}>
          {pending ? "Saving" : copy.log}
        </button>
        <Status state={state} />
      </div>
    </form>
  );
}

type ComplaintValues = { id: string; status: string; acknowledgedOn?: string; resolvedOn?: string; outcome?: string; rootCause?: string };

/** Submits without React's automatic form reset, so the saved values stay on screen. */
const keepValues = (action: (formData: FormData) => void) => (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  startTransition(() => action(formData));
};

export function UpdateComplaintForm({ complaint, today }: { complaint: ComplaintValues; today: string }) {
  const [state, action, pending] = useActionState(updateComplaint, {});
  return (
    <form onSubmit={keepValues(action)} className="grid gap-5 px-6 py-6 sm:grid-cols-2">
      <input type="hidden" name="id" value={complaint.id} />
      <Field label="Status" wide>
        <select name="status" defaultValue={complaint.status} className={`${input} sm:max-w-sm`}>
          {Object.entries(complaintStatuses).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Acknowledged on">
        <input type="date" name="acknowledgedOn" defaultValue={complaint.acknowledgedOn ?? ""} max={today} className={input} />
      </Field>
      <Field label="Resolved on">
        <input type="date" name="resolvedOn" defaultValue={complaint.resolvedOn ?? ""} max={today} className={input} />
      </Field>
      <Field label="Outcome" wide>
        <textarea name="outcome" rows={3} maxLength={4000} defaultValue={complaint.outcome ?? ""} placeholder="What Otta did, and whether the complainant accepted it" className={input} />
      </Field>
      <Field label="Root cause and improvement (optional)" wide>
        <textarea name="rootCause" rows={3} maxLength={2000} defaultValue={complaint.rootCause ?? ""} placeholder="Why it happened, and what changes so it doesn't again" className={input} />
      </Field>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={pending} className={primary}>
          {pending ? "Saving" : copy.update}
        </button>
        <Status state={state} />
      </div>
    </form>
  );
}
