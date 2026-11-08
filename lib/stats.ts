import { dbEnabled, safe } from "./db";

export type Stats = {
  sample: boolean;
  totals: { questions: number; unanswered: number; helpfulPct: number | null; prechecks: number };
  daily: { day: string; count: number }[];
  topQuestions: { question: string; count: number }[];
  topSections: { section: string; count: number }[];
  unanswered: { question: string; when: string }[];
};

/** Clearly fake numbers for the demo, until real people use the site. */
function sampleStats(): Stats {
  const base = [12, 18, 15, 22, 31, 9, 7, 19, 24, 21, 28, 35, 11, 8];
  const daily = base.map((count, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (base.length - 1 - i));
    return { day: d.toISOString().slice(0, 10), count };
  });
  return {
    sample: true,
    totals: { questions: base.reduce((a, b) => a + b, 0), unanswered: 23, helpfulPct: 84, prechecks: 41 },
    daily,
    topQuestions: [
      { question: "Do I need a permit for a 6-foot backyard fence?", count: 38 },
      { question: "How close to the property line can a shed be?", count: 27 },
      { question: "Can I put solar panels on my roof?", count: 21 },
      { question: "Do I need approval for a sign on my storefront?", count: 17 },
      { question: "Can my café put tables outside in summer?", count: 12 },
    ],
    topSections: [
      { section: "170-91", count: 64 },
      { section: "170-87", count: 52 },
      { section: "170-118.1", count: 29 },
      { section: "170-90", count: 25 },
      { section: "170-92.1", count: 14 },
      { section: "170-94", count: 11 },
    ],
    unanswered: [
      { question: "How much does a deck permit cost?", when: "Sample" },
      { question: "Can I keep chickens in my backyard?", when: "Sample" },
      { question: "How long does a zoning variance take?", when: "Sample" },
      { question: "Do I need a permit to replace my roof shingles?", when: "Sample" },
    ],
  };
}

export async function getStats(allowReal: boolean): Promise<Stats> {
  if (!allowReal || !dbEnabled()) return sampleStats();
  const real = await safe(async (sql) => {
    const [t] = await sql`
      select
        (select count(*)::int from questions where created_at > now() - interval '7 days') as questions,
        (select count(*)::int from questions where not covered and created_at > now() - interval '7 days') as unanswered,
        (select round(100.0 * avg(case when helpful then 1 else 0 end))::int from feedback) as helpful,
        (select count(*)::int from prechecks) as prechecks,
        (select count(*)::int from questions) as all_time`;
    if (t.all_time < 10) return null; // not enough real data yet
    const daily = await sql`
      select to_char(d, 'YYYY-MM-DD') as day, coalesce(count(q.id), 0)::int as count
      from generate_series(current_date - 13, current_date, interval '1 day') d
      left join questions q on q.created_at::date = d::date
      group by d order by d`;
    const topQuestions = await sql`
      select lower(question) as question, count(*)::int as count from questions
      where created_at > now() - interval '7 days' group by lower(question) order by count desc limit 5`;
    const topSections = await sql`
      select s as section, count(*)::int as count from questions, unnest(sections) s
      group by s order by count desc limit 6`;
    const unanswered = await sql`
      select question, to_char(created_at, 'Mon DD') as when from questions
      where not covered order by created_at desc limit 8`;
    return {
      sample: false,
      totals: { questions: t.questions, unanswered: t.unanswered, helpfulPct: t.helpful, prechecks: t.prechecks },
      daily: daily.map((r) => ({ day: r.day, count: r.count })),
      topQuestions: topQuestions.map((r) => ({ question: r.question, count: r.count })),
      topSections: topSections.map((r) => ({ section: r.section, count: r.count })),
      unanswered: unanswered.map((r) => ({ question: r.question, when: r.when })),
    } satisfies Stats;
  }, null);
  return real ?? sampleStats();
}
