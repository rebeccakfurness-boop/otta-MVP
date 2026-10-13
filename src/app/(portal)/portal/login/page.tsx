import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { Icon } from "@/components/portal/Icon";
import { site } from "@/content/site";
import { PORTAL_HOST } from "@/lib/portal/config";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

const benefits = [
  "Track every quote request in one place",
  "See all policies bound with Otta",
  "Download policy documents any time",
  "Find every proposal, renewal and claim form",
];

export default function LoginPage() {
  // Demo credentials are shown while the portal runs on demo data.
  const showDemo = process.env.PORTAL_DEMO_LOGIN !== "false";
  const websiteUrl = PORTAL_HOST ? site.url : "/";

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-site-teal px-14 py-14 text-white lg:flex lg:flex-col">
        <svg aria-hidden viewBox="0 0 100 100" className="absolute -right-32 -bottom-32 h-[520px] w-[520px] text-white/10">
          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="18" />
        </svg>
        <Image src="/brand/otta-logo-tagline-white.png" alt="Otta, insurance that works" width={449} height={212} className="h-16 w-auto self-start" priority />
        <div className="relative mt-auto mb-auto pt-16">
          <p className="text-[12px] font-semibold tracking-[0.25em] text-white/80 uppercase">Broker Portal</p>
          <h1 className="mt-4 max-w-md text-[40px] leading-[1.1] font-bold tracking-[-0.03em] text-white">
            Everything you place with Otta, in one place.
          </h1>
          <ul className="mt-10 space-y-4">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 text-[16px] text-white">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/70">
                  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-[13px] text-white/80">
          Need access for your brokerage? Email{" "}
          <a href={`mailto:${site.email}`} className="text-white underline">
            {site.email}
          </a>
        </p>
      </aside>

      {/* Sign in */}
      <main className="flex flex-col bg-white px-5 py-10 sm:px-10">
        <div className="flex items-center justify-between">
          <Image src="/brand/otta-logo.png" alt="Otta" width={513} height={191} className="h-8 w-auto lg:invisible" />
          <a href={websiteUrl} className="inline-flex items-center gap-1.5 text-[13px] text-body hover:text-site-teal">
            <Icon name="back" className="h-4 w-4" />
            Back to website
          </a>
        </div>
        <div className="mx-auto my-auto w-full max-w-[420px] py-12">
          <p className="text-[12px] font-semibold tracking-[0.2em] text-site-teal uppercase lg:hidden">Broker Portal</p>
          <h2 className="mt-2 text-[32px] font-bold tracking-[-0.02em] text-charcoal">Sign in</h2>
          <p className="mt-2 text-[15px] text-body">Use your brokerage&apos;s Microsoft or Google account, or your portal email and password.</p>
          <Suspense>
            <LoginForm />
          </Suspense>
          {showDemo && (
            <div className="mt-8 border-l-4 border-site-teal bg-footer px-5 py-4 text-[13px] leading-relaxed text-body">
              <p className="font-semibold text-charcoal">Prototype demo account</p>
              <p className="mt-1">
                Email: <span className="font-medium text-charcoal">demo@harbourbrokers.co.nz</span>
                <br />
                Password: <span className="font-medium text-charcoal">OttaDemo2026!</span>
              </p>
            </div>
          )}
        </div>
        <p className="text-center text-[12px] text-body">
          <Icon name="lock" className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />
          Secure, encrypted sign in. © Otta. Need help? Call {site.phone}.
        </p>
      </main>
    </div>
  );
}
