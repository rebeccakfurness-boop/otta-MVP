import type { Metadata } from "next";
import Image from "next/image";
import { Container, ImagePlaceholder, LargeButton, PageIntro } from "@/components/Mockup";
import { team } from "@/content/team";

export const metadata: Metadata = { title: "Our Team" };

const leaders = team.slice(0, 2);
const rest = team.slice(2);

function TeamCard({ member: m }: { member: (typeof team)[number] }) {
  return (
    <li>
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
        <ImagePlaceholder label={`${m.name} portrait`} className="aspect-square" />
      )}
      <h2 className="mt-8 text-[25px] font-semibold tracking-normal text-charcoal">{m.name}</h2>
      <p className="mt-1 text-[16px] text-site-teal">{m.role}</p>
    </li>
  );
}
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
        {/* Directors sit alone on the top row (same card width as the grid below). */}
        <ul className="mx-auto mt-[72px] grid gap-x-9 gap-y-16 sm:grid-cols-2 lg:max-w-[calc((100%-72px)*2/3+36px)]">
          {leaders.map((m) => (
            <TeamCard key={m.name} member={m} />
          ))}
        </ul>
        <ul className="mt-16 grid gap-x-9 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((m) => (
            <TeamCard key={m.name} member={m} />
          ))}
        </ul>
        <div className="mt-20 text-center">
          <LargeButton href="/contact">Talk to our team</LargeButton>
        </div>
      </Container>
    </section>
  );
}
