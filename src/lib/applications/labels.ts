import type { Application } from "./store";

/** Status badge text for an application. */
export function applicationStatus(app: Pick<Application, "source">) {
  return app.source === "public" ? "Direct (website)" : app.source === "client" ? "Completed by client" : "Sent to Otta";
}

/** Who an application came through: the brokerage, or the website for direct applications. */
export function applicationChannel(app: Pick<Application, "source" | "brokerageId">, names: Record<string, string>) {
  return app.source === "public" ? "Direct (website)" : (names[app.brokerageId] ?? app.brokerageId);
}
