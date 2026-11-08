import type { Metadata } from "next";
import Link from "next/link";
import { loadSections } from "@/lib/sections";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "About & limits" };

const HOW = [
  "Sections of the Livingston Township Code are copied by hand from eCode360 into the app. Nothing is scraped.",
  "When you ask a question, Ordinance finds the sections that match your words.",
  "Only those sections are sent to an AI model (Claude), with strict instructions: answer only from the text, cite every rule, and never invent rules, fees, or measurements.",
  "Ordinance double-checks the answer and removes any citation that isn't one of the sections it actually sent.",
];

export default function AboutPage() {
  const sections = loadSections();
  const ready = sections.filter((s) => !s.isPlaceholder).length;
  const limits = [
    `It only knows the sections that have been added. Right now that's ${ready} of ${sections.length}.`,
    "Copied text can go out of date when the township changes the code. Each section shows when it was last checked.",
    "It can't see your property, your survey, or special approvals your lot may have.",
    "AI can still make mistakes. That's why every rule is linked so you can read it yourself.",
    "It is not legal advice and doesn't replace the Construction Official or Zoning Officer.",
  ];
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 pb-8 sm:px-6 sm:pt-16">
      <p className="text-[12.5px] font-medium tracking-wider text-forest uppercase">About</p>
      <h1 className="mt-3 font-serif text-[40px] leading-[1] tracking-[-0.02em] sm:text-[56px]">A student project, built to be honest.</h1>
      <div className="mt-8 space-y-5 text-[16.5px] leading-relaxed text-ink-2">
        <p>
          Ordinance was built by a high school student in Livingston, NJ. Figuring out whether you need a permit for a fence or a shop
          sign means digging through a long legal code. Ordinance gives you a plain-English starting point, and always sends you to the
          real source and the real people.
        </p>
        <p className="rounded-2xl border border-amber/20 bg-amber-soft px-5 py-4 text-[15px] text-amber">{SITE.disclaimer}</p>
      </div>

      <h2 className="mt-14 font-serif text-[32px] leading-tight">How it works</h2>
      <ol className="mt-5 space-y-4">
        {HOW.map((t, i) => (
          <li key={i} className="flex gap-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-forest-soft font-mono text-[13px] text-forest">{i + 1}</span>
            <p className="pt-1 text-[16px] leading-relaxed text-ink-2">{t}</p>
          </li>
        ))}
      </ol>

      <h2 className="mt-14 font-serif text-[32px] leading-tight">Its limits</h2>
      <ul className="mt-5 space-y-3 text-[16px] leading-relaxed text-ink-2">
        {limits.map((t) => (
          <li key={t} className="flex gap-3">
            <span className="mt-[11px] size-1.5 shrink-0 rounded-full bg-forest" /> {t}
          </li>
        ))}
      </ul>

      <h2 className="mt-14 font-serif text-[32px] leading-tight">Sections in Ordinance</h2>
      <ul className="mt-5 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
        {sections.map((s) => (
          <li key={s.file} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="min-w-0 text-[15px]">
              <span className="font-mono text-[12.5px] text-forest">§ {s.section}</span> {s.title}
            </span>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-medium ${s.isPlaceholder ? "bg-paper-2 text-faint" : "bg-forest-soft text-forest"}`}>
              {s.isPlaceholder ? "Not added yet" : "Added"}
            </span>
          </li>
        ))}
      </ul>

      <h2 className="mt-14 font-serif text-[32px] leading-tight">Privacy</h2>
      <p className="mt-4 text-[16px] leading-relaxed text-ink-2">
        No accounts for residents. Questions are saved without names or addresses so the township can see what&apos;s confusing. Your
        address is only stored if you type it in and choose “Save &amp; share” on a pre-check.
      </p>

      <Link href="/ask" className="mt-12 inline-flex rounded-full bg-forest px-5 py-3 text-[15px] font-medium text-paper hover:bg-forest-deep">
        Ask a question →
      </Link>
    </div>
  );
}
