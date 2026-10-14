"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { site } from "@/content/site";
import { chatPersonas, contactTeams, steveGreeting, steveSuggestions } from "@/content/steve-ui";
import { Otter } from "./Otter";

type Message = {
  role: "user" | "assistant";
  content: string;
  /** Part of the built-in contact flow: shown in the chat but not sent to Claude. */
  local?: boolean;
  /** Show the contact team choices under this message. */
  choices?: boolean;
};

// Turn email addresses and site paths (/solutions/landlord-insurance) into links.
function withLinks(text: string): ReactNode[] {
  return text.split(/([\w.+-]+@[\w-]+(?:\.[\w-]+)+|(?<![\w.])\/[a-z0-9][a-z0-9\-/]*[a-z0-9])/gi).map((part, i) => {
    if (i % 2 === 0) return part;
    return part.includes("@") ? (
      <a key={i} href={`mailto:${part}`} className="font-medium break-all text-site-teal underline">
        {part}
      </a>
    ) : (
      <Link key={i} href={part} className="font-medium text-site-teal underline">
        {part}
      </Link>
    );
  });
}

type Persona = "brad" | "steve";

const singleSteve = {
  name: "Steve",
  tagline: "Otta's friendly otter",
  greeting: steveGreeting,
  disclaimer: "Steve is an AI assistant and gives general information only, not advice.",
};

export function SteveChat() {
  const [open, setOpen] = useState(false);
  // While chatPersonas is enabled, the visitor picks Brad or (pub) Steve first.
  const [persona, setPersona] = useState<Persona | null>(chatPersonas.enabled ? null : "steve");
  const drunk = chatPersonas.enabled && persona === "steve";
  const who = !chatPersonas.enabled ? singleSteve : persona ? chatPersonas[persona] : null;
  const lastReply = useRef(-1);
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
    const history: Message[] = [...messages.map((m) => ({ ...m, choices: false })), { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    if (drunk) {
      // Steve is at the pub: a random line (never the same twice in a row), no AI.
      const lines = chatPersonas.steveReplies;
      let pick = Math.floor(Math.random() * lines.length);
      if (pick === lastReply.current) pick = (pick + 1) % lines.length;
      lastReply.current = pick;
      await new Promise((r) => setTimeout(r, 900 + Math.random() * 900));
      setMessages([...history, { role: "assistant", content: lines[pick] }]);
      setBusy(false);
      return;
    }

    try {
      const res = await fetch("/api/steve", {
        method: "POST",
        headers: { "content-type": "application/json" },
        // Keep the last 20 turns so the request stays small.
        body: JSON.stringify({
          messages: history
            .filter((m) => !m.local && m.content)
            .slice(-19)
            .map(({ role, content }) => ({ role, content })),
          persona: chatPersonas.enabled ? persona : undefined,
        }),
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
        {
          role: "assistant",
          content: "Sorry, I've drifted off downstream. Please try again in a moment.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function startNewChat() {
    if (busy) return;
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  }

  function choosePersona(next: Persona | null) {
    if (busy) return;
    setPersona(next);
    setMessages([]);
    setInput("");
  }

  function askContactTopic() {
    if (busy) return;
    setMessages((prev) => [
      ...prev.map((m) => ({ ...m, choices: false })),
      {
        role: "user",
        content: "I'd like to contact an Otta team member",
        local: true,
      },
      {
        role: "assistant",
        content: "Happy to help you reach the right team. What is your query about?",
        local: true,
        choices: true,
      },
    ]);
  }

  function pickContactTeam(index: number) {
    const t = contactTeams[index];
    setMessages((prev) => [
      ...prev.map((m) => ({ ...m, choices: false })),
      { role: "user", content: t.label, local: true },
      {
        role: "assistant",
        content: `Thanks! Please email our ${t.team} at ${t.email} and a team member will get back to you. If it's easier, you can also call us on ${site.phone}.`,
        local: true,
      },
    ]);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <div data-steve className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <section
          role="dialog"
          aria-label={who ? `Chat with ${who.name}` : "Choose who to chat with"}
          className="flex h-[min(560px,calc(100vh-7rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 sm:w-[380px]"
        >
          <header className="flex items-center gap-3 bg-site-teal px-4 py-3 text-white">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white">
              <Otter className="h-9 w-9" />
              {drunk && <BeerBadge />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-heading text-[17px] font-bold">{who?.name ?? "Otta's otters"}</p>
              <p className="truncate text-[12px] text-white/85">{who?.tagline ?? chatPersonas.chooserIntro}</p>
            </div>
            {chatPersonas.enabled && persona && (
              <button
                type="button"
                onClick={() => choosePersona(null)}
                disabled={busy}
                className="rounded px-2 py-1.5 text-[12px] font-medium hover:bg-white/15 disabled:opacity-50"
              >
                Switch
              </button>
            )}
            <button
              type="button"
              onClick={startNewChat}
              disabled={busy || messages.length === 0 || !who}
              className="flex items-center gap-1 rounded px-2 py-1.5 text-[12px] font-medium hover:bg-white/15 disabled:opacity-50 disabled:hover:bg-transparent"
              aria-label="Start new chat"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span className="hidden sm:inline">New chat</span>
            </button>
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

          {!who ? (
            <Chooser onPick={choosePersona} />
          ) : (
            <>
              <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto bg-footer px-4 py-4" aria-live="polite">
                <Bubble role="assistant" drunk={drunk}>
                  {who.greeting}
                </Bubble>
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
                  <div key={i} className="space-y-2">
                    <Bubble role={m.role} drunk={drunk}>
                      {m.content ? withLinks(m.content) : <Typing />}
                    </Bubble>
                    {m.choices && (
                      <div className="flex flex-wrap gap-2 pl-9">
                        {contactTeams.map((t, ti) => (
                          <button
                            key={t.label}
                            type="button"
                            onClick={() => pickContactTeam(ti)}
                            className="rounded-full border border-site-teal bg-white px-3 py-1.5 text-[13px] text-site-teal transition-colors hover:bg-site-teal hover:text-white"
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={onSubmit} className="border-t border-[#eaeaea] bg-white p-3">
                <button
                  type="button"
                  onClick={askContactTopic}
                  disabled={busy}
                  className="mb-2.5 flex w-full items-center justify-center gap-2 border border-site-teal py-2 text-[12px] font-medium tracking-[0.08em] text-site-teal uppercase transition-colors hover:bg-site-teal hover:text-white disabled:opacity-50"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                  </svg>
                  Contact an Otta team member
                </button>
                <div className="flex items-end gap-2">
                  <label htmlFor="steve-input" className="sr-only">
                    Ask {who.name} a question
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
                  {drunk ? (
                    <>
                      {who.disclaimer}{" "}
                      <Link href="/contact" className="underline">
                        contact us
                      </Link>
                      .
                    </>
                  ) : (
                    <>
                      {who.disclaimer} Please don&apos;t share personal details. For cover questions, talk to your broker or{" "}
                      <Link href="/contact" className="underline">
                        contact us
                      </Link>
                      .
                    </>
                  )}
                </p>
              </form>
            </>
          )}
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : chatPersonas.enabled ? "Ask the Otta otters anything" : "Ask Steve the otter anything"}
        className="group flex items-center gap-2 rounded-full bg-white py-1.5 pr-5 pl-1.5 shadow-lg ring-1 ring-black/5 transition-transform hover:-translate-y-0.5"
      >
        <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#e6f4f2]">
          <Otter className="h-11 w-11 transition-transform group-hover:-translate-y-0.5" />
        </span>
        <span className="text-left">
          <span className="block font-heading text-[15px] font-bold text-charcoal">Ask me anything</span>
          <span className="block text-[11px] text-body">{chatPersonas.enabled ? chatPersonas.launcher : "Chat with Steve"}</span>
        </span>
      </button>
    </div>
  );
}

function Chooser({ onPick }: { onPick: (p: Persona) => void }) {
  const options: Persona[] = ["brad", "steve"];
  return (
    <div className="flex flex-1 flex-col justify-center gap-3 overflow-y-auto bg-footer px-4 py-6">
      <p className="text-center text-[14px] text-body">{chatPersonas.chooserIntro}</p>
      {options.map((p) => {
        const info = chatPersonas[p];
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPick(p)}
            className="flex items-center gap-4 rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:ring-site-teal"
          >
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e6f4f2]">
              <Otter className="h-12 w-12" />
              {p === "steve" && <BeerBadge />}
            </span>
            <span className="min-w-0">
              <span className="block font-heading text-[18px] font-bold text-charcoal">Chat with {info.name}</span>
              <span className="block text-[12px] font-medium text-site-teal">{info.tagline}</span>
              <span className="mt-1 block text-[13px] leading-snug text-body">{info.pitch}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function BeerBadge() {
  return (
    <span
      aria-hidden
      className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f5b301] text-[11px] ring-2 ring-white"
    >
      🍺
    </span>
  );
}

function Bubble({ role, drunk, children }: { role: Message["role"]; drunk?: boolean; children: ReactNode }) {
  const mine = role === "user";
  return (
    <div className={`flex items-end gap-2 ${mine ? "justify-end" : ""}`}>
      {!mine && (
        <span
          className={`mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-black/5 ${drunk ? "rotate-12" : ""}`}
        >
          <Otter className="h-6 w-6" />
        </span>
      )}
      <div
        className={`max-w-[80%] px-3.5 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap ${
          mine
            ? "rounded-2xl rounded-br-sm bg-site-teal text-white"
            : "rounded-2xl rounded-bl-sm bg-white text-charcoal shadow-sm"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Typing() {
  return (
    <span className="flex gap-1 py-1" aria-label="Typing">
      {[0, 150, 300].map((d) => (
        <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-site-teal" style={{ animationDelay: `${d}ms` }} />
      ))}
    </span>
  );
}
