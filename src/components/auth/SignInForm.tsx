"use client";

import { useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { site } from "@/content/site";

export type SignInState = { error?: string; email?: string; ok?: boolean };

const ssoErrors: Record<string, string> = {
  sso_unavailable: "Single sign-on isn't switched on yet. Please sign in with your email and password.",
  sso_failed: "We couldn't complete single sign-on. Please try again.",
  sso_not_registered: "Your account isn't set up for this portal yet. Request access below, or contact us.",
  link_expired: "That sign-in link has expired or has already been used. Email yourself a new one below.",
};

const inputClass =
  "mt-2 block w-full border border-[#d9d9d9] bg-white px-4 py-3 text-[15px] text-charcoal outline-none transition focus:border-site-teal focus:ring-2 focus:ring-[#e6f4f2]";

/**
 * Sign-in form shared by the broker portal and the admin portal: SSO buttons
 * first, then email and password.
 */
export function SignInForm({
  action: signIn,
  homeHref,
  ssoHref,
  forgotHref,
}: {
  action: (prev: SignInState, formData: FormData) => Promise<SignInState>;
  homeHref: string;
  ssoHref: (provider: "microsoft" | "google") => string;
  /** "Forgot password?" goes here (e.g. the email-me-a-link page); otherwise it emails Otta. */
  forgotHref?: string;
}) {
  const params = useSearchParams();
  const [state, action, pending] = useActionState<SignInState, FormData>(signIn, {});
  const error = state.error ?? ssoErrors[params.get("error") ?? ""];

  // After signing in, go back to the page they asked for (same site only).
  const next = params.get("next");
  const destination = next && next.startsWith("/") && !next.startsWith("//") ? next : homeHref;

  useEffect(() => {
    // Full page load, so the subdomain routing in src/proxy.ts applies.
    if (state.ok) window.location.assign(destination);
  }, [state.ok, destination]);

  return (
    <div className="mt-8">
      {error && (
        <p role="alert" className="mb-6 border-l-4 border-site-purple bg-[#f8f1fa] px-4 py-3 text-[14px] text-site-purple">
          {error}
        </p>
      )}

      <div className="grid gap-3">
        <SsoButton href={ssoHref("microsoft")} label="Continue with Microsoft">
          <svg aria-hidden viewBox="0 0 21 21" className="h-5 w-5">
            <path fill="#f25022" d="M1 1h9v9H1z" />
            <path fill="#7fba00" d="M11 1h9v9h-9z" />
            <path fill="#00a4ef" d="M1 11h9v9H1z" />
            <path fill="#ffb900" d="M11 11h9v9h-9z" />
          </svg>
        </SsoButton>
        <SsoButton href={ssoHref("google")} label="Continue with Google">
          <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5">
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
            <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
            <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8z" />
            <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
          </svg>
        </SsoButton>
      </div>

      <div className="my-7 flex items-center gap-4 text-[12px] tracking-[0.1em] text-body uppercase">
        <span className="h-px flex-1 bg-[#eaeaea]" />
        or with email
        <span className="h-px flex-1 bg-[#eaeaea]" />
      </div>

      <form action={action} className="space-y-5">
        <div>
          <label htmlFor="email" className="text-[14px] font-medium text-charcoal">
            Email address
          </label>
          <input id="email" name="email" type="email" autoComplete="username" required defaultValue={state.email} className={inputClass} />
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="password" className="text-[14px] font-medium text-charcoal">
              Password
            </label>
            <a
              href={forgotHref ?? `mailto:${site.email}?subject=${encodeURIComponent("Portal password reset")}`}
              className="text-[13px] text-site-teal hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
        </div>
        <button
          type="submit"
          disabled={pending || state.ok}
          className="w-full bg-site-teal py-4 text-[12px] font-medium tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#4fa99c] disabled:opacity-60"
        >
          {pending || state.ok ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function SsoButton({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="flex items-center justify-center gap-3 border border-[#d9d9d9] bg-white px-4 py-3 text-[15px] font-medium text-charcoal transition-colors hover:border-site-teal hover:bg-[#f4fbfa]"
    >
      {children}
      {label}
    </a>
  );
}
