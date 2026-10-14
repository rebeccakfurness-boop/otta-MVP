"use client";

import { useActionState } from "react";
import { CopyButton } from "@/components/applications/CopyButton";
import { Icon } from "@/components/portal/Icon";
import { Card } from "@/components/portal/ui";
import { createClientLink, type LinkState } from "./actions";

const inputClass =
  "mt-2 block w-full border bg-white px-3.5 py-2.5 text-[15px] text-charcoal outline-none transition focus:border-site-teal focus:ring-2 focus:ring-[#e6f4f2]";
const button =
  "inline-flex items-center justify-center gap-2 px-5 py-3 text-[12px] font-medium tracking-[0.12em] uppercase transition-colors disabled:opacity-70";

type FormOption = { id: string; title: string; summary: string };

export function SendLinkForm({ applicationsUrl, forms, selected }: { applicationsUrl: string; forms: FormOption[]; selected: string }) {
  const [state, action, pending] = useActionState<LinkState, FormData>(createClientLink, { status: "idle" });

  if (state.status === "created") {
    return (
      <Card className="max-w-3xl px-6 py-8 md:px-8">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-site-teal text-site-teal">
            <Icon name="check" className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[22px] tracking-[-0.01em]">Link ready for {state.clientName}</h2>
            <p className="text-[13px] font-medium text-[#2e7d74]">{state.formTitle}</p>
            <p className="mt-1 text-[14px] text-body">Copy the link and send it to your client yourself. Otta never contacts your clients.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input readOnly value={state.url} aria-label="Client link" onFocus={(e) => e.currentTarget.select()} className={`${inputClass} mt-0 min-w-0 flex-1 border-[#d9d9d9] text-[13px]`} />
          <CopyButton text={state.url} label="Copy link" className="justify-center px-5 py-3" />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={applicationsUrl} className={`${button} bg-site-teal text-white hover:bg-[#4fa99c]`}>
            Go to applications
          </a>
          <a href={applicationsUrl + "/send"} className={`${button} border border-[#d6d6d6] bg-white text-charcoal hover:border-site-teal hover:text-site-teal`}>
            Send another
          </a>
        </div>
      </Card>
    );
  }

  const errors = state.status === "invalid" ? state.errors : {};
  const values = state.status === "invalid" ? state.values : {};
  return (
    <Card className="max-w-3xl px-6 py-8 md:px-8">
      <form action={action} className="space-y-5" noValidate>
        <fieldset>
          <legend className="text-[14px] font-medium text-charcoal">Which form?</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {forms.map((f) => (
              <label key={f.id} className="cursor-pointer">
                <input type="radio" name="form" value={f.id} defaultChecked={(values.form || selected) === f.id} className="peer sr-only" />
                <span className="flex h-full flex-col border border-[#d9d9d9] px-4 py-3 transition-colors peer-checked:border-site-teal peer-checked:bg-[#f1f8f7] peer-focus-visible:ring-2 peer-focus-visible:ring-site-teal/40 hover:border-site-teal">
                  <span className="text-[14px] font-semibold text-charcoal">{f.title}</span>
                  <span className="mt-0.5 text-[12px] leading-snug text-body">{f.summary.split(". ")[0]}.</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="max-w-md">
          <div>
            <label htmlFor="clientName" className="text-[14px] font-medium text-charcoal">
              Client name
            </label>
            <input id="clientName" name="clientName" defaultValue={values.clientName} aria-invalid={!!errors.clientName} className={`${inputClass} ${errors.clientName ? "border-site-purple" : "border-[#d9d9d9]"}`} />
            {errors.clientName && <p className="mt-1.5 text-[13px] text-site-purple">{errors.clientName}</p>}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button type="submit" disabled={pending} className={`${button} bg-site-teal text-white hover:bg-[#4fa99c]`}>
            <Icon name="send" className="h-4 w-4" />
            {pending ? "Creating link" : "Create link"}
          </button>
          <span className="text-[13px] text-body">You send the link to your client yourself. Otta never contacts your clients.</span>
        </div>
      </form>
    </Card>
  );
}
