import { products } from "@/content/products";
import { site } from "@/content/site";

// Fallback answers used when no ANTHROPIC_API_KEY is configured.
export function offlineAnswer(question: string): string {
  const q = question.toLowerCase();
  const product = products.find((p) =>
    [p.name, p.shortName, p.slug.replace(/-/g, " ")].some((n) =>
      n
        .toLowerCase()
        .replace(" insurance", "")
        .split(" ")
        .filter((w) => w.length > 4)
        .some((w) => q.includes(w)),
    ),
  );

  if (/claim/.test(q)) {
    const travel = products.find((p) => p.claim.emergencyPhone);
    return `For non-emergency claims, contact your broker or email ${site.claimsEmail}. Claim forms are on our Claims page at /claims. ${
      travel ? `For a Corporate Travel emergency, call ${travel.claim.emergencyPhone}.` : ""
    }`.trim();
  }
  if (product) {
    return `${product.overview} You can read more at /solutions/${product.slug}, or talk to your broker about whether it suits you.`;
  }
  if (/contact|phone|email|call|address/.test(q)) {
    return `You can call us on ${site.phone}, email ${site.email}, or use the form at /contact.`;
  }
  if (/offer|product|insurance|cover/.test(q)) {
    return `Otta offers ${products.map((p) => p.name).join(", ")}. All are backed by Lloyd's of London. Which one would you like to know more about?`;
  }
  return `I'm still learning to swim through that one! You can see all our products at /solutions, or get in touch on ${site.phone}.`;
}
