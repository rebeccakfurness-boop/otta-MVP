"use client";

import { useActionState, useEffect, useState } from "react";
import { approveRequest, declineRequest, inviteBroker, resendInvite, type AccessActionState } from "./actions";

type Brokerage = { id: string; name: string };
type Action = (state: AccessActionState, data: FormData) => Promise<AccessActionState>;

const input =
  "block w-full border border-[#d9d9d9] bg-white px-3 py-2 text-[14px] text-charcoal outline-none focus:border-site-teal focus:ring-2 focus:ring-[#e6f4f2]";
const button = (kind: "primary" | "secondary") =>
  `inline-flex items-center justify-center px-4 py-2 text-[12px] font-medium tracking-[0.1em] uppercase transition-colors disabled:opacity-60 ${
    kind === "primary" ? "bg-site-teal text-white hover:bg-[#4fa99c]" : "border border-[#d6d6d6] bg-white text-charcoal hover:border-site-teal hover:text-site-teal"
  }`;

/** Runs an action and, once it worked, shows the result and reloads the list. */
function useAccessAction(action: Action) {
  const [state, dispatch, pending] = useActionState<AccessActionState, FormData>(action, {});
  useEffect(() => {
    if (!state.ok) return;
    const t = setTimeout(() => window.location.reload(), 2500);
    return () => clearTimeout(t);
  }, [state]);
  return { state, dispatch, pending };
}

function Result({ state }: { state: AccessActionState }) {
  if (state.error) return <p role="alert" className="mt-3 text-[13px] text-site-purple">{state.error}</p>;
  if (state.ok) return <p role="status" className="mt-3 text-[13px] text-[#2e7d74]">{state.message}</p>;
  return null;
}

function BrokerageChoice({ brokerages, defaultId, defaultNewName }: { brokerages: Brokerage[]; defaultId?: string; defaultNewName?: string }) {
  const [choice, setChoice] = useState(defaultId ?? "new");
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="text-[13px] text-body">
        Brokerage
        <select name="brokerage" value={choice} onChange={(e) => setChoice(e.target.value)} className={`${input} mt-1`}>
          <option value="new">New brokerage…</option>
          {brokerages.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </label>
      {choice === "new" && (
        <label className="text-[13px] text-body">
          New brokerage name
          <input name="newBrokerageName" defaultValue={defaultNewName} className={`${input} mt-1`} />
        </label>
      )}
    </div>
  );
}

export function RequestDecision({ id, brokerages, matchedId, brokerageName }: { id: string; brokerages: Brokerage[]; matchedId?: string; brokerageName: string }) {
  const approve = useAccessAction(approveRequest);
  const decline = useAccessAction(declineRequest);
  const done = approve.state.ok || decline.state.ok;
  return (
    <div>
      {!done && (
        <form action={approve.dispatch} className="space-y-3">
          <input type="hidden" name="id" value={id} />
          <BrokerageChoice brokerages={brokerages} defaultId={matchedId} defaultNewName={brokerageName} />
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={approve.pending || decline.pending} className={button("primary")}>
              {approve.pending ? "Approving…" : "Approve and send invite"}
            </button>
            <button
              type="submit"
              formAction={decline.dispatch}
              disabled={approve.pending || decline.pending}
              onClick={(e) => {
                if (!confirm("Decline this request? We'll email them to let them know.")) e.preventDefault();
              }}
              className={button("secondary")}
            >
              {decline.pending ? "Declining…" : "Decline"}
            </button>
          </div>
        </form>
      )}
      <Result state={approve.state.ok || approve.state.error ? approve.state : decline.state} />
    </div>
  );
}

export function ResendInvite({ id }: { id: string }) {
  const { state, dispatch, pending } = useAccessAction(resendInvite);
  return (
    <form action={dispatch}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={pending} className={button("secondary")}>
        {pending ? "Sending…" : "Resend welcome email"}
      </button>
      <Result state={state} />
    </form>
  );
}

export function InviteBrokerForm({ brokerages }: { brokerages: Brokerage[] }) {
  const { state, dispatch, pending } = useAccessAction(inviteBroker);
  return (
    <form action={dispatch} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-[13px] text-body">
          Name
          <input name="name" required className={`${input} mt-1`} />
        </label>
        <label className="text-[13px] text-body">
          Email
          <input name="email" type="email" required className={`${input} mt-1`} />
        </label>
      </div>
      <BrokerageChoice brokerages={brokerages} defaultId={brokerages[0]?.id} />
      <button type="submit" disabled={pending} className={button("primary")}>
        {pending ? "Sending…" : "Add broker and send invite"}
      </button>
      <Result state={state} />
    </form>
  );
}
