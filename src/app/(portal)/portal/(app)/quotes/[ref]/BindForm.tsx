"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { instructBind, type BindState } from "./actions";

export function BindForm({
  quoteRef,
  defaultDate,
}: {
  quoteRef: string;
  defaultDate: string;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<BindState, FormData>(
    instructBind,
    {},
  );
  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);
  return (
    <form action={action} className="space-y-4 px-6 py-6">
      <input type="hidden" name="ref" value={quoteRef} />
      <p className="text-[14px] text-body">
        Your client has accepted the quote? Tell us to bind it and we&apos;ll confirm
        cover.
      </p>
      <label className="block text-[14px] font-medium text-charcoal">
        Cover to start
        <input
          type="date"
          name="inceptionDate"
          defaultValue={defaultDate}
          required
          className="mt-1 block w-full border border-[#d9d9d9] bg-white px-3 py-2.5 text-[15px] text-charcoal outline-none focus:border-site-teal"
        />
      </label>
      <label className="block text-[14px] font-medium text-charcoal">
        Notes for the underwriter{" "}
        <span className="font-normal text-body">(optional)</span>
        <textarea
          name="notes"
          rows={3}
          placeholder="e.g. payment arrangements, changes to the insured's details"
          className="mt-1 block w-full border border-[#d9d9d9] bg-white px-3 py-2.5 text-[15px] text-charcoal outline-none focus:border-site-teal"
        />
      </label>
      <label className="flex items-start gap-2 text-[14px] text-charcoal">
        <input
          type="checkbox"
          name="confirm"
          className="mt-1 h-4 w-4 accent-[#61b9ad]"
        />
        The client has accepted the quote and its terms, and I instruct Otta to
        bind cover.
      </label>
      {state.error && (
        <p role="alert" className="text-[13px] text-site-purple">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-site-teal py-3.5 text-[12px] font-medium tracking-[0.14em] text-white uppercase hover:bg-[#4fa99c] disabled:opacity-60"
      >
        {pending ? "Sending" : "Instruct Otta to bind"}
      </button>
    </form>
  );
}
