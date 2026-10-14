"use client";

import { useActionState } from "react";
import { Alert, Field, SubmitButton } from "./FormBits";

export type PasswordState = { ok?: boolean; error?: string };

/** New password plus confirmation, used by the welcome and account pages. */
export function PasswordForm({
  action,
  hidden,
  submitLabel,
  doneHref,
  doneMessage,
}: {
  action: (state: PasswordState, data: FormData) => Promise<PasswordState>;
  hidden?: Record<string, string>;
  submitLabel: string;
  /** Full page load here once saved (a server redirect would skip the subdomain proxy). */
  doneHref?: string;
  doneMessage?: string;
}) {
  const [state, dispatch, pending] = useActionState<PasswordState, FormData>(async (prev, data) => {
    const result = await action(prev, data);
    // Navigate straight away: signing in refreshes the page, which can unmount this form.
    if (result.ok && doneHref) window.location.assign(doneHref);
    return result;
  }, {});

  if (state.ok && doneMessage) return <Alert tone="success">{doneMessage}</Alert>;
  return (
    <form action={dispatch} className="space-y-5">
      {state.error && <Alert>{state.error}</Alert>}
      {Object.entries(hidden ?? {}).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <Field label="New password" name="password" type="password" autoComplete="new-password" required minLength={10} hint="At least 10 characters." />
      <Field label="Confirm new password" name="confirm" type="password" autoComplete="new-password" required minLength={10} />
      <SubmitButton pending={pending || (!!state.ok && !!doneHref)} pendingLabel="Saving…">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
