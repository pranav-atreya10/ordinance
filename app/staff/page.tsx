import type { Metadata } from "next";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Help, Info, Lock } from "@/components/icons";
import { QuestionsChart } from "@/components/QuestionsChart";
import { clerkEnabled, isStaffEmail } from "@/lib/auth";
import { loadSections } from "@/lib/sections";
import { getStats } from "@/lib/stats";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Staff dashboard", robots: { index: false } };

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0 rounded-[22px] border border-line bg-surface p-5 shadow-card sm:p-6">
      <h2 className="text-[12px] font-medium tracking-wider text-faint uppercase">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function StaffPage() {
  const authOn = clerkEnabled();
  const user = authOn ? await currentUser() : null;
  const email = user?.primaryEmailAddress?.emailAddress;
  const allowed = authOn && isStaffEmail(email);
  const stats = await getStats(allowed);
  const titles = new Map(loadSections().map((s) => [s.section, s.title]));
  const maxSection = Math.max(1, ...stats.topSections.map((s) => s.count));

  const kpis = [
    { label: "Questions (7 days)", value: stats.totals.questions },
    { label: "Couldn't answer", value: stats.totals.unanswered },
    { label: "Found helpful", value: stats.totals.helpfulPct === null ? "—" : `${stats.totals.helpfulPct}%` },
    { label: "Pre-checks saved", value: stats.totals.prechecks },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 pb-8 sm:px-6 sm:pt-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12.5px] font-medium tracking-wider text-forest uppercase">For township staff</p>
          <h1 className="mt-3 font-serif text-[40px] leading-[1] tracking-[-0.02em] sm:text-[56px]">What residents are asking</h1>
        </div>
        <div className="flex items-center gap-3">
          {stats.sample && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber/25 bg-amber-soft px-3 py-1 text-[12.5px] font-medium text-amber">
              <span className="size-1.5 rounded-full bg-amber" /> Sample data — not real residents
            </span>
          )}
          {authOn && user && <UserButton />}
        </div>
      </div>

      {!authOn && (
        <p className="mt-6 flex items-start gap-2.5 rounded-2xl border border-line bg-paper-2/60 px-4 py-3 text-[14px] text-muted">
          <Lock size={17} className="mt-0.5 shrink-0" /> Staff login (Clerk) isn&apos;t set up yet, so this page only shows clearly fake sample data.
        </p>
      )}
      {authOn && !allowed && (
        <p className="mt-6 flex items-start gap-2.5 rounded-2xl border border-line bg-paper-2/60 px-4 py-3 text-[14px] text-muted">
          <Info size={17} className="mt-0.5 shrink-0" /> You&apos;re signed in as {email}, but you&apos;re not on the staff list, so you see sample data only.
        </p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-[20px] border border-line bg-surface p-5 shadow-card">
            <p className="text-[13px] text-muted">{k.label}</p>
            <p className="mt-2 font-serif text-[40px] leading-none tracking-[-0.02em] text-ink">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <Card title="Questions per day · last 14 days">
          <QuestionsChart data={stats.daily} />
        </Card>
        <Card title="Most-asked code sections">
          <ul className="space-y-3.5">
            {stats.topSections.map((s) => (
              <li key={s.section}>
                <div className="flex items-baseline justify-between gap-3 text-[14px]">
                  <span className="min-w-0 truncate">
                    <span className="font-mono text-[12.5px] text-forest">§ {s.section}</span>{" "}
                    <span className="text-ink-2">{titles.get(s.section) ?? ""}</span>
                  </span>
                  <span className="font-mono text-[12.5px] text-muted tabular-nums">{s.count}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-2">
                  <div className="h-full rounded-full bg-forest" style={{ width: `${(s.count / maxSection) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Card title="Most-asked questions this week">
          <ol className="divide-y divide-line">
            {stats.topQuestions.map((q, i) => (
              <li key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <span className="mt-0.5 font-mono text-[12px] text-faint">{String(i + 1).padStart(2, "0")}</span>
                <p className="flex-1 text-[14.5px] leading-snug text-ink first-letter:uppercase">{q.question}</p>
                <span className="rounded-full bg-paper-2 px-2 py-0.5 font-mono text-[12px] text-muted tabular-nums">{q.count}</span>
              </li>
            ))}
          </ol>
        </Card>
        <Card title="Questions the rules couldn't answer">
          <p className="-mt-1 mb-4 text-[13.5px] leading-relaxed text-muted">These show where the township&apos;s website or code could be clearer.</p>
          <ul className="space-y-2">
            {stats.unanswered.map((q, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-line bg-paper/50 px-3.5 py-2.5">
                <Help size={16} className="mt-0.5 shrink-0 text-amber" />
                <p className="flex-1 text-[14px] leading-snug text-ink-2">{q.question}</p>
                <span className="text-[12px] whitespace-nowrap text-faint">{q.when}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
