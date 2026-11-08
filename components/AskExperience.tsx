"use client";

import { useEffect, useRef, useState } from "react";
import { EXAMPLES } from "@/lib/site";
import type { Answer } from "@/lib/types";
import { AnswerCard, AnswerSkeleton } from "./AnswerCard";
import { Alert, ArrowRight } from "./icons";
import { ZoneSelect } from "./ZoneSelect";

export function AskExperience({ initialQuery = "" }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const [zone, setZone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ answer: Answer; question: string } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  async function ask(question: string, z = zone) {
    if (question.trim().length < 3 || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: question.trim(), zone: z || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setResult({ answer: data, question: question.trim() });
      const url = new URL(window.location.href);
      url.searchParams.set("q", question.trim());
      window.history.replaceState(null, "", url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialQuery && !started.current) {
      started.current = true;
      ask(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(q);
        }}
        className="rounded-[24px] border border-line bg-surface p-4 shadow-card sm:p-6"
      >
        <label htmlFor="q" className="sr-only">What do you want to build or do?</label>
        <textarea
          id="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              ask(q);
            }
          }}
          rows={3}
          maxLength={500}
          placeholder="What do you want to build or do? For example: “put up a 6-foot fence” or “open a bakery on Northfield Ave”"
          className="w-full resize-none rounded-2xl border border-line-strong bg-paper/40 px-4 py-3.5 text-[17px] leading-relaxed text-ink outline-none placeholder:text-faint focus:border-forest/60 focus:bg-surface focus:ring-4 focus:ring-forest/10"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => {
                setQ(ex.q);
                ask(ex.q);
              }}
              className="rounded-full border border-line bg-paper/60 px-3 py-1.5 text-[13.5px] text-ink-2 transition hover:-translate-y-px hover:border-line-strong hover:bg-surface"
            >
              {ex.label}
            </button>
          ))}
        </div>
        <div className="mt-5 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-end sm:justify-between">
          <ZoneSelect value={zone} onChange={setZone} />
          <button
            type="submit"
            disabled={loading || q.trim().length < 3}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-forest px-6 text-[15.5px] font-medium text-paper transition hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Reading the code…" : "Get my answer"} {!loading && <ArrowRight size={17} />}
          </button>
        </div>
      </form>

      <div ref={resultRef} className="scroll-mt-24">
        {loading && <AnswerSkeleton />}
        {error && (
          <div role="alert" className="animate-rise flex items-start gap-3 rounded-2xl border border-rose/20 bg-rose-soft p-4 text-[15px] text-rose">
            <Alert size={19} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}
        {result && <AnswerCard answer={result.answer} question={result.question} />}
      </div>
    </div>
  );
}
