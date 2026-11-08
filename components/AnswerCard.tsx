import type { Answer } from "@/lib/types";
import { Citation } from "./Citation";
import { Contact } from "./Contact";
import { Feedback } from "./Feedback";
import { Alert, ArrowUpRight, Check, CheckCircle, Clipboard, Doc, Help, Info, List } from "./icons";

const VERDICT = {
  likely_yes: { label: "You likely need a permit", icon: CheckCircle, box: "bg-forest-soft border-forest/15", text: "text-forest-deep", iconC: "text-forest" },
  likely_no: { label: "You probably don't need a permit", icon: CheckCircle, box: "bg-sky-soft border-sky/15", text: "text-sky", iconC: "text-sky" },
  unclear: { label: "Not clear from the rules I have", icon: Help, box: "bg-amber-soft border-amber/15", text: "text-amber", iconC: "text-amber" },
};

function Section({ icon: I, title, children }: { icon: typeof Doc; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line px-5 py-6 sm:px-7">
      <h3 className="flex items-center gap-2 text-[12px] font-medium tracking-wider text-faint uppercase">
        <I size={15} className="text-muted" /> {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function AnswerCard({ answer, question }: { answer: Answer; question: string }) {
  const v = VERDICT[answer.verdict];
  return (
    <article className="animate-rise overflow-hidden rounded-[24px] border border-line bg-surface shadow-lift">
      <header className="px-5 pt-5 pb-6 sm:px-7 sm:pt-6">
        <p className="text-[13px] text-muted">
          You asked: <span className="text-ink-2">“{question}”</span>
        </p>
        <div className={`mt-4 flex items-start gap-3.5 rounded-2xl border p-4 sm:p-5 ${v.box}`}>
          <v.icon size={24} className={`mt-0.5 shrink-0 ${v.iconC}`} />
          <div>
            <p className="text-[12px] font-medium tracking-wider text-muted uppercase">Do I need a permit?</p>
            <h2 className={`mt-1 font-serif text-[26px] leading-tight sm:text-[30px] ${v.text}`}>{v.label}</h2>
            <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">{answer.verdictSummary}</p>
          </div>
        </div>
        {answer.mode === "no-ai" && (
          <p className="mt-3 flex items-start gap-2 text-[13.5px] text-muted">
            <Info size={16} className="mt-0.5 shrink-0" /> Demo mode: the AI key isn&apos;t set up yet, so this shows matching sections only.
          </p>
        )}
      </header>

      {answer.rules.length > 0 && (
        <Section icon={List} title="Rules that apply">
          <ol className="space-y-3.5">
            {answer.rules.map((r, i) => (
              <li key={i} className="flex gap-3.5">
                <span className="mt-0.5 font-mono text-[12px] text-faint">{String(i + 1).padStart(2, "0")}</span>
                <p className="flex-1 text-[15.5px] leading-relaxed text-ink">
                  {r.rule} <Citation source={r.source} />
                </p>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {answer.whatYouNeed.length > 0 && (
        <Section icon={Clipboard} title="What you'll need">
          <ul className="space-y-2.5">
            {answer.whatYouNeed.map((t, i) => (
              <li key={i} className="flex gap-3 text-[15.5px] leading-relaxed">
                <span className="mt-1 grid size-[18px] shrink-0 place-items-center rounded-[5px] border border-line-strong">
                  <Check size={12} className="text-forest" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {answer.mistakes.length > 0 && (
        <Section icon={Alert} title="Common mistakes">
          <ul className="space-y-2.5">
            {answer.mistakes.map((t, i) => (
              <li key={i} className="flex gap-3 text-[15.5px] leading-relaxed">
                <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-amber" />
                {t}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section icon={Help} title="Who to contact">
        {answer.contact.reason && <p className="mb-4 text-[15px] leading-relaxed text-ink-2">{answer.contact.reason}</p>}
        <Contact office={answer.contact.office} />
      </Section>

      {(answer.sources.length > 0 || answer.notAddedYet.length > 0) && (
        <Section icon={Doc} title="Sources">
          {answer.sources.length > 0 && (
            <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
              {answer.sources.map((s) => (
                <li key={s.section}>
                  <a href={s.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-paper/70">
                    <span className="min-w-0">
                      <span className="font-mono text-[12.5px] text-forest">§ {s.section}</span>{" "}
                      <span className="text-[15px] text-ink">{s.title}</span>
                      {s.lastChecked && !s.lastChecked.startsWith("YYYY") && (
                        <span className="block text-[12px] text-faint">Copied from eCode360 · checked {s.lastChecked}</span>
                      )}
                    </span>
                    <ArrowUpRight size={16} className="shrink-0 text-faint transition group-hover:text-forest" />
                  </a>
                </li>
              ))}
            </ul>
          )}
          {answer.notAddedYet.length > 0 && (
            <p className="mt-3 rounded-xl bg-paper-2/70 px-4 py-3 text-[13.5px] leading-relaxed text-muted">
              Related sections not added to Ordinance yet:{" "}
              {answer.notAddedYet.map((s) => `§ ${s.section} ${s.title}`).join(", ")}.
            </p>
          )}
        </Section>
      )}

      <footer className="flex flex-col gap-4 border-t border-line bg-paper/50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <p className="max-w-md text-[13px] leading-relaxed text-muted">{answer.reminder}</p>
        <Feedback questionId={answer.questionId} />
      </footer>
    </article>
  );
}

export function AnswerSkeleton() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-line bg-surface p-5 shadow-card sm:p-7" aria-busy="true" aria-live="polite">
      <p className="sr-only">Reading the Livingston code…</p>
      <div className="skeleton h-3 w-48 rounded-full" />
      <div className="mt-5 rounded-2xl bg-paper/70 p-5">
        <div className="skeleton h-3 w-28 rounded-full" />
        <div className="skeleton mt-3 h-6 w-64 rounded-full" />
        <div className="skeleton mt-4 h-3 w-full rounded-full" />
        <div className="skeleton mt-2 h-3 w-4/5 rounded-full" />
      </div>
      {[0, 1].map((i) => (
        <div key={i} className="mt-7 space-y-3">
          <div className="skeleton h-3 w-32 rounded-full" />
          <div className="skeleton h-3 w-full rounded-full" />
          <div className="skeleton h-3 w-11/12 rounded-full" />
          <div className="skeleton h-3 w-3/4 rounded-full" />
        </div>
      ))}
      <p className="mt-7 flex items-center gap-2 text-[13.5px] text-muted">
        <span className="size-2 animate-pulse rounded-full bg-moss" /> Reading the Livingston code…
      </p>
    </div>
  );
}
