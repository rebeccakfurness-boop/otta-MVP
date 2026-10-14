"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

// Watches the admin activity feed and celebrates each new enquiry, quote
// request, claim, renewal or bind instruction: a burst of Otta-coloured
// confetti and a card saying what came in. Runs on every admin page.

type FeedEvent = { id: string; kind: string; label: string; title: string; detail: string; path: string; createdAt: string };

const SEEN_KEY = "otta-admin-activity-seen";
const COLOURS = ["#61b9ad", "#2e7d74", "#004b6e", "#8e3a9d", "#f2c94c", "#ffffff"];
const POLL_MS = 8000;

function readSeen() {
  try {
    return localStorage.getItem(SEEN_KEY);
  } catch {
    return null;
  }
}
function writeSeen(value: string) {
  try {
    localStorage.setItem(SEEN_KEY, value);
  } catch {
    // Private windows can block storage; the celebration still works for this visit.
  }
}

/** A short confetti burst on a full-screen canvas. Skipped when the person prefers reduced motion. */
export function popConfetti() {
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "9999" });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
  const w = window.innerWidth;
  const h = window.innerHeight;
  // Two bursts from the lower corners, angled up and in.
  const pieces = Array.from({ length: 180 }, (_, i) => {
    const left = i % 2 === 0;
    const angle = (left ? -60 : -120) * (Math.PI / 180) + (Math.random() - 0.5) * 0.9;
    const speed = 11 + Math.random() * 9;
    return {
      x: left ? w * 0.15 : w * 0.85,
      y: h * 0.85,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 6 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.3,
      colour: COLOURS[i % COLOURS.length],
      round: Math.random() < 0.3,
    };
  });
  const start = performance.now();
  const frame = (t: number) => {
    const elapsed = t - start;
    ctx.clearRect(0, 0, w, h);
    for (const p of pieces) {
      p.vy += 0.32;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.spin;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - elapsed / 3200);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.colour;
      if (p.round) {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      ctx.restore();
    }
    if (elapsed < 3200) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}

export function ActivityCelebration({ feedUrl, adminBase }: { feedUrl: string; adminBase: string }) {
  const router = useRouter();
  const [cards, setCards] = useState<FeedEvent[]>([]);
  const busy = useRef(false);

  const dismiss = useCallback((id: string) => setCards((c) => c.filter((e) => e.id !== id)), []);

  useEffect(() => {
    let stopped = false;
    async function check() {
      if (busy.current || document.hidden) return;
      busy.current = true;
      try {
        const seen = readSeen();
        const res = await fetch(seen ? `${feedUrl}?since=${encodeURIComponent(seen)}` : feedUrl, { cache: "no-store" });
        if (!res.ok || stopped) return;
        const data = (await res.json()) as { events: FeedEvent[]; now: string };
        if (!seen) {
          // First visit on this browser: start from now, without celebrating the past.
          writeSeen(data.events[0]?.createdAt ?? data.now);
          return;
        }
        const fresh = data.events.filter((e) => e.createdAt > seen);
        if (fresh.length === 0) return;
        writeSeen(fresh[0].createdAt);
        popConfetti();
        setCards((c) => [...fresh.slice(0, 3), ...c].slice(0, 4));
        router.refresh();
      } catch {
        // Offline or signed out: try again next time.
      } finally {
        busy.current = false;
      }
    }
    check();
    const timer = setInterval(check, POLL_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [feedUrl, router]);

  // Each card stays 12 seconds.
  useEffect(() => {
    if (cards.length === 0) return;
    const t = setTimeout(() => setCards((c) => c.slice(0, -1)), 12000);
    return () => clearTimeout(t);
  }, [cards]);

  if (cards.length === 0) return null;
  return (
    <div aria-live="polite" className="fixed top-5 right-5 z-[10000] flex w-[340px] max-w-[calc(100vw-2.5rem)] flex-col gap-3">
      {cards.map((e) => (
        <div key={e.id} className="animate-[pop_0.35s_ease-out] overflow-hidden rounded-sm border border-site-teal bg-white shadow-xl">
          <div className="flex items-center justify-between bg-site-teal px-4 py-2.5 text-white">
            <span className="text-[13px] font-bold tracking-[0.12em] uppercase">🎉 {e.label}</span>
            <button type="button" aria-label="Dismiss" onClick={() => dismiss(e.id)} className="text-[18px] leading-none text-white/80 hover:text-white">
              ×
            </button>
          </div>
          <a href={`${adminBase}${e.path}`} className="block px-4 py-3 hover:bg-[#f1f8f7]">
            <span className="block font-heading text-[16px] font-semibold text-charcoal">{e.title}</span>
            <span className="mt-0.5 block text-[13px] text-body">{e.detail}</span>
            <span className="mt-2 block text-[11px] font-medium tracking-[0.12em] text-[#2e7d74] uppercase">Open</span>
          </a>
        </div>
      ))}
    </div>
  );
}

/** The "Try it" button on the dashboard: the same celebration, without a real event. */
export function CelebrationPreview() {
  return (
    <button
      type="button"
      onClick={popConfetti}
      className="text-[12px] font-medium tracking-[0.1em] text-[#2e7d74] uppercase hover:underline"
    >
      Try the celebration
    </button>
  );
}
