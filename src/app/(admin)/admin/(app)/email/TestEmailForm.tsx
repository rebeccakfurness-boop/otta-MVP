"use client";

import { useActionState } from "react";
import { sendTestEmail, type TestEmailState } from "./actions";

export function TestEmailForm({ defaultTo }: { defaultTo: string }) {
  const [state, action, pending] = useActionState<TestEmailState, FormData>(
    sendTestEmail,
    {},
  );
  const tone =
    state.result === "sent"
      ? "border-site-teal bg-[#f1f8f7] text-charcoal"
      : "border-site-purple bg-[#f8f1fa] text-site-purple";
  return (
    <form action={action} className="space-y-4">
      <label className="block text-[14px] text-body">
        Send a test email to
        <input
          name="to"
          type="email"
          defaultValue={defaultTo}
          className="mt-1 block w-full border border-[#d9d9d9] bg-white px-3 py-2.5 text-[15px] text-charcoal outline-none focus:border-site-teal sm:max-w-md"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="bg-site-teal px-5 py-3 text-[12px] font-medium tracking-[0.12em] text-white uppercase hover:bg-[#4fa99c] disabled:opacity-60"
      >
        {pending ? "Sending" : "Send test email"}
      </button>
      {state.result && (
        <p
          role="status"
          className={`border-l-4 px-4 py-3 text-[14px] break-words ${tone}`}
        >
          <strong className="block font-semibold">
            {state.result === "sent"
              ? "Sent"
              : state.result === "not-sent"
                ? "Not sent"
                : "Brevo refused it"}
          </strong>
          {state.detail}
        </p>
      )}
    </form>
  );
}
