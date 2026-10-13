import type { Metadata } from "next";
import { Container } from "@/components/Mockup";

export const metadata: Metadata = { title: "Account Login" };

const inputClass = "mt-2 block w-full border border-[#e0e0e0] bg-white px-4 py-3 text-[15px] text-charcoal";

// Placeholder for the broker portal (later stage): iron-session cookies,
// bcryptjs password hashing and Neon Postgres, per the tech stack proposal.
export default function PortalLoginPage() {
  return (
    <section className="pt-[100px] pb-[130px]">
      <Container>
        <div className="mx-auto max-w-[480px] rounded-sm bg-footer p-10 md:p-12">
          <h1 className="text-center font-heading text-[30px] font-semibold tracking-normal text-site-teal">
            Account Login
          </h1>
          <div className="mx-auto mt-4 h-px w-[160px] bg-[#e0e0e0]" />
          <p className="mt-6 text-center text-[15px] leading-[1.7] text-body">
            Sign in to the broker portal to access quotes, documents and forms.
          </p>
          <form className="mt-8 space-y-5" aria-describedby="portal-note">
            <div>
              <label htmlFor="email" className="text-[14px] font-medium text-charcoal">Email</label>
              <input id="email" type="email" disabled className={inputClass} />
            </div>
            <div>
              <label htmlFor="password" className="text-[14px] font-medium text-charcoal">Password</label>
              <input id="password" type="password" disabled className={inputClass} />
            </div>
            <button
              type="button"
              disabled
              className="w-full bg-site-teal py-[15px] text-[12px] font-medium tracking-[0.12em] text-white uppercase opacity-60"
            >
              Sign in
            </button>
          </form>
          <p id="portal-note" className="mt-6 bg-white p-4 text-center text-[14px] text-body">
            The broker portal is coming soon.
          </p>
        </div>
      </Container>
    </section>
  );
}
