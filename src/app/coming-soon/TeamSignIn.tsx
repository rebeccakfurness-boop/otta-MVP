"use client";

import { useRef, useState, type FormEvent } from "react";

/** Small "Team sign in" link that opens a password box. */
export function TeamSignIn() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/coming-soon/unlock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: input.current?.value ?? "" }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        // Reload the page that was asked for; the gate now lets it through.
        window.location.reload();
        return;
      }
      setError(data.error ?? "That didn't work. Please try again.");
    } catch {
      setError("That didn't work. Please try again.");
    }
    setBusy(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setTimeout(() => input.current?.focus(), 0);
        }}
        className="inline-flex items-center gap-2 text-white/80 underline-offset-4 hover:text-white hover:underline"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        Team sign in
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center gap-2 sm:items-end">
      <div className="flex">
        <label htmlFor="preview-password" className="sr-only">
          Team password
        </label>
        <input
          id="preview-password"
          ref={input}
          type="password"
          autoComplete="current-password"
          placeholder="Team password"
          className="w-56 border border-white/40 bg-white/95 px-3.5 py-2.5 text-[14px] text-charcoal outline-none focus:border-site-teal focus:ring-2 focus:ring-site-teal/40"
        />
        <button
          type="submit"
          disabled={busy}
          className="bg-site-teal px-5 text-[12px] font-medium tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#4fa99c] disabled:opacity-70"
        >
          {busy ? "..." : "Enter"}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-[13px] text-white">
          {error}
        </p>
      )}
    </form>
  );
}
