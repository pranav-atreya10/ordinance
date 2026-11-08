import type { SourceRef } from "@/lib/types";

export function Citation({ source }: { source: SourceRef }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noreferrer"
      title={`Open § ${source.section} ${source.title} on eCode360`}
      className="inline-flex shrink-0 items-center gap-1 rounded-md border border-forest/20 bg-forest-soft/60 px-1.5 py-0.5 font-mono text-[11.5px] whitespace-nowrap text-forest transition hover:border-forest/40 hover:bg-forest-soft"
    >
      § {source.section}
    </a>
  );
}
