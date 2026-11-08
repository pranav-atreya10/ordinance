import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { CodeSection } from "./sections";

export const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-5-5";
export const aiEnabled = () => Boolean(process.env.ANTHROPIC_API_KEY);

let client: Anthropic | null = null;
const getClient = () => (client ??= new Anthropic());

const ASK_SYSTEM = `You are a helper for residents of Livingston Township, NJ. Answer only using the code sections provided. Cite every rule with its section number. Use plain language a 12-year-old could follow. If the provided sections don't answer the question, say "The rules I have don't clearly cover this" and recommend contacting the Construction Official or Zoning Officer. Never invent rules, fees, or measurements. End with a reminder that this is not official advice.

Extra rules for the JSON you return:
- "section" values must be copied exactly from the SECTION ids given to you. Never cite anything else.
- Every number (feet, inches, percent, days, dollars) must appear in the provided text. If it doesn't, leave it out.
- "mistakes" must come from the rules provided (for example forgetting a setback the text names). If nothing fits, return an empty list.
- Set "covered" to false if the provided text does not clearly answer the question. Then keep "rules" short or empty and set the verdict to "unclear".
- Keep every string short: one or two sentences.`;

const AnswerSchema = z.object({
  covered: z.boolean(),
  verdict: z.enum(["likely_yes", "likely_no", "unclear"]),
  verdict_summary: z.string(),
  rules: z.array(z.object({ rule: z.string(), section: z.string() })),
  what_you_need: z.array(z.string()),
  mistakes: z.array(z.string()),
  contact_office: z.enum(["construction", "zoning", "both"]),
  contact_reason: z.string(),
  reminder: z.string(),
});
export type AiAnswer = z.infer<typeof AnswerSchema>;

const PrecheckSchema = z.object({
  summary: z.string(),
  items: z.array(
    z.object({
      status: z.enum(["ok", "warn", "missing"]),
      title: z.string(),
      detail: z.string(),
      section: z.string(),
    }),
  ),
});
export type AiPrecheck = z.infer<typeof PrecheckSchema>;

function sectionsBlock(sections: CodeSection[]) {
  return sections
    .map((s) => `<code_section id="${s.section}" title="${s.title}">\n${s.text}\n</code_section>`)
    .join("\n\n");
}

export async function askClaude(question: string, zone: string | undefined, sections: CodeSection[]) {
  const res = await getClient().messages.parse({
    model: MODEL,
    max_tokens: 4000,
    system: ASK_SYSTEM,
    output_config: { effort: "low", format: zodOutputFormat(AnswerSchema) },
    messages: [
      {
        role: "user",
        content: `${sectionsBlock(sections)}\n\nSECTION ids you may cite: ${sections.map((s) => s.section).join(", ")}\nProperty zone: ${zone || "not given"}\n\nQuestion: ${question}`,
      },
    ],
  });
  if (res.stop_reason === "refusal" || !res.parsed_output) return null;
  return res.parsed_output;
}

const PRECHECK_SYSTEM = `You check a Livingston Township, NJ resident's project description against the code sections provided. Use only the provided text. Never invent rules, fees, or measurements.
Return a checklist:
- "ok": the project clearly meets a rule. Cite it.
- "warn": the project might break a rule. Explain why in plain words. Cite it.
- "missing": you need a detail the person didn't give (say exactly which detail) to check a rule.
"section" must be copied exactly from the SECTION ids given, or "" if none applies. Plain language a 12-year-old could follow. One or two sentences per item. At most 8 items.`;

export async function precheckClaude(project: string, sections: CodeSection[]) {
  const res = await getClient().messages.parse({
    model: MODEL,
    max_tokens: 4000,
    system: PRECHECK_SYSTEM,
    output_config: { effort: "low", format: zodOutputFormat(PrecheckSchema) },
    messages: [
      {
        role: "user",
        content: `${sectionsBlock(sections)}\n\nSECTION ids you may cite: ${sections.map((s) => s.section).join(", ")}\n\nProject:\n${project}`,
      },
    ],
  });
  if (res.stop_reason === "refusal" || !res.parsed_output) return null;
  return res.parsed_output;
}
