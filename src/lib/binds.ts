import "server-only";
import { getRecord, listRecords, putRecord } from "@/lib/db/records";

// A broker's instruction to bind a quote Otta has issued (from the quote's page
// in the broker portal). Keyed by quote reference: one instruction per quote.

export type BindInstruction = {
  quoteRef: string;
  brokerageId: string;
  brokerName: string;
  brokerEmail: string;
  insured: string;
  productSlug: string;
  inceptionDate: string;
  notes?: string;
  createdAt: string;
};

export const getBindInstruction = (quoteRef: string) => getRecord<BindInstruction>("bind-instructions", quoteRef);
export const saveBindInstruction = (b: BindInstruction) => putRecord("bind-instructions", b.quoteRef, b);
export const listBindInstructions = () => listRecords<BindInstruction>("bind-instructions");
