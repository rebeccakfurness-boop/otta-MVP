import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";

export const metadata: Metadata = { title: "Fair Insurance Code" };

export default function FairInsuranceCodePage() {
  return (
    <>
      <PageHeader title="Fair Insurance Code" />
      <Section>
        {/* TODO(stage 2): approved compliance wording. */}
        <p className="max-w-2xl text-lg text-muted">Approved wording to come.</p>
      </Section>
    </>
  );
}
