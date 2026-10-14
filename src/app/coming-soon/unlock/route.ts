import { timingSafeEqual } from "node:crypto";
import { cookieDomain, GATE_COOKIE, gatePassword, gateToken } from "@/lib/gate/config";

// Team sign-in from the Coming Soon screen.
const attempts = new Map<string, number[]>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 10) return Response.json({ ok: false, error: "Too many attempts. Try again in a few minutes." }, { status: 429 });
  recent.push(now);
  attempts.set(ip, recent);

  const body = (await request.json().catch(() => ({}))) as { password?: unknown };
  const given = typeof body.password === "string" ? body.password.slice(0, 200) : "";
  const a = Buffer.from(await gateToken(given));
  const b = Buffer.from(await gateToken(gatePassword()));
  if (!given || a.length !== b.length || !timingSafeEqual(a, b)) {
    return Response.json({ ok: false, error: "That password isn't right." }, { status: 401 });
  }
  attempts.delete(ip);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const domain = cookieDomain(request.headers.get("host") ?? "");
  return Response.json(
    { ok: true },
    {
      headers: {
        "set-cookie": `${GATE_COOKIE}=${b.toString()}; Path=/; Max-Age=${30 * 86400}; HttpOnly; SameSite=Lax${secure}${domain ? `; Domain=${domain}` : ""}`,
        "cache-control": "no-store",
      },
    },
  );
}
