import Image from "next/image";
import { Suspense, type ReactNode } from "react";
import { Icon } from "@/components/portal/Icon";
import { onboarding } from "@/content/onboarding";
import { site } from "@/content/site";

/** Split-screen sign-in page shared by the broker and admin portals. */
export function SignInPage({
  label,
  headline,
  intro,
  benefits,
  access,
  demo,
  websiteUrl,
  form,
  title = "Sign in",
  footer,
}: {
  /** Heading above the form. */
  title?: string;
  /** Shown under the form on every screen size, e.g. "New to Otta? Request access". */
  footer?: ReactNode;
  label: string;
  headline: string;
  intro: string;
  benefits: string[];
  access: ReactNode;
  demo?: { email: string; password: string };
  websiteUrl: string;
  form: ReactNode;
}) {

  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-site-teal px-14 py-14 text-white lg:flex lg:flex-col">
        <svg aria-hidden viewBox="0 0 100 100" className="absolute -right-32 -bottom-32 h-[520px] w-[520px] text-white/10">
          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="18" />
        </svg>
        <Image src="/brand/otta-logo-tagline-white.png" alt="Otta, insurance that works" width={449} height={212} className="h-16 w-auto self-start" priority />
        <div className="relative mt-auto mb-auto pt-16">
          <p className="text-[12px] font-semibold tracking-[0.25em] text-white/80 uppercase">{label}</p>
          <h1 className="mt-4 max-w-md text-[40px] leading-[1.1] font-bold tracking-[-0.03em] text-white">
            {headline}
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
        <p className="relative text-[13px] text-white/80">{access}</p>
      </aside>

      {/* Sign in */}
      <main className="flex flex-col bg-white px-5 py-10 sm:px-10">
        <div className="flex items-center justify-between">
          <Image src="/brand/otta-logo.png" alt="Otta" width={513} height={191} className="h-8 w-auto lg:invisible" />
          <a href={websiteUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-[13px] text-body hover:text-site-teal">
            Visit the Otta website
            <Icon name="external" className="h-4 w-4" />
          </a>
        </div>
        <div className="mx-auto my-auto w-full max-w-[420px] py-12">
          <p className="text-[12px] font-semibold tracking-[0.2em] text-site-teal uppercase lg:hidden">Broker Portal</p>
          <h2 className="mt-2 text-[32px] font-bold tracking-[-0.02em] text-charcoal">{title}</h2>
          <p className="mt-2 text-[15px] text-body">{intro}</p>
          <Suspense>{form}</Suspense>
          {footer && <div className="mt-8 border-t border-[#eaeaea] pt-6 text-[14px] text-body">{footer}</div>}
          {demo && (
            <div className="mt-8 border-l-4 border-site-teal bg-footer px-5 py-4 text-[13px] leading-relaxed text-body">
              <p className="font-semibold text-charcoal">Prototype demo account</p>
              <p className="mt-1">
                Email: <span className="font-medium text-charcoal">{demo.email}</span>
                <br />
                Password: <span className="font-medium text-charcoal">{demo.password}</span>
              </p>
            </div>
          )}
        </div>
        <nav aria-label="Otta website" className="mb-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px]">
          {onboarding.websiteLinks.map((l) => (
            <a key={l.path} href={`${websiteUrl.replace(/\/$/, "")}${l.path}`} target="_blank" rel="noopener" className="text-site-teal hover:underline">
              {l.label}
            </a>
          ))}
        </nav>
        <p className="text-center text-[12px] text-body">
          <Icon name="lock" className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />
          Secure, encrypted sign in. © Otta. Need help? Call {site.phone}.
        </p>
      </main>
    </div>
  );
}
