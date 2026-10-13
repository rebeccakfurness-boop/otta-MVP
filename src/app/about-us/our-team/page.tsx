import type { Metadata } from "next";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";

export const metadata: Metadata = { title: "Our Team" };

// TODO(stage 2): replace with real team members and photos.
const team = Array.from({ length: 6 }, (_, i) => ({
  name: `Team member ${i + 1}`,
  role: "Role title",
}));

export default function TeamPage() {
  return (
    <>
      <PageHeader eyebrow="About us" title="Our Team">
        Talk directly to the people who make the decisions. Team profiles to come.
      </PageHeader>
      <Section>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => (
            <li key={m.name}>
              <ImagePlaceholder
                label="Portrait"
                className="aspect-square rounded-2xl"
                tone={(["ocean", "deep", "sunset"] as const)[i % 3]}
              />
              <h2 className="mt-4 text-xl">{m.name}</h2>
              <p className="text-ocean-700">{m.role}</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
