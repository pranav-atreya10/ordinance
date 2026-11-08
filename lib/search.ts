import type { CodeSection } from "./sections";

const STOP = new Set(
  "i a an the to of in on for my and or is it be can do want put up add how what need does with at by from this that about".split(" "),
);

function tokens(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9.\- ]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^[.\-]+|[.\-]+$/g, ""))
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map((t) => (t.length > 4 && t.endsWith("s") ? t.slice(0, -1) : t));
}

/** Simple keyword matching. Returns the best sections, most relevant first. */
export function findRelevant(question: string, sections: CodeSection[], zone?: string, limit = 4) {
  const q = tokens(question);
  const qText = ` ${question.toLowerCase()} `;
  const scored = sections.map((s) => {
    let score = 0;
    for (const kw of s.keywords) {
      if (kw.includes(" ") ? qText.includes(` ${kw} `) || qText.includes(kw) : q.includes(kw.replace(/s$/, "")) || q.includes(kw)) {
        score += kw.includes(" ") ? 6 : 4;
      }
    }
    const titleTokens = tokens(s.title);
    for (const t of q) if (titleTokens.includes(t)) score += 5;
    if (!s.isPlaceholder) {
      const body = s.text.toLowerCase();
      for (const t of new Set(q)) if (body.includes(t)) score += 1;
    }
    if (zone && (s.keywords.includes(zone.toLowerCase()) || s.text.includes(zone))) score += 2;
    return { s, score };
  });
  return scored
    .filter((x) => x.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.s);
}
