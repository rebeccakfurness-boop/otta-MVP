"use client";

import { useActionState } from "react";
import { Alert, Field, SubmitButton } from "@/components/auth/FormBits";
import { onboarding } from "@/content/onboarding";
import { requestSignInLink, type LinkRequestState } from "./actions";

export function LinkForm({ loginHref }: { loginHref: string }) {
  const [state, action, pending] = useActionState<LinkRequestState, FormData>(requestSignInLink, {});
  if (state.sent) {
    return (
      <div className="mt-8 space-y-6">
        <Alert tone="success">{onboarding.link.done(state.sent)}</Alert>
        <a href={loginHref} className="inline-block text-[14px] font-medium text-[#2e7d74] hover:underline">
          Back to sign in
        </a>
      </div>
    );
  }
  return (
    <form action={action} className="mt-8 space-y-5">
      {state.error && <Alert>{state.error}</Alert>}
      <Field label="Email address" name="email" type="email" autoComplete="username" required />
      <SubmitButton pending={pending} pendingLabel="Sending…">
        Email me a sign-in link
      </SubmitButton>
      <a href={loginHref} className="inline-block text-[14px] text-body hover:text-site-teal">
        Back to sign in with a password
      </a>
    </form>
  );
}
