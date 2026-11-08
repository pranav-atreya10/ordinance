import { SITE } from "@/lib/site";
import { ArrowUpRight, Building } from "./icons";

const OFFICES = {
  construction: { name: "Construction Official", what: "Building permits, inspections, certificates of occupancy" },
  zoning: { name: "Zoning Officer", what: "Where things can go: setbacks, heights, uses, signs" },
};

export function Contact({ office }: { office: "construction" | "zoning" | "both" }) {
  const list = office === "both" ? (["zoning", "construction"] as const) : ([office] as const);
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {list.map((k) => (
        <a
          key={k}
          href={SITE.townshipUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex items-start gap-3 rounded-2xl border border-line bg-paper/60 p-4 transition hover:border-line-strong hover:bg-surface"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface text-forest shadow-card">
            <Building size={17} />
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-1 text-[14.5px] font-medium text-ink">
              {OFFICES[k].name}
              <ArrowUpRight size={14} className="text-faint transition group-hover:text-forest" />
            </span>
            <span className="mt-0.5 block text-[13px] leading-snug text-muted">{OFFICES[k].what}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
