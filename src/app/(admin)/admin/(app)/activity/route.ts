import { activityLabel, listActivity } from "@/lib/activity";
import { readAdminSession } from "@/lib/admin/session";

// The admin portal's live activity feed: polled every few seconds by the
// celebration (src/components/admin/ActivityCelebration.tsx).
export async function GET(request: Request) {
  if (!(await readAdminSession())) return Response.json({ events: [] }, { status: 401 });
  const since = new URL(request.url).searchParams.get("since") ?? undefined;
  const events = await listActivity({ since, limit: 10 });
  return Response.json(
    { events: events.map((e) => ({ ...e, label: activityLabel[e.kind] })), now: new Date().toISOString() },
    { headers: { "cache-control": "no-store" } },
  );
}
