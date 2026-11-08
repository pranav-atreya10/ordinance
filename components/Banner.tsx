import { SITE } from "@/lib/site";

export function Banner() {
  return (
    <div role="note" className="bg-ink text-[12.5px] leading-snug text-paper/80 print:border print:border-black print:bg-white print:text-black">
      <div className="mx-auto flex max-w-6xl items-start gap-2.5 px-4 py-2 sm:items-center sm:justify-center sm:px-6">
        <span className="mt-px shrink-0 rounded-full border border-paper/25 px-2 py-px text-[10.5px] font-medium tracking-wide text-paper uppercase print:border-black print:text-black sm:mt-0">
          Unofficial
        </span>
        <p>{SITE.disclaimer}</p>
      </div>
    </div>
  );
}
