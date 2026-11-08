// Phase 6 check. Start the app first (npm run dev), then: npm run test:answers
// Uses real AI calls (about 25), so it costs a few cents.
import fs from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const qs = JSON.parse(fs.readFileSync(new URL("../tests/questions.json", import.meta.url), "utf8"));

// Which sections have real pasted text?
const dir = new URL("../data/code-sections/", import.meta.url);
const pasted = new Set(
  fs.readdirSync(dir).filter((f) => f.endsWith(".txt")).map((f) => fs.readFileSync(new URL(f, dir), "utf8"))
    .filter((t) => !t.split("\n---")[1]?.trim().startsWith("PASTE THE REAL TEXT HERE"))
    .map((t) => t.match(/^section:\s*(.+)$/m)?.[1].trim()),
);
console.log(`Sections with real text: ${[...pasted].join(", ") || "none yet!"}\n`);

async function ask(question) {
  const r = await fetch(`${BASE}/api/ask`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question }) });
  return r.json();
}

let fails = 0;
for (const q of qs.shouldCite) {
  const a = await ask(q);
  const cited = (a.rules || []).map((r) => r.source.section);
  const bad = cited.filter((s) => !pasted.has(s));
  const ok = !a.error && bad.length === 0;
  if (!ok) fails++;
  console.log(`${ok ? "✅" : "❌"} ${q}\n   ${a.error ?? `covered=${a.covered} cites: ${cited.join(", ") || "(none)"}${bad.length ? `  BAD: ${bad}` : ""}`}`);
}
console.log("\n--- Should say it doesn't know ---");
for (const q of qs.shouldNotKnow) {
  const a = await ask(q);
  const ok = !a.error && a.covered === false;
  if (!ok) fails++;
  console.log(`${ok ? "✅" : "❌"} ${q}\n   ${a.error ?? `covered=${a.covered}`}`);
}
console.log(`\n${fails === 0 ? "All good!" : `${fails} problem(s) to look at.`}`);
