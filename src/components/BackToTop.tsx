"use client";

import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-4 bottom-24 z-40 sm:right-6 sm:bottom-[104px] flex h-9 w-9 items-center justify-center rounded-sm bg-charcoal text-white transition-opacity hover:bg-black ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <svg aria-hidden viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
        <path d="M14.7 12.7a1 1 0 0 1-1.4 0L10 9.4l-3.3 3.3a1 1 0 0 1-1.4-1.4l4-4a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4Z" />
      </svg>
    </button>
  );
}
