import { SITE, ZONES } from "@/lib/site";
import { Map } from "./icons";

export function ZoneSelect({ value, onChange, id = "zone" }: { value: string; onChange: (v: string) => void; id?: string }) {
  return (
    <div>
      <label htmlFor={id} className="text-[13.5px] font-medium text-ink-2">
        Which zone is your property in? <span className="font-normal text-faint">(optional)</span>
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 rounded-xl border border-line-strong bg-surface px-3 pr-8 text-[15px] text-ink outline-none focus:border-forest/60 focus:ring-4 focus:ring-forest/10 sm:w-48"
        >
          <option value="">Not sure</option>
          {ZONES.map((z) => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
        <p className="text-[13px] text-muted">
          Not sure? Leave blank.{" "}
          <a href={SITE.zoningMapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-forest underline-offset-2 hover:underline">
            <Map size={13} /> Zoning map
          </a>
        </p>
      </div>
    </div>
  );
}
