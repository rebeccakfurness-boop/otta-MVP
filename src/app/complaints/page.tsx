import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";

export const metadata: Metadata = { title: "Complaints" };

export default function ComplaintsPage() {
  return (
    <>
      <PageHeader title="Complaints" />
      <Section>
        {/* TODO(stage 2): approved compliance wording. */}
        <p className="max-w-2xl text-lg text-muted">Approved wording to come.</p>
      </Section>
    </>
  );
}
