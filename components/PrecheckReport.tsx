import type { PrecheckItem, PrecheckProject, PrecheckResult } from "@/lib/types";
import { Citation } from "./Citation";
import { Alert, CheckCircle, Help, Info } from "./icons";

const STATUS = {
  ok: { label: "Looks OK", icon: CheckCircle, c: "text-forest", bg: "bg-forest-soft", emoji: "✅" },
  warn: { label: "Might be a problem", icon: Alert, c: "text-amber", bg: "bg-amber-soft", emoji: "⚠️" },
  missing: { label: "Needs info", icon: Help, c: "text-sky", bg: "bg-sky-soft", emoji: "❓" },
} as const;

function Item({ item }: { item: PrecheckItem }) {
  const s = STATUS[item.status];
  return (
    <li className="flex gap-3.5 px-5 py-4 break-inside-avoid sm:px-6">
      <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${s.bg} ${s.c}`}>
        <s.icon size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-[15.5px] font-medium text-ink">{item.title}</p>
          <span className={`text-[11.5px] font-medium tracking-wide uppercase ${s.c}`}>
            <span className="hidden print:inline">{s.emoji} </span>
            {s.label}
          </span>
        </div>
        <p className="mt-1 text-[14.5px] leading-relaxed text-muted">
          {item.detail} {item.source && <Citation source={item.source} />}
        </p>
      </div>
    </li>
  );
}

export function ProjectSummary({ project, address }: { project: PrecheckProject; address?: string | null }) {
  const rows = [
    ["Project", project.type],
    ["Zone", project.zone || "Not given"],
    ["Size", project.size || "—"],
    ["Height", project.height ? `${project.height} ft` : "—"],
    ["Front / side / rear", [project.front, project.side, project.rear].map((v) => (v ? `${v} ft` : "—")).join(" · ")],
    ...(address ? [["Address", address]] : []),
  ];
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
      {rows.map(([k, v]) => (
        <div key={k} className="bg-surface px-4 py-3">
          <dt className="text-[11.5px] tracking-wider text-faint uppercase">{k}</dt>
          <dd className="mt-0.5 text-[14.5px] text-ink">{v}</dd>
        </div>
      ))}
      {project.details && (
        <div className="col-span-2 bg-surface px-4 py-3 sm:col-span-3">
          <dt className="text-[11.5px] tracking-wider text-faint uppercase">Details</dt>
          <dd className="mt-0.5 text-[14.5px] leading-relaxed whitespace-pre-wrap text-ink">{project.details}</dd>
        </div>
      )}
    </dl>
  );
}

export function PrecheckReport({ result }: { result: PrecheckResult }) {
  const order = { warn: 0, missing: 1, ok: 2 };
  const items = [...result.items].sort((a, b) => order[a.status] - order[b.status]);
  const count = (s: PrecheckItem["status"]) => result.items.filter((i) => i.status === s).length;

  return (
    <article className="animate-rise overflow-hidden rounded-[24px] border border-line bg-surface shadow-lift print:shadow-none">
      <header className="px-5 pt-5 pb-5 sm:px-6 sm:pt-6">
        <p className="text-[12px] font-medium tracking-wider text-faint uppercase">Pre-check results</p>
        <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{result.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["ok", "warn", "missing"] as const).map((s) => (
            <span key={s} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium ${STATUS[s].bg} ${STATUS[s].c}`}>
              {count(s)} {STATUS[s].label.toLowerCase()}
            </span>
          ))}
        </div>
        {result.mode === "no-ai" && (
          <p className="mt-3 flex items-start gap-2 text-[13px] text-muted">
            <Info size={15} className="mt-0.5 shrink-0" /> Only basic checks ran (AI not available for this project yet).
          </p>
        )}
      </header>
      {items.length > 0 ? (
        <ul className="divide-y divide-line border-t border-line">{items.map((i, n) => <Item key={n} item={i} />)}</ul>
      ) : (
        <p className="border-t border-line px-6 py-5 text-[14.5px] text-muted">No checklist items.</p>
      )}
      {(result.sources.length > 0 || result.notAddedYet.length > 0) && (
        <footer className="space-y-2 border-t border-line bg-paper/50 px-5 py-4 text-[13px] text-muted sm:px-6">
          {result.sources.length > 0 && (
            <p>
              Checked against:{" "}
              {result.sources.map((s, i) => (
                <span key={s.section}>
                  {i > 0 && ", "}
                  <a className="text-forest hover:underline" href={s.url} target="_blank" rel="noreferrer">§ {s.section} {s.title}</a>
                </span>
              ))}
            </p>
          )}
          {result.notAddedYet.length > 0 && (
            <p>Not added to Ordinance yet: {result.notAddedYet.map((s) => `§ ${s.section} ${s.title}`).join(", ")}.</p>
          )}
          <p>Checked {new Date(result.checkedAt).toLocaleDateString("en-US", { dateStyle: "medium" })}. Not official advice — confirm with the township.</p>
        </footer>
      )}
    </article>
  );
}

export function PrintHeader() {
  return (
    <div className="mb-6 hidden border-b border-black pb-3 print:block">
      <p className="text-[20px] font-semibold">Ordinance — Project pre-check</p>
      <p className="text-[11px]">
        Unofficial student project. Not affiliated with Livingston Township. Always confirm with the Construction or Zoning office before you build.
      </p>
    </div>
  );
}
