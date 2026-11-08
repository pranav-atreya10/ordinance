"use client";

import { useRef, useState } from "react";
import { PROJECT_TYPES } from "@/lib/precheck-types";
import type { PrecheckProject, PrecheckResult } from "@/lib/types";
import { AnswerSkeleton } from "./AnswerCard";
import { Alert, ArrowRight, Check, LinkIcon, Printer } from "./icons";
import { PrecheckReport, PrintHeader, ProjectSummary } from "./PrecheckReport";
import { ZoneSelect } from "./ZoneSelect";

const EMPTY: PrecheckProject = { type: "", zone: "", size: "", height: "", front: "", side: "", rear: "", details: "" };

function Field({ label, id, suffix, ...props }: { label: string; id: string; suffix?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="text-[13.5px] font-medium text-ink-2">{label}</label>
      <div className="relative mt-2">
        <input
          id={id}
          {...props}
          className="h-11 w-full rounded-xl border border-line-strong bg-surface px-3 text-[15px] text-ink outline-none placeholder:text-faint focus:border-forest/60 focus:ring-4 focus:ring-forest/10"
        />
        {suffix && <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[13px] text-faint">{suffix}</span>}
      </div>
    </div>
  );
}

export function PrecheckExperience() {
  const [p, setP] = useState<PrecheckProject>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PrecheckResult | null>(null);
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const set = (k: keyof PrecheckProject) => (e: { target: { value: string } }) => setP((s) => ({ ...s, [k]: e.target.value }));

  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!p.type) return setError("Pick what kind of project it is first.");
    setLoading(true);
    setError(null);
    setResult(null);
    setShareUrl(null);
    requestAnimationFrame(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    try {
      const res = await fetch("/api/precheck", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(p) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!result) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/precheck/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ project: p, result, address: address.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't save.");
      setShareUrl(`${window.location.origin}/precheck/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={run} className="space-y-7 rounded-[24px] border border-line bg-surface p-5 shadow-card sm:p-7 print:hidden">
        <fieldset>
          <legend className="text-[13.5px] font-medium text-ink-2">What kind of project?</legend>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {PROJECT_TYPES.map((t) => {
              const on = p.type === t;
              return (
                <label
                  key={t}
                  className={`relative flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-center text-[14px] transition ${
                    on ? "border-forest bg-forest-soft font-medium text-forest-deep" : "border-line bg-paper/50 text-ink-2 hover:border-line-strong hover:bg-surface"
                  }`}
                >
                  <input type="radio" name="type" value={t} checked={on} onChange={set("type")} className="sr-only" />
                  {on && <Check size={14} className="mr-1.5" />}
                  {t}
                </label>
              );
            })}
          </div>
        </fieldset>

        <ZoneSelect id="pc-zone" value={p.zone} onChange={(v) => setP((s) => ({ ...s, zone: v }))} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="size" label="Size" placeholder="e.g. 10 × 12 ft" value={p.size} onChange={set("size")} maxLength={60} />
          <Field id="height" label="Height" placeholder="e.g. 6" suffix="ft" inputMode="decimal" value={p.height} onChange={set("height")} maxLength={60} />
        </div>

        <div>
          <p className="text-[13.5px] font-medium text-ink-2">Distance from your property lines</p>
          <div className="mt-2 grid grid-cols-3 gap-3">
            <Field id="front" label="Front" placeholder="—" suffix="ft" inputMode="decimal" value={p.front} onChange={set("front")} maxLength={60} />
            <Field id="side" label="Side" placeholder="—" suffix="ft" inputMode="decimal" value={p.side} onChange={set("side")} maxLength={60} />
            <Field id="rear" label="Rear" placeholder="—" suffix="ft" inputMode="decimal" value={p.rear} onChange={set("rear")} maxLength={60} />
          </div>
        </div>

        <div>
          <label htmlFor="details" className="text-[13.5px] font-medium text-ink-2">Anything else?</label>
          <textarea
            id="details"
            rows={3}
            maxLength={1000}
            value={p.details}
            onChange={set("details")}
            placeholder="Materials, where it goes on the lot, if it's for a business, corner lot, etc."
            className="mt-2 w-full resize-none rounded-xl border border-line-strong bg-surface px-3 py-2.5 text-[15px] leading-relaxed text-ink outline-none placeholder:text-faint focus:border-forest/60 focus:ring-4 focus:ring-forest/10"
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-muted">We don&apos;t save anything unless you click “Save &amp; share” later.</p>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-forest px-6 text-[15.5px] font-medium text-paper transition hover:bg-forest-deep disabled:opacity-50"
          >
            {loading ? "Checking…" : "Check my project"} {!loading && <ArrowRight size={17} />}
          </button>
        </div>
      </form>

      <div ref={ref} className="scroll-mt-24 space-y-5">
        {loading && <AnswerSkeleton />}
        {error && (
          <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose/20 bg-rose-soft p-4 text-[15px] text-rose print:hidden">
            <Alert size={19} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}
        {result && (
          <>
            <PrintHeader />
            <div className="hidden print:block">
              <ProjectSummary project={p} />
              <div className="h-5" />
            </div>
            <PrecheckReport result={result} />
            <div className="rounded-[24px] border border-line bg-surface p-5 shadow-card sm:p-6 print:hidden">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[15px] font-medium text-ink">Bring this to the township office</p>
                  <p className="text-[13.5px] text-muted">Download a PDF (choose “Save as PDF” in the print window), or save a link to share.</p>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface px-4 text-[14.5px] font-medium text-ink transition hover:bg-paper"
                >
                  <Printer size={16} /> Download as PDF
                </button>
              </div>
              <div className="mt-5 border-t border-line pt-5">
                {shareUrl ? (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input readOnly value={shareUrl} className="h-11 flex-1 rounded-xl border border-line bg-paper/60 px-3 font-mono text-[13px] text-ink-2" onFocus={(e) => e.target.select()} />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1800);
                      }}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-ink px-4 text-[14.5px] font-medium text-paper"
                    >
                      {copied ? <Check size={16} /> : <LinkIcon size={16} />} {copied ? "Copied" : "Copy link"}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <Field id="address" label="Property address (optional — only saved if you add it)" placeholder="e.g. 123 Example Rd" value={address} onChange={(e) => setAddress(e.target.value)} maxLength={200} />
                    </div>
                    <button
                      type="button"
                      onClick={save}
                      disabled={saving}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-ink px-4 text-[14.5px] font-medium text-paper transition hover:bg-ink-2 disabled:opacity-50"
                    >
                      <LinkIcon size={16} /> {saving ? "Saving…" : "Save & share"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
