import type { Metadata } from "next";
import Image from "next/image";
import { HeroVideo } from "@/components/HeroVideo";
import { comingSoon } from "@/content/coming-soon";
import { site } from "@/content/site";
import { TeamSignIn } from "./TeamSignIn";

export const metadata: Metadata = { title: "Coming soon", robots: { index: false, follow: false } };

// Shown in place of every page until launch (see src/lib/gate/config.ts).
export default function ComingSoonPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden text-white">
      <HeroVideo />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#014c69]/55 via-[#014c69]/35 to-[#014c69]/70" />
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <Image src="/brand/otta-logo-white.png" alt="Otta" width={513} height={191} priority className="h-16 w-auto md:h-20" />
        <h1 className="mt-10 text-[40px] leading-[1.1] font-bold tracking-[-0.02em] text-white md:text-[64px]">{comingSoon.heading}</h1>
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/90 md:text-[19px]">{comingSoon.body}</p>
        <div className="mt-6 h-[2px] w-[90px] bg-site-teal" />
        <p className="mt-6 text-[15px] text-white/85">
          {comingSoon.contact}{" "}
          <a href={`mailto:${site.email}`} className="font-medium text-white underline underline-offset-4">
            {site.email}
          </a>{" "}
          or{" "}
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="font-medium whitespace-nowrap text-white underline underline-offset-4">
            {site.phone}
          </a>
          .
        </p>
      </div>
      <footer className="relative flex flex-col items-center gap-3 px-6 pb-8 text-[13px] text-white/75 sm:flex-row sm:justify-between">
        <span>
          © {comingSoon.year} {site.name}. {site.tagline}.
        </span>
        <TeamSignIn />
      </footer>
    </main>
  );
}
