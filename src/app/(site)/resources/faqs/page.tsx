import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { Container, PageIntro } from "@/components/Mockup";
import { faqGroups, faqId, faqIntro, faqText } from "@/content/faqs";
import { OpenFromHash } from "./OpenFromHash";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers to common questions about Otta insurance, applying for cover, claims and the Otta Broker Portal.",
};

/** Turns [label](href) in FAQ copy into links. Documents open in a new tab. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!m) return <Fragment key={i}>{part}</Fragment>;
        const [, label, href] = m;
        const className = "font-medium text-[#2e7d74] underline-offset-2 hover:underline";
        return href.endsWith(".pdf") ? (
          <a key={i} href={href} target="_blank" rel="noopener" className={className}>
            {label}
          </a>
        ) : (
          <Link key={i} href={href} className={className}>
            {label}
          </Link>
        );
      })}
    </>
  );
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqGroups.flatMap((g) =>
    g.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: faqText(f.a) } })),
  ),
};

export default function FaqsPage() {
  return (
    <section className="pt-[118px] pb-[120px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <OpenFromHash />
      <Container>
        <PageIntro title="Frequently asked questions">
          <p>
            <RichText text={faqIntro} />
          </p>
        </PageIntro>

        <nav aria-label="FAQ topics" className="mx-auto mt-12 flex max-w-[1000px] flex-wrap justify-center gap-2">
          {faqGroups.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="border border-[#d9d9d9] px-4 py-2 text-[13px] text-charcoal transition-colors hover:border-site-teal hover:text-site-teal">
              {g.title}
            </a>
          ))}
        </nav>

        <div className="mx-auto mt-14 max-w-[1000px] space-y-14">
          {faqGroups.map((g) => (
            <section key={g.id} id={g.id} className="scroll-mt-28">
              <h2 className="mb-5 font-heading text-[24px] font-semibold tracking-normal text-charcoal">{g.title}</h2>
              <div className="divide-y divide-[#e3e3e3] border-y border-[#e3e3e3]">
                {g.faqs.map((f) => (
                  <details key={f.q} id={faqId(f.q)} className="group scroll-mt-28">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-medium text-charcoal transition-colors hover:text-[#2e7d74] [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-site-teal text-[18px] leading-none text-site-teal transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="space-y-3 pr-12 pb-6 text-[15px] leading-[1.75] text-body">
                      {f.a.map((p) => (
                        <p key={p.slice(0, 40)}>
                          <RichText text={p} />
                        </p>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </section>
  );
}
