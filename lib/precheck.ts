import { aiEnabled, precheckClaude } from "./ai";
import { toRef } from "./answer";
import { findRelevant } from "./search";
import { loadSections } from "./sections";
import type { PrecheckItem, PrecheckProject, PrecheckResult } from "./types";

export { PROJECT_TYPES } from "./precheck-types";

const NEEDS_SETBACKS = new Set(["Deck", "Shed", "Pool", "Addition", "Solar panels"]);
const NEEDS_HEIGHT = new Set(["Fence", "Shed", "Addition", "Business sign", "Deck"]);

export function describe(p: PrecheckProject) {
  return [
    `Project type: ${p.type}`,
    `Zone: ${p.zone || "not given"}`,
    `Size: ${p.size || "not given"}`,
    `Height: ${p.height ? `${p.height} ft` : "not given"}`,
    `Distance from front property line: ${p.front ? `${p.front} ft` : "not given"}`,
    `Distance from side property line: ${p.side ? `${p.side} ft` : "not given"}`,
    `Distance from rear property line: ${p.rear ? `${p.rear} ft` : "not given"}`,
    `Other details: ${p.details || "none"}`,
  ].join("\n");
}

function basicMissing(p: PrecheckProject): PrecheckItem[] {
  const out: PrecheckItem[] = [];
  const m = (title: string, detail: string) => out.push({ status: "missing", title, detail, source: null });
  if (!p.zone) m("Your zone", "Rules change by zone. Find yours on the township zoning map and add it.");
  if (NEEDS_HEIGHT.has(p.type) && !p.height) m("Height", `Add how tall the ${p.type.toLowerCase()} will be, in feet.`);
  if (NEEDS_SETBACKS.has(p.type) && !(p.side && p.rear))
    m("Distance from property lines", "Add how far it will be from your side and rear property lines.");
  if (!p.size && p.type !== "Fence") m("Size", "Add the size (for example 10 × 12 ft).");
  return out;
}

export async function runPrecheck(p: PrecheckProject, beforeAi: () => Promise<{ ok: true } | { ok: false; reason: string }>): Promise<PrecheckResult | { error: string }> {
  const text = `${p.type} ${p.details}`;
  const matched = findRelevant(text, loadSections(), p.zone || undefined, 4);
  const filled = matched.filter((s) => !s.isPlaceholder);
  const notAddedYet = matched.filter((s) => s.isPlaceholder).map((s) => ({ section: s.section, title: s.title }));
  const missing = basicMissing(p);
  const checkedAt = new Date().toISOString();

  if (filled.length === 0 || !aiEnabled()) {
    return {
      mode: "no-ai",
      summary:
        filled.length === 0
          ? "The rules I have don't clearly cover this project yet, so I can't check it. Please contact the Construction Official or Zoning Officer."
          : "The AI isn't switched on yet. Here's what's missing and which sections to read.",
      items: missing,
      sources: filled.map(toRef),
      notAddedYet,
      checkedAt,
    };
  }

  const gate = await beforeAi();
  if (!gate.ok) return { error: gate.reason };

  const ai = await precheckClaude(describe(p), filled);
  if (!ai) return { error: "Sorry, I couldn't check that one. Try adding more detail." };

  const bySection = new Map(filled.map((s) => [s.section, s]));
  const items: PrecheckItem[] = ai.items.map((i) => {
    const s = bySection.get(i.section.replace(/^§\s*/, "").trim());
    // An "OK" without a real citation isn't trustworthy, so downgrade it.
    const status = i.status === "ok" && !s ? "warn" : i.status;
    return { status, title: i.title, detail: i.detail, source: s ? toRef(s) : null };
  });
  const titles = new Set(items.filter((i) => i.status === "missing").map((i) => i.title.toLowerCase()));
  for (const m of missing) if (!titles.has(m.title.toLowerCase())) items.push(m);

  return { mode: "ai", summary: ai.summary, items, sources: filled.map(toRef), notAddedYet, checkedAt };
}
