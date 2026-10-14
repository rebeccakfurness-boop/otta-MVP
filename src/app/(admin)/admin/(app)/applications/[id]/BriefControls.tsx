"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Icon } from "@/components/portal/Icon";
import { ratingRegions } from "@/content/rating-regions";
import { chooseRatingRegion, rewriteBrief } from "./actions";

const small =
  "inline-flex items-center gap-1.5 border border-[#d6d6d6] bg-white px-3 py-1.5 text-[11px] font-medium tracking-[0.1em] text-charcoal uppercase transition-colors hover:border-site-teal hover:text-site-teal disabled:opacity-60";

/** While the brief is being written, refresh the page every few seconds. */
export function RefreshWhilePending() {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => router.refresh(), 3000);
    return () => clearInterval(t);
  }, [router]);
  return null;
}

export function RewriteButton({ applicationId, label = "Write again" }: { applicationId: string; label?: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className={small}
      disabled={pending}
      onClick={() =>
        start(async () => {
          await rewriteBrief(applicationId);
          router.refresh();
        })
      }
    >
      <Icon name="sync" className="h-3.5 w-3.5" />
      {pending ? "Starting" : label}
    </button>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={small}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          window.prompt("Copy this text:", text);
        }
      }}
    >
      <Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" />
      {copied ? "Copied" : label}
    </button>
  );
}

export function RegionSelect({ applicationId, value, suggested }: { applicationId: string; value: string; suggested: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  return (
    <div>
      <select
        aria-label="Rating region"
        value={value}
        disabled={pending}
        onChange={(e) => {
          const region = e.target.value;
          start(async () => {
            const r = await chooseRatingRegion(applicationId, region);
            setError(r.error ?? "");
            router.refresh();
          });
        }}
        className="w-full border border-[#d9d9d9] bg-white px-3 py-2 text-[14px] text-charcoal outline-none focus:border-site-teal focus:ring-2 focus:ring-[#e6f4f2] sm:w-auto"
      >
        {!value && <option value="">Choose the region</option>}
        {ratingRegions.map((r) => (
          <option key={r} value={r}>
            {r}
            {r === suggested ? " (suggested)" : ""}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-[13px] text-site-purple">{error}</p>}
    </div>
  );
}
