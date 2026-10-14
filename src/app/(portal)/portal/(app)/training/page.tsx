import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/portal/Icon";
import { ButtonLink, Card, PageHeader } from "@/components/portal/ui";
import { onboarding } from "@/content/onboarding";
import { portalTraining as copy, trainingWalkthrough } from "@/content/portal-pages";

export const metadata: Metadata = { title: "Training" };

export default function TrainingPage() {
  return (
    <>
      <PageHeader
        title={copy.title}
        description={copy.intro}
        actions={
          <ButtonLink href={onboarding.guide.href} icon="download" external>
            {copy.download}
          </ButtonLink>
        }
      />

      <h2 className="mb-4 font-heading text-[20px] font-semibold tracking-normal text-charcoal">{copy.stepsTitle}</h2>
      <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {copy.steps.map((s, i) => (
          <li key={s.title} className="rounded-sm border border-[#eaeaea] bg-white p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2e7d74] font-heading text-[15px] font-bold text-white">{i + 1}</span>
            <p className="mt-3 font-heading text-[16px] font-semibold text-charcoal">{s.title}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-body">{s.text}</p>
          </li>
        ))}
      </ol>

      <h2 className="mt-12 mb-4 font-heading text-[20px] font-semibold tracking-normal text-charcoal">{copy.walkthroughTitle}</h2>
      <div className="space-y-6">
        {trainingWalkthrough.map((w, wi) => (
          <Card key={w.image} className="overflow-hidden">
            <div className="grid xl:grid-cols-[minmax(0,1fr)_320px]">
              <Image
                src={`/images/portal-training/${w.image}.jpg`}
                alt={`${w.title}: screenshot with numbered callouts`}
                width={2160}
                height={1350}
                sizes="(min-width: 1280px) 60vw, 100vw"
                className="h-auto w-full border-b border-[#eaeaea] xl:border-r xl:border-b-0"
              />
              <div className="px-6 py-6">
                <p className="text-[12px] font-semibold tracking-[0.15em] text-site-teal uppercase">Step {wi + 1}</p>
                <h3 className="mt-1 font-heading text-[18px] font-semibold text-charcoal">{w.title}</h3>
                <ol className="mt-4 space-y-3">
                  {w.steps.map((s, i) => (
                    <li key={i} className="flex gap-3 text-[14px] leading-snug text-charcoal">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-site-purple text-[12px] font-bold text-white">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <p className="mt-8 flex items-center gap-2 text-[14px] text-body">
        <Icon name="help" className="h-4 w-4 text-site-teal" />
        {copy.help}
      </p>
    </>
  );
}
