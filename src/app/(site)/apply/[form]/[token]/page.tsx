import type { Metadata } from "next";
import { Suspense } from "react";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { Container, LargeButton } from "@/components/Mockup";
import { getForm } from "@/content/forms";
import { keyNameDefaults } from "@/lib/forms/application";
import { site } from "@/content/site";
import { openLink } from "@/lib/applications/client-link";
import { getLink } from "@/lib/applications/store";
import { submitClientApplication } from "./actions";

export const metadata: Metadata = { title: "Online application", robots: { index: false, follow: false } };

export default function ClientApplicationPage(props: PageProps<"/apply/[form]/[token]">) {
  return (
    <section className="bg-footer pt-16 pb-24">
      <Container className="max-w-[1180px]">
        <Suspense fallback={<div className="h-96 animate-pulse bg-white" />}>
          <ClientApplication params={props.params} />
        </Suspense>
      </Container>
    </section>
  );
}

async function ClientApplication({ params }: { params: PageProps<"/apply/[form]/[token]">["params"] }) {
  const { token } = await params;
  const link = await openLink(token);
  const form = getForm(link?.form);
  if (!link || !form) {
    return (
      <Notice title="This link has expired">
        Application links work for 30 days. Please ask your broker to send you a new one, or contact us on {site.phone}.
      </Notice>
    );
  }
  if ((await getLink(link.id))?.completedAt) {
    return (
      <Notice title="This application is already in">
        Thanks, this application has been submitted to {link.brokerageName} and the Otta team. If something needs changing,
        please contact {link.brokerName} at {link.brokerageName}.
      </Notice>
    );
  }
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Pacific/Auckland" }).format(new Date());
  return (
    <>
      <div className="mb-10">
        <p className="text-[12px] font-medium tracking-[0.14em] text-[#2e7d74] uppercase">
          Requested by {link.brokerName}, {link.brokerageName}
        </p>
        <h1 className="mt-3 text-[32px] leading-tight tracking-[-0.02em] md:text-[40px]">{form.title}</h1>
        <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-body">
          Kia ora {link.clientName.split(" ")[0]}. Please answer every question below. When you submit, your application goes
          straight to {link.brokerageName} and the Otta team. You can download a PDF copy at any time.
        </p>
      </div>
      <ApplicationForm
        formId={form.id}
        audience="client"
        action={submitClientApplication.bind(null, token)}
        defaults={{
          broker: link.brokerageName,
          ...keyNameDefaults(form, link.clientName),
          email: link.clientEmail ?? "",
          signatoryName: link.clientName,
          signedDate: today,
        }}
        pdfUrl={`/apply/${form.id}/${encodeURIComponent(token)}/pdf`}
        brokerageName={link.brokerageName}
        addressUrl="/address-search"
      />
    </>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl bg-white px-8 py-14 text-center">
      <h1 className="text-[28px] tracking-[-0.02em]">{title}</h1>
      <p className="mt-4 text-[16px] leading-relaxed text-body">{children}</p>
      <div className="mt-8">
        <LargeButton href="/">Go to the Otta website</LargeButton>
      </div>
    </div>
  );
}
