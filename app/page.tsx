import Link from "next/link";
import { AnswerPreview } from "@/components/AnswerPreview";
import { HeroAsk } from "@/components/HeroAsk";
import { ArrowRight, Building, Check, Clipboard, Doc, Search, Shield, Sparkle } from "@/components/icons";

const problems = [
  {
    n: "01",
    title: "Permits are confusing",
    body: "The rules live in a long legal code. Most people don't know which section applies to a fence, a shed, or a shop sign — or if they need a permit at all.",
  },
  {
    n: "02",
    title: "Staff answer the same questions",
    body: "Construction and zoning staff spend time explaining the same basics again and again, and get applications that need to be sent back.",
  },
  {
    n: "03",
    title: "Ordinance helps both",
    body: "Residents get a plain-English starting point with the exact sections linked. Staff get better-prepared applicants and data on what's confusing.",
  },
];

const steps = [
  { icon: Search, title: "Ask in your own words", body: "“Can I put a shed in my backyard?” Add your zone if you know it." },
  { icon: Doc, title: "We find the exact sections", body: "Ordinance matches your question to Livingston code sections pasted in by hand." },
  { icon: Sparkle, title: "Get a plain-English answer", body: "Every rule is cited and linked. If the rules don't cover it, we say so." },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="paper-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto max-w-4xl px-4 pt-16 pb-14 text-center sm:px-6 sm:pt-24">
          <p className="animate-rise mx-auto inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1 text-[12.5px] text-muted backdrop-blur">
            <span className="size-1.5 rounded-full bg-moss" />
            For Livingston, NJ residents & small businesses
          </p>
          <h1 className="animate-rise mt-6 font-serif text-[48px] leading-[0.95] tracking-[-0.025em] text-ink [animation-delay:60ms] sm:text-[72px] md:text-[88px]">
            Know the rules <br className="hidden sm:block" />
            <em className="text-forest">before</em> you build.
          </h1>
          <p className="animate-rise mx-auto mt-6 max-w-xl text-[16.5px] leading-relaxed text-muted [animation-delay:120ms] sm:text-[18px]">
            Tell Ordinance what you want to do. It reads Livingston&apos;s township code and explains — in plain English — whether you
            likely need a permit and which rules apply, with a link to every section.
          </p>
          <div className="animate-rise mx-auto mt-9 max-w-2xl [animation-delay:180ms]">
            <HeroAsk />
          </div>
          <ul className="animate-rise mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13.5px] text-muted [animation-delay:240ms]">
            {["Cites every rule", "Says “I don't know” when unsure", "Free · no sign-up"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check size={15} className="text-forest" /> {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="px-4 pb-20 sm:px-6">
          <AnswerPreview />
        </div>
      </section>

      {/* Problem */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <p className="text-[12.5px] font-medium tracking-wider text-forest uppercase">Why this exists</p>
          <h2 className="mt-3 max-w-2xl font-serif text-[38px] leading-[1.02] tracking-[-0.02em] sm:text-[52px]">
            Permits shouldn&apos;t need a law degree.
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[22px] border border-line bg-line md:grid-cols-3">
            {problems.map((p) => (
              <div key={p.n} className="bg-surface p-7 sm:p-8">
                <span className="font-mono text-[12px] text-faint">{p.n}</span>
                <h3 className="mt-6 font-serif text-[26px] leading-tight">{p.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[12.5px] font-medium tracking-wider text-forest uppercase">How it works</p>
            <h2 className="mt-3 font-serif text-[38px] leading-[1.02] tracking-[-0.02em] sm:text-[52px]">Three steps. No jargon.</h2>
          </div>
          <Link href="/precheck" className="inline-flex items-center gap-1.5 text-[15px] font-medium text-forest hover:underline">
            Already have a plan? Pre-check it <ArrowRight size={16} />
          </Link>
        </div>
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-[22px] border border-line bg-surface p-7 shadow-card">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-forest-soft text-forest">
                  <s.icon size={20} />
                </span>
                <span className="font-serif text-[44px] leading-none text-line-strong">{i + 1}</span>
              </div>
              <h3 className="mt-6 text-[17px] font-semibold tracking-[-0.01em]">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Honest limits */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 rounded-[28px] border border-line bg-paper-2/60 p-7 sm:p-10 md:grid-cols-2 md:p-14">
          <div>
            <p className="text-[12.5px] font-medium tracking-wider text-forest uppercase">About</p>
            <h2 className="mt-3 font-serif text-[34px] leading-[1.05] tracking-[-0.02em] sm:text-[44px]">Built by a Livingston student. Honest about its limits.</h2>
            <p className="mt-5 text-[15.5px] leading-relaxed text-muted">
              Ordinance is a portfolio project, not a township website. It only knows the code sections that were copied in by hand,
              and it&apos;s designed to say “I don&apos;t know” instead of guessing.
            </p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-forest hover:underline">
              How it works & its limits <ArrowRight size={16} />
            </Link>
          </div>
          <ul className="space-y-3 self-center">
            {[
              { icon: Shield, t: "Never invents rules, fees, or measurements" },
              { icon: Doc, t: "Every rule links to the section on eCode360" },
              { icon: Building, t: "Always points you to the Construction or Zoning office" },
              { icon: Clipboard, t: "Doesn't store your address unless you choose to save" },
            ].map(({ icon: I, t }) => (
              <li key={t} className="flex items-center gap-3.5 rounded-2xl border border-line bg-surface px-4 py-3.5 text-[15px] shadow-card">
                <I size={19} className="shrink-0 text-forest" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Staff CTA */}
      <section className="mx-auto mt-6 max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[28px] bg-forest px-7 py-12 text-paper sm:px-14 sm:py-16">
          <div className="pointer-events-none absolute -top-24 -right-16 font-serif text-[320px] leading-none text-paper/[0.06] select-none">§</div>
          <p className="text-[12.5px] font-medium tracking-wider text-paper/60 uppercase">For township staff</p>
          <h2 className="mt-3 max-w-xl font-serif text-[34px] leading-[1.05] tracking-[-0.02em] sm:text-[46px]">
            See what residents are confused about.
          </h2>
          <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-paper/75">
            The staff dashboard shows the most-asked questions, the code sections people ask about most, and the questions the rules
            couldn&apos;t answer.
          </p>
          <Link
            href="/staff"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-[15px] font-medium text-forest-deep transition hover:bg-white"
          >
            View the dashboard demo <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
