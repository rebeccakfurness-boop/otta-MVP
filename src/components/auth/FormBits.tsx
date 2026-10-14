import type { InputHTMLAttributes, ReactNode } from "react";

// Small form pieces for the portal's sign-in, request access and account pages.

export const authInput =
  "mt-2 block w-full border border-[#d9d9d9] bg-white px-4 py-3 text-[15px] text-charcoal outline-none transition focus:border-site-teal focus:ring-2 focus:ring-[#e6f4f2]";

export function Field({ label, error, hint, ...input }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string; name: string }) {
  return (
    <div>
      <label htmlFor={input.name} className="text-[14px] font-medium text-charcoal">
        {label}
        {!input.required && <span className="ml-1 font-normal text-body">(optional)</span>}
      </label>
      {hint && <span className="mt-0.5 block text-[13px] text-body">{hint}</span>}
      <input id={input.name} aria-invalid={!!error} {...input} className={`${authInput} ${error ? "border-site-purple" : ""}`} />
      {error && <p className="mt-1.5 text-[13px] text-site-purple">{error}</p>}
    </div>
  );
}

export function Alert({ tone = "error", children }: { tone?: "error" | "success"; children: ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`border-l-4 px-4 py-3 text-[14px] ${tone === "error" ? "border-site-purple bg-[#f8f1fa] text-site-purple" : "border-site-teal bg-[#f1f8f7] text-charcoal"}`}
    >
      {children}
    </p>
  );
}

export function SubmitButton({ pending, children, pendingLabel }: { pending: boolean; children: ReactNode; pendingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-site-teal py-4 text-[12px] font-medium tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#4fa99c] disabled:opacity-60"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
