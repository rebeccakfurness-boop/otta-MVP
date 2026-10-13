import type { Metadata } from "next";
import Image from "next/image";
import { Container, DarkPlaceholder, LargeButton, PageIntro } from "@/components/Mockup";
import { team } from "@/content/team";

export const metadata: Metadata = { title: "Our Team" };


export default function TeamPage() {
  return (
    <section className="pt-[118px] pb-[120px]">
      <Container>
        <PageIntro title="Our Team">
          <p>
            Talk directly to the people who make the decisions. Our underwriters and specialists
            work closely with brokers and property managers to make the complex simple.
          </p>
        </PageIntro>
        <ul className="mt-[72px] grid gap-x-9 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <li key={m.name}>
              {m.photo ? (
                <Image
                  src={m.photo}
                  alt={`${m.name}, ${m.role}`}
                  width={900}
                  height={900}
                  sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <DarkPlaceholder label={`${m.name} portrait`} className="aspect-square" />
              )}
              <h2 className="mt-8 text-[25px] font-semibold tracking-normal text-charcoal">{m.name}</h2>
              <p className="mt-1 text-[16px] text-site-teal">{m.role}</p>
            </li>
          ))}
        </ul>
        <div className="mt-20 text-center">
          <LargeButton href="/contact">Talk to our team</LargeButton>
        </div>
      </Container>
    </section>
  );
}
