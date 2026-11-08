import { askClaude, aiEnabled } from "./ai";
import { safe } from "./db";
import { findRelevant } from "./search";
import { loadSections, type CodeSection } from "./sections";
import type { Answer, SourceRef } from "./types";

export const NOT_COVERED = "The rules I have don't clearly cover this.";
export const REMINDER = "This is not official advice. Always confirm with Livingston's Construction or Zoning office before you build.";

export const toRef = (s: CodeSection): SourceRef => ({
  section: s.section,
  title: s.title,
  url: s.url,
  lastChecked: s.lastChecked,
});

async function log(question: string, zone: string | undefined, sections: string[], covered: boolean) {
  return safe(async (sql) => {
    const [row] = await sql`
      insert into questions (question, zone, sections, covered)
      values (${question}, ${zone ?? null}, ${sections}, ${covered})
      returning id`;
    return Number(row.id);
  }, null);
}

function base(partial: Partial<Answer>): Answer {
  return {
    questionId: null,
    mode: "not-covered",
    covered: false,
    verdict: "unclear",
    verdictSummary: `${NOT_COVERED} Please contact the Construction Official or Zoning Officer.`,
    rules: [],
    whatYouNeed: [],
    mistakes: [],
    contact: { office: "both", reason: "They can tell you exactly which rules apply to your property." },
    reminder: REMINDER,
    sources: [],
    notAddedYet: [],
    ...partial,
  };
}

export async function answerQuestion(
  question: string,
  zone: string | undefined,
  beforeAi: () => Promise<{ ok: true } | { ok: false; reason: string }>,
): Promise<Answer | { error: string }> {
  const matched = findRelevant(question, loadSections(), zone);
  const filled = matched.filter((s) => !s.isPlaceholder);
  const notAddedYet = matched.filter((s) => s.isPlaceholder).map((s) => ({ section: s.section, title: s.title }));

  if (filled.length === 0) {
    const questionId = await log(question, zone, [], false);
    return base({ questionId, notAddedYet });
  }

  if (!aiEnabled()) {
    const questionId = await log(question, zone, filled.map((s) => s.section), false);
    return base({
      questionId,
      mode: "no-ai",
      verdictSummary: "The AI isn't switched on yet, so here are the code sections that look related. Read them, then confirm with the township.",
      sources: filled.map(toRef),
      notAddedYet,
    });
  }

  const gate = await beforeAi();
  if (!gate.ok) return { error: gate.reason };

  const ai = await askClaude(question, zone, filled);
  if (!ai) return { error: "Sorry, I couldn't answer that one. Try rewording it." };

  // Safety net: drop any citation that isn't one of the sections we actually sent.
  const bySection = new Map(filled.map((s) => [s.section, s]));
  const rules = ai.rules
    .filter((r) => bySection.has(r.section.replace(/^§\s*/, "").trim()))
    .map((r) => ({ rule: r.rule, source: toRef(bySection.get(r.section.replace(/^§\s*/, "").trim())!) }));
  const covered = ai.covered && rules.length > 0;
  const cited = [...new Set(rules.map((r) => r.source.section))];
  const sources = (cited.length ? cited.map((c) => bySection.get(c)!) : filled).map(toRef);

  const questionId = await log(question, zone, cited, covered);
  return {
    questionId,
    mode: "ai",
    covered,
    verdict: covered ? ai.verdict : "unclear",
    verdictSummary: covered ? ai.verdict_summary : `${NOT_COVERED} Please contact the Construction Official or Zoning Officer.`,
    rules,
    whatYouNeed: covered ? ai.what_you_need : [],
    mistakes: covered ? ai.mistakes : [],
    contact: { office: ai.contact_office, reason: ai.contact_reason },
    reminder: REMINDER,
    sources,
    notAddedYet,
  };
}
