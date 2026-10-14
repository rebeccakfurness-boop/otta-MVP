import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { ButtonLink, LoadingBlocks, PageHeader } from "@/components/portal/ui";
import { formBySlug, onlineForms } from "@/content/forms";
import { requireBroker } from "@/lib/portal/auth";
import { portalPath } from "@/lib/portal/config";
import { submitApplication } from "./actions";

export function generateStaticParams() {
  return onlineForms.map((f) => ({ form: f.slug }));
}

export async function generateMetadata(props: PageProps<"/portal/forms/[form]">): Promise<Metadata> {
  return { title: formBySlug((await props.params).form)?.shortTitle };
}

export default function OnlineFormPage(props: PageProps<"/portal/forms/[form]">) {
  return (
    <Suspense fallback={<LoadingBlocks rows={8} />}>
      <OnlineForm params={props.params} />
    </Suspense>
  );
}

async function OnlineForm({ params }: { params: PageProps<"/portal/forms/[form]">["params"] }) {
  const form = formBySlug((await params).form);
  if (!form) notFound();
  const broker = await requireBroker();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Pacific/Auckland" }).format(new Date());
  return (
    <>
      <PageHeader
        back={{ href: portalPath("/forms"), label: "Forms" }}
        title={form.title}
        description={form.summary}
        actions={
          <ButtonLink href={portalPath(`/applications/send?form=${form.id}`)} variant="secondary" icon="send">
            Send to a client instead
          </ButtonLink>
        }
      />
      <ApplicationForm
        formId={form.id}
        audience="broker"
        action={submitApplication.bind(null, form.id)}
        defaults={{ broker: broker.brokerageName, signedDate: today }}
        pdfUrl={portalPath(`/forms/${form.slug}/pdf`)}
        addressUrl={portalPath("/address-search")}
        links={{
          back: { href: portalPath("/applications"), label: "All applications" },
          applicationsBase: portalPath("/applications"),
        }}
      />
    </>
  );
}
