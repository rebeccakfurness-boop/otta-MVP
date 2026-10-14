"use client";

import { useActionState } from "react";
import { Alert, authInput, Field, SubmitButton } from "@/components/auth/FormBits";
import { onboarding } from "@/content/onboarding";
import { requestAccess, type JoinState } from "./actions";

export function JoinForm({ loginHref, linkHref }: { loginHref: string; linkHref: string }) {
  const [state, action, pending] = useActionState<JoinState, FormData>(requestAccess, {});
  const copy = onboarding.join;

  if (state.done) {
    return (
      <div className="mt-8 space-y-6">
        <Alert tone="success">
          <strong className="block font-semibold">{copy.done.title}</strong>
          {state.done.matched ? copy.done.matched(state.done.matched) : copy.done.fresh}
        </Alert>
        <a href={loginHref} className="inline-block text-[14px] font-medium text-[#2e7d74] hover:underline">
          Back to sign in
        </a>
      </div>
    );
  }

  const v = state.values ?? {};
  const e = state.errors ?? {};
  return (
    <form action={action} noValidate className="mt-8 space-y-5">
      {state.error && <Alert>{state.error}</Alert>}
      {state.existing && (
        <Alert>
          {copy.existing}{" "}
          <a href={loginHref} className="font-medium underline">
            Sign in
          </a>{" "}
          or{" "}
          <a href={linkHref} className="font-medium underline">
            email me a sign-in link
          </a>
          .
        </Alert>
      )}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this empty
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <Field label="Full name" name="name" autoComplete="name" required defaultValue={v.name} error={e.name} />
      <Field label="Work email" name="email" type="email" autoComplete="email" required defaultValue={v.email} error={e.email}
        hint="Use your brokerage email address, so we can match you to your brokerage." />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone" name="phone" type="tel" autoComplete="tel" required defaultValue={v.phone} error={e.phone} />
        <div>
          <label htmlFor="role" className="text-[14px] font-medium text-charcoal">
            Your role
          </label>
          <select id="role" name="role" required defaultValue={v.role ?? ""} aria-invalid={!!e.role} className={`${authInput} ${e.role ? "border-site-purple" : ""}`}>
            <option value="" disabled>
              Choose one
            </option>
            {copy.roles.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          {e.role && <p className="mt-1.5 text-[13px] text-site-purple">{e.role}</p>}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Field label="Brokerage name" name="brokerageName" autoComplete="organization" required defaultValue={v.brokerageName} error={e.brokerageName} />
        <Field label="FSP number" name="fspNumber" defaultValue={v.fspNumber} error={e.fspNumber} />
      </div>
      <div>
        <label htmlFor="message" className="text-[14px] font-medium text-charcoal">
          Anything else we should know <span className="font-normal text-body">(optional)</span>
        </label>
        <textarea id="message" name="message" rows={3} defaultValue={v.message} className={authInput} />
      </div>
      <SubmitButton pending={pending} pendingLabel="Sending…">
        Request access
      </SubmitButton>
      <p className="text-[14px] text-body">
        Already have an account?{" "}
        <a href={loginHref} className="font-medium text-[#2e7d74] hover:underline">
          Sign in
        </a>
      </p>
    </form>
  );
}
