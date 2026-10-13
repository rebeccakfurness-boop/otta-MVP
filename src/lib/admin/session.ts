import "server-only";
import { createSessionStore } from "@/lib/auth/sealed-session";
import { ADMIN_SESSION_COOKIE } from "./config";

export type AdminSession = {
  userId: string;
  name: string;
  email: string;
  role: string;
  method: "password" | "microsoft" | "google";
};

const store = createSessionStore<AdminSession>({
  cookie: ADMIN_SESSION_COOKIE,
  kind: "admin",
  fallbackSecret: "otta-admin-demo-only-secret-not-for-real-data-00000",
});

export const adminSessionSecret = store.secret;
export const readAdminSession = store.read;
export const writeAdminSession = store.write;
export const clearAdminSession = store.clear;
