import type { Metadata } from "next";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = { title: "Account Login" };

// Placeholder for the broker portal (Stage 1+): iron-session cookies,
// bcryptjs password hashing and Neon Postgres, per the tech stack proposal.
export default function PortalLoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ocean-50 px-5 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl shadow-ink/5">
        <Logo className="mx-auto h-10 w-auto" />
        <h1 className="mt-8 text-center text-2xl">Broker portal</h1>
        <p className="mt-2 text-center text-sm text-muted">Sign in to access quotes, documents and forms.</p>
        <form className="mt-8 space-y-5" aria-describedby="portal-note">
          <div>
            <label htmlFor="email" className="text-sm font-semibold">Email</label>
            <input id="email" type="email" disabled className="mt-1.5 block w-full rounded-lg border border-cloud bg-cloud-50 px-4 py-3" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold">Password</label>
            <input id="password" type="password" disabled className="mt-1.5 block w-full rounded-lg border border-cloud bg-cloud-50 px-4 py-3" />
          </div>
          <button type="button" disabled className="w-full rounded-full bg-ocean-700 py-3.5 font-semibold text-white opacity-60">
            Sign in
          </button>
        </form>
        <p id="portal-note" className="mt-6 rounded-lg bg-cloud-50 p-4 text-center text-sm text-muted">
          The broker portal is coming soon.
        </p>
      </div>
    </div>
  );
}
