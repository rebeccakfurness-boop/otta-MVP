"use client";

import { useState } from "react";
import { Icon } from "@/components/portal/Icon";

export function CopyButton({ text, label = "Copy", className = "" }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          window.prompt("Copy this link", text);
        }
      }}
      className={`inline-flex items-center gap-1.5 border border-[#d6d6d6] bg-white px-3 py-2 text-[11px] font-medium tracking-[0.1em] whitespace-nowrap text-charcoal uppercase hover:border-site-teal hover:text-site-teal ${className}`}
    >
      <Icon name={copied ? "check" : "copy"} className="h-3.5 w-3.5" />
      {copied ? "Copied" : label}
    </button>
  );
}
