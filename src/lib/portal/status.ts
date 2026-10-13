import type { Policy } from "./types";

export type PolicyStatus = "Active" | "Renewal due" | "Expired";

const DAY = 24 * 60 * 60 * 1000;

export function policyStatus(policy: Policy, now: Date): PolicyStatus {
  const end = new Date(policy.end).getTime();
  if (end < now.getTime()) return "Expired";
  if (end - now.getTime() <= 60 * DAY) return "Renewal due";
  return "Active";
}

export function daysUntil(date: string, now: Date) {
  return Math.ceil((new Date(date).getTime() - now.getTime()) / DAY);
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" });
}

export function formatMoney(amount: number) {
  return amount.toLocaleString("en-NZ", { style: "currency", currency: "NZD", maximumFractionDigits: 0 });
}
