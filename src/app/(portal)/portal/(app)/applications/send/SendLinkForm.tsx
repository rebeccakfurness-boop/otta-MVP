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

export function SendLinkForm({ applicationsUrl }: { applicationsUrl: string }) {
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
            <p className="mt-1 text-[14px] text-body">
              {state.emailed
                ? `We've emailed it to ${state.clientEmail}. You can also copy it below.`
                : state.emailError
                  ? "We couldn't email it just now, so copy the link below and send it yourself."
                  : state.emailRequested
                    ? "Email sending isn't switched on yet in this demo, so copy the link below and send it yourself."
                    : "Copy the link and send it to your client however suits you."}
            </p>
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
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="clientName" className="text-[14px] font-medium text-charcoal">
              Client name
            </label>
            <input id="clientName" name="clientName" defaultValue={values.clientName} aria-invalid={!!errors.clientName} className={`${inputClass} ${errors.clientName ? "border-site-purple" : "border-[#d9d9d9]"}`} />
            {errors.clientName && <p className="mt-1.5 text-[13px] text-site-purple">{errors.clientName}</p>}
          </div>
          <div>
            <label htmlFor="clientEmail" className="text-[14px] font-medium text-charcoal">
              Client email <span className="font-normal text-body">(optional)</span>
            </label>
            <input id="clientEmail" name="clientEmail" type="email" defaultValue={values.clientEmail} aria-invalid={!!errors.clientEmail} className={`${inputClass} ${errors.clientEmail ? "border-site-purple" : "border-[#d9d9d9]"}`} />
            {errors.clientEmail && <p className="mt-1.5 text-[13px] text-site-purple">{errors.clientEmail}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="note" className="text-[14px] font-medium text-charcoal">
            Personal note <span className="font-normal text-body">(optional, added to the email)</span>
          </label>
          <textarea id="note" name="note" rows={3} defaultValue={values.note} className={`${inputClass} border-[#d9d9d9]`} />
        </div>
        <label className="flex cursor-pointer items-center gap-3 text-[14px] text-charcoal">
          <input type="checkbox" name="sendEmail" defaultChecked={values.sendEmail !== ""} className="h-4 w-4 accent-[#61b9ad]" />
          Email the link to my client from Otta, if an email is given (replies come to you)
        </label>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button type="submit" disabled={pending} className={`${button} bg-site-teal text-white hover:bg-[#4fa99c]`}>
            <Icon name="send" className="h-4 w-4" />
            {pending ? "Creating link" : "Create link"}
          </button>
          <span className="text-[13px] text-body">Leave the email blank to just copy the link and send it yourself.</span>
        </div>
      </form>
    </Card>
  );
}
