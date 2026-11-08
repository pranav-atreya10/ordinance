import fs from "node:fs";
import path from "node:path";

export type CodeSection = {
  file: string;
  section: string;
  title: string;
  url: string;
  lastChecked: string;
  keywords: string[];
  text: string;
  isPlaceholder: boolean;
};

const DIR = path.join(process.cwd(), "data", "code-sections");
let cache: CodeSection[] | null = null;

function parse(file: string, raw: string): CodeSection | null {
  const split = raw.indexOf("\n---");
  if (split === -1) return null;
  const header = raw.slice(0, split);
  const text = raw.slice(split + 4).trim();
  const meta: Record<string, string> = {};
  for (const line of header.split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
  }
  if (!meta.section || !meta.title) return null;
  return {
    file,
    section: meta.section,
    title: meta.title,
    url: meta.url || "https://ecode360.com/LI1238",
    lastChecked: meta.last_checked || "",
    keywords: (meta.keywords || "")
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean),
    text,
    isPlaceholder: !text || text.startsWith("PASTE THE REAL TEXT HERE"),
  };
}

export function loadSections(): CodeSection[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith(".txt")) : [];
  cache = files
    .map((f) => parse(f, fs.readFileSync(path.join(DIR, f), "utf8").replace(/\r\n/g, "\n")))
    .filter((s): s is CodeSection => s !== null)
    .sort((a, b) => a.section.localeCompare(b.section, undefined, { numeric: true }));
  return cache;
}

export function sectionLabel(s: Pick<CodeSection, "section" | "title">) {
  return `§ ${s.section} ${s.title}`;
}
