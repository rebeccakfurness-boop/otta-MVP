import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { steveSystemPrompt } from "@/content/steve";
import { offlineAnswer } from "@/lib/steve-offline";

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(1000),
      }),
    )
    .min(1)
    .max(20)
    .refine((m) => m.length > 0 && m[0].role === "user" && m[m.length - 1].role === "user", "Conversation must start and end with the visitor"),
});

// Best-effort per-instance rate limit: 20 messages per IP per 10 minutes.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 20;
}

const textHeaders = { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" };

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (rateLimited(ip)) {
    return new Response("I need a quick rest on a rock. Please try again in a few minutes.", {
      status: 429,
      headers: textHeaders,
    });
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return new Response("Sorry, I couldn't read that message.", { status: 400, headers: textHeaders });
  }
  const { messages } = parsed.data;

  // Without an API key (local development, previews) Steve answers from a
  // simple keyword lookup so the widget still works.
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(offlineAnswer(messages[messages.length - 1].content), { headers: textHeaders });
  }

  const client = new Anthropic();
  const stream = client.beta.messages.stream({
    model: "claude-opus-5-5",
    max_tokens: 2048,
    output_config: { effort: "low" },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [{ type: "text", text: steveSystemPrompt, cache_control: { type: "ephemeral" } }],
    messages,
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode("Sorry, I can't help with that one. For anything else about Otta, just ask!"),
          );
        }
      } catch (error) {
        console.error("Steve chat failed", error);
        controller.enqueue(
          encoder.encode(
            `\n\nSorry, I've drifted off downstream. Please try again, or contact us on 0800 003 545.`,
          ),
        );
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, { headers: textHeaders });
}
