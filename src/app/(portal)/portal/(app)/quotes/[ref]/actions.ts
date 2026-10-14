"use server";

import { recordActivity } from "@/lib/activity";
import { adminUrl } from "@/lib/applications/urls";
import { getBindInstruction, saveBindInstruction } from "@/lib/binds";
import { sendEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { findBrokerage, getQuote } from "@/lib/portal/data";
import { productName, teamEmail } from "@/lib/portal/products";
import { readBroker } from "@/lib/portal/auth";
import { canPlace } from "@/lib/portal/scope";

export type BindState = { ok?: boolean; error?: string };

/** A broker instructs Otta to bind a quote it has issued. */
export async function instructBind(
  _prev: BindState,
  formData: FormData,
): Promise<BindState> {
  const session = await readBroker();
  if (!session)
    return { error: "Your session has ended. Please sign in again." };
  const ref = String(formData.get("ref") ?? "");
  const quote = await getQuote(session.scope, ref);
  if (!quote || !canPlace(session.scope, quote.brokerageId)) return { error: "We couldn't find that quote." };
  if (quote.status !== "Quoted")
    return { error: "Only a quote Otta has issued can be bound." };
  if (await getBindInstruction(ref))
    return {
      error: "A bind instruction has already been sent for this quote.",
    };

  const inceptionDate = String(formData.get("inceptionDate") ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(inceptionDate))
    return { error: "Choose the date cover should start." };
  if (formData.get("confirm") !== "on")
    return {
      error: "Please confirm the client has accepted the quote and its terms.",
    };
  const notes =
    String(formData.get("notes") ?? "")
      .trim()
      .slice(0, 2000) || undefined;

  const createdAt = new Date().toISOString();
  await saveBindInstruction({
    quoteRef: ref,
    brokerageId: session.brokerageId,
    brokerName: session.name,
    brokerEmail: session.email,
    insured: quote.insured,
    productSlug: quote.productSlug,
    inceptionDate,
    notes,
    createdAt,
  });
  const brokerage = await findBrokerage(session.brokerageId);
  await recordActivity({
    kind: "bind",
    title: quote.insured,
    detail: `${productName(quote.productSlug)}, ${ref}, from ${session.name}, ${brokerage?.name ?? "broker"}`,
    path: `/quotes/${ref}`,
    createdAt,
  });
  try {
    await sendEmail({
      to: env.applicationToEmail || teamEmail(quote.productSlug),
      replyTo: session.email,
      senderName: "Otta Broker Portal",
      subject: `Bind instruction: ${quote.insured} (${ref})`,
      text: [
        `${session.name} at ${brokerage?.name ?? "a brokerage"} has instructed Otta to bind this quote.`,
        ``,
        `Quote: ${ref}`,
        `Insured: ${quote.insured}`,
        `Product: ${productName(quote.productSlug)}`,
        `Cover to start: ${inceptionDate}`,
        notes ? `Notes: ${notes}` : ``,
        ``,
        `The broker confirmed the client has accepted the quote and its terms.`,
        `In the admin portal: ${await adminUrl(`/quotes/${ref}`)}`,
      ].join("\n"),
    });
  } catch (error) {
    console.error("[bind] email failed (the instruction is saved)", error);
  }
  return { ok: true };
}
