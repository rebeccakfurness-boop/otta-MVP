"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { steveGreeting, steveSuggestions } from "@/content/steve-ui";
import { Otter } from "./Otter";

type Message = { role: "user" | "assistant"; content: string };

// Turn site paths such as /solutions/landlord-insurance into links.
function withLinks(text: string): ReactNode[] {
  return text.split(/(\/[a-z0-9][a-z0-9\-/]*[a-z0-9])/g).map((part, i) =>
    i % 2 === 1 ? (
      <Link key={i} href={part} className="font-medium text-site-teal underline">
        {part}
      </Link>
    ) : (
      part
    ),
  );
}

export function SteveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    const history: Message[] = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/steve", {
        method: "POST",
        headers: { "content-type": "application/json" },
        // Keep the last 20 turns so the request stays small.
        body: JSON.stringify({ messages: history.slice(-19) }),
      });
      if (!res.body) throw new Error("No response");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: answer }]);
      }
    } catch {
      setMessages([
        ...history,
        { role: "assistant", content: "Sorry, I've drifted off downstream. Please try again in a moment." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <section
          role="dialog"
          aria-label="Chat with Steve"
          className="flex h-[min(560px,calc(100vh-7rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 sm:w-[380px]"
        >
          <header className="flex items-center gap-3 bg-site-teal px-4 py-3 text-white">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white">
              <Otter className="h-9 w-9" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-[17px] font-bold">Steve</p>
              <p className="text-[12px] text-white/85">Otta&apos;s friendly otter · Ask me anything</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1.5 hover:bg-white/15"
              aria-label="Close chat"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </header>

          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto bg-footer px-4 py-4" aria-live="polite">
            <Bubble role="assistant">{steveGreeting}</Bubble>
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {steveSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-site-teal bg-white px-3 py-1.5 text-left text-[13px] text-site-teal transition-colors hover:bg-site-teal hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role}>
                {m.content ? withLinks(m.content) : <Typing />}
              </Bubble>
            ))}
          </div>

          <form onSubmit={onSubmit} className="border-t border-[#eaeaea] bg-white p-3">
            <div className="flex items-end gap-2">
              <label htmlFor="steve-input" className="sr-only">
                Ask Steve a question
              </label>
              <textarea
                id="steve-input"
                ref={inputRef}
                rows={1}
                maxLength={1000}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask me anything…"
                className="max-h-28 min-h-[44px] flex-1 resize-none border border-[#e0e0e0] px-3 py-2.5 text-[14px] text-charcoal outline-none focus:border-site-teal"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="h-[44px] bg-site-teal px-4 text-[12px] font-medium tracking-[0.12em] text-white uppercase transition-colors hover:bg-[#4fa99c] disabled:opacity-50"
              >
                Send
              </button>
            </div>
            <p className="mt-2 text-[11px] leading-snug text-body">
              Steve is an AI assistant and gives general information only, not advice. Please
              don&apos;t share personal details. For cover questions, talk to your broker or{" "}
              <Link href="/contact" className="underline">
                contact us
              </Link>
              .
            </p>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close chat with Steve" : "Ask Steve the otter anything"}
        className="group flex items-center gap-2 rounded-full bg-white py-1.5 pr-5 pl-1.5 shadow-lg ring-1 ring-black/5 transition-transform hover:-translate-y-0.5"
      >
        <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#e6f4f2]">
          <Otter className="h-11 w-11 transition-transform group-hover:-translate-y-0.5" />
        </span>
        <span className="text-left">
          <span className="block font-heading text-[15px] font-bold text-charcoal">Ask me anything</span>
          <span className="block text-[11px] text-body">Chat with Steve</span>
        </span>
      </button>
    </div>
  );
}

function Bubble({ role, children }: { role: Message["role"]; children: ReactNode }) {
  const mine = role === "user";
  return (
    <div className={`flex items-end gap-2 ${mine ? "justify-end" : ""}`}>
      {!mine && (
        <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-black/5">
          <Otter className="h-6 w-6" />
        </span>
      )}
      <div
        className={`max-w-[80%] px-3.5 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap ${
          mine ? "rounded-2xl rounded-br-sm bg-site-teal text-white" : "rounded-2xl rounded-bl-sm bg-white text-charcoal shadow-sm"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <span className="flex gap-1 py-1" aria-label="Steve is typing">
      {[0, 150, 300].map((d) => (
        <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-site-teal" style={{ animationDelay: `${d}ms` }} />
      ))}
    </span>
  );
}
