"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { enquiryTypes } from "@/lib/schemas";
import { products } from "@/content/products";
import { submitContact, type ContactState } from "./actions";

const initial: ContactState = { status: "idle" };

const inputClass =
  "mt-2 block w-full border border-[#e0e0e0] bg-white px-4 py-3 text-[15px] text-charcoal outline-none transition focus:border-site-teal aria-[invalid=true]:border-red-500";

export function ContactForm() {
  const params = useSearchParams();
  const productSlug = params.get("product");
  const preselected = products.find((p) => p.slug === productSlug)?.name ?? "";
  const [state, action, pending] = useActionState(submitContact, initial);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-sm bg-footer p-9">
        <h2 className="text-[20px] font-semibold tracking-normal text-site-teal">Message sent</h2>
        <p className="mt-3 text-[15px] text-body">{state.message}</p>
      </div>
    );
  }

  const v = state.values ?? {};
  const err = (name: string) => state.fieldErrors?.[name]?.[0];

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2" noValidate>
      {state.status === "error" && (
        <p role="alert" className="bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:col-span-2">
          {state.message}
        </p>
      )}
      <Field label="Name" name="name" error={err("name")} required>
        <input id="name" name="name" defaultValue={v.name} autoComplete="name" required aria-invalid={!!err("name")} className={inputClass} />
      </Field>
      <Field label="Email" name="email" error={err("email")} required>
        <input id="email" name="email" type="email" defaultValue={v.email} autoComplete="email" required aria-invalid={!!err("email")} className={inputClass} />
      </Field>
      <Field label="Phone" name="phone" error={err("phone")}>
        <input id="phone" name="phone" type="tel" defaultValue={v.phone} autoComplete="tel" className={inputClass} />
      </Field>
      <Field label="Company or brokerage" name="company" error={err("company")}>
        <input id="company" name="company" defaultValue={v.company} autoComplete="organization" className={inputClass} />
      </Field>
      <Field label="Enquiry type" name="enquiryType" error={err("enquiryType")} required>
        <select id="enquiryType" name="enquiryType" defaultValue={v.enquiryType ?? (preselected ? "Apply for cover" : enquiryTypes[0])} className={inputClass}>
          {enquiryTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>
      <Field label="Product" name="product" error={err("product")}>
        <select id="product" name="product" defaultValue={v.product ?? preselected} className={inputClass}>
          <option value="">Not sure / not applicable</option>
          {products.map((p) => (
            <option key={p.slug}>{p.name}</option>
          ))}
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Message" name="message" error={err("message")} required>
          <textarea id="message" name="message" rows={6} defaultValue={v.message} required aria-invalid={!!err("message")} className={inputClass} />
        </Field>
      </div>
      <div aria-hidden className="hidden">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-site-teal px-8 py-[15px] text-[12px] font-medium tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#4fa99c] disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  required,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-[14px] font-medium text-charcoal">
        {label}
        {required && <span className="text-site-teal"> *</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
