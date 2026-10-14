"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { access as copy } from "@/content/admin-access";
import { addOrganisation, addPerson, saveAccess, saveNetwork, saveProducts, type OrgActionState } from "./actions";

const select = "border border-[#d9d9d9] bg-white px-3 py-2 text-[13px] text-charcoal outline-none focus:border-site-teal";
const input = "w-full border border-[#d9d9d9] bg-white px-3 py-2 text-[14px] text-charcoal outline-none focus:border-site-teal";
const button =
  "border border-[#d6d6d6] bg-white px-3 py-2 text-[11px] font-medium tracking-[0.1em] whitespace-nowrap text-charcoal uppercase hover:border-site-teal hover:text-site-teal disabled:opacity-60";
const primary = "bg-site-teal px-4 py-2.5 text-[11px] font-medium tracking-[0.12em] text-white uppercase hover:bg-[#4fa99c] disabled:opacity-60";

/** Submits without React's automatic form reset, so a saved choice stays on screen. */
const keepValues = (action: (formData: FormData) => void) => (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  startTransition(() => action(formData));
};

function Status({ state }: { state: OrgActionState }) {
  if (state.error) return <span className="text-[12px] text-site-purple">{state.error}</span>;
  if (state.ok) return <span className="text-[12px] text-[#2e7d74]">{state.message ?? copy.saved}</span>;
  return null;
}

/** Their own clients only, or the whole brokerage. */
export function AccessSelect({ userId, sees }: { userId: string; sees: "own" | "brokerage" }) {
  const [state, action, pending] = useActionState(saveAccess, {});
  return (
    <form onSubmit={keepValues(action)} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <select name="sees" defaultValue={sees} aria-label="What they see" className={select}>
        <option value="own">{copy.levels.own}</option>
        <option value="brokerage">{copy.levels.brokerage}</option>
      </select>
      <button type="submit" disabled={pending} className={button}>
        {copy.save}
      </button>
      <Status state={state} />
    </form>
  );
}

export function NetworkSelect({ brokerageId, networkId, networks }: { brokerageId: string; networkId?: string; networks: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(saveNetwork, {});
  return (
    <form onSubmit={keepValues(action)} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="brokerageId" value={brokerageId} />
      <select name="networkId" defaultValue={networkId ?? ""} aria-label={copy.network} className={select}>
        <option value="">{copy.noNetwork}</option>
        {networks.map((n) => (
          <option key={n.id} value={n.id}>
            {n.name}
          </option>
        ))}
      </select>
      <button type="submit" disabled={pending} className={button}>
        {copy.save}
      </button>
      <Status state={state} />
    </form>
  );
}

function ProductChecks({ products, selected }: { products: { slug: string; name: string }[]; selected: string[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {products.map((p) => (
        <label key={p.slug} className="flex items-center gap-2 text-[14px] text-charcoal">
          <input type="checkbox" name="products" value={p.slug} defaultChecked={selected.includes(p.slug)} className="h-4 w-4 accent-[#61b9ad]" />
          {p.name}
        </label>
      ))}
    </div>
  );
}

export function ProductsForm({ orgId, selected, products }: { orgId: string; selected: string[]; products: { slug: string; name: string }[] }) {
  const [state, action, pending] = useActionState(saveProducts, {});
  return (
    <form onSubmit={keepValues(action)} className="space-y-3">
      <input type="hidden" name="orgId" value={orgId} />
      <ProductChecks products={products} selected={selected} />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={button}>
          {copy.save}
        </button>
        <Status state={state} />
      </div>
    </form>
  );
}

export function AddPersonForm({ orgId }: { orgId: string }) {
  const [state, action, pending] = useActionState(addPerson, {});
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="orgId" value={orgId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" placeholder={copy.orgs.name} aria-label={copy.orgs.name} className={input} />
        <input name="email" type="email" placeholder="Email" aria-label="Email" className={input} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className={primary}>
          {copy.orgs.addPerson}
        </button>
        <span className="text-[12px] text-body">{copy.orgs.addPersonHelp}</span>
        <Status state={state} />
      </div>
    </form>
  );
}

export function AddOrganisationForm({ products }: { products: { slug: string; name: string }[] }) {
  const [state, action, pending] = useActionState(addOrganisation, {});
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" placeholder={copy.orgs.name} aria-label={copy.orgs.name} className={input} />
        <select name="kind" defaultValue="coverholder" aria-label={copy.orgs.kind} className={`${select} py-2.5 text-[14px]`}>
          <option value="network">{copy.orgs.kinds.network}</option>
          <option value="coverholder">{copy.orgs.kinds.coverholder}</option>
        </select>
      </div>
      <div>
        <p className="mb-2 text-[13px] text-body">{copy.orgs.productsHint}</p>
        <ProductChecks products={products} selected={[]} />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={primary}>
          {copy.orgs.createButton}
        </button>
        <Status state={state} />
      </div>
    </form>
  );
}
