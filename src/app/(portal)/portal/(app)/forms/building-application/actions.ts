"use server";

import { deliverApplication } from "@/lib/applications/deliver";
import { answersFromFormData, validate, type SubmitState } from "@/lib/forms/building-application";
import { requireBroker } from "@/lib/portal/auth";

export async function submitBuildingApplication(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
  const broker = await requireBroker();
  const answers = answersFromFormData(formData);
  const errors = validate(answers);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };

  try {
    const sent = await deliverApplication({
      answers,
      source: "broker",
      brokerageId: broker.brokerageId,
      brokerageName: broker.brokerageName,
      brokerName: broker.name,
      brokerEmail: broker.email,
      submittedBy: broker.name,
      submittedByEmail: broker.email,
    });
    return { status: "sent", ...sent };
  } catch (error) {
    console.error("[building-application] send failed", error);
    return {
      status: "error",
      message: "We couldn't send the application just now. Please try again, or download the PDF and email it to the Otta team.",
    };
  }
}
