import { safe } from "./db";

// Best-effort limits so a demo can't run up a big AI bill.
const DAILY = Number(process.env.DAILY_REQUEST_LIMIT || 200);
const PER_VISITOR = 25;

const memory = { day: "", total: 0, visitors: new Map<string, number>() };

function today() {
  return new Date().toISOString().slice(0, 10);
}

export async function checkLimit(visitorKey: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  const d = today();
  if (memory.day !== d) {
    memory.day = d;
    memory.total = 0;
    memory.visitors.clear();
  }
  const mine = memory.visitors.get(visitorKey) ?? 0;
  if (mine >= PER_VISITOR) return { ok: false, reason: "You've hit today's question limit. Please try again tomorrow." };

  const dbCount = await safe(
    async (sql) => {
      const [r] = await sql`select count(*)::int as n from ai_usage where day = ${d}`;
      return r.n as number;
    },
    -1,
  );
  const total = dbCount >= 0 ? dbCount : memory.total;
  if (total >= DAILY) return { ok: false, reason: "Ordinance has hit its daily limit. Please try again tomorrow." };

  memory.total += 1;
  memory.visitors.set(visitorKey, mine + 1);
  await safe((sql) => sql`insert into ai_usage (day) values (${d})`, null);
  return { ok: true };
}
