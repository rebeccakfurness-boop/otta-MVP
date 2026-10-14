import "server-only";
import { createSessionStore, demoMode } from "@/lib/auth/sealed-session";
import { SESSION_COOKIE } from "./session-cookie";

export type PortalSession = {
  userId: string;
  name: string;
  email: string;
  brokerageId: string;
  method: "password" | "microsoft" | "google" | "link";
};

const store = createSessionStore<PortalSession>({
  cookie: SESSION_COOKIE,
  kind: "broker",
  fallbackSecret: "otta-portal-demo-only-secret-not-for-real-data-0000",
});

export { demoMode };
export const sessionSecret = store.secret;
export const readSession = store.read;
export const writeSession = store.write;
export const clearSession = store.clear;
