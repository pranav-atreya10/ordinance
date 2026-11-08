import postgres from "postgres";

// The database is optional. Without DATABASE_URL the app still works; it just doesn't save anything.
const g = globalThis as unknown as { __sql?: ReturnType<typeof postgres> };

export function getSql() {
  if (!process.env.DATABASE_URL) return null;
  g.__sql ??= postgres(process.env.DATABASE_URL, { max: 3, idle_timeout: 20, prepare: false });
  return g.__sql;
}

export const dbEnabled = () => Boolean(process.env.DATABASE_URL);

/** Run a query; if the database fails, log it and return the fallback instead of crashing the page. */
export async function safe<T>(fn: (sql: NonNullable<ReturnType<typeof getSql>>) => Promise<T>, fallback: T): Promise<T> {
  const sql = getSql();
  if (!sql) return fallback;
  try {
    return await fn(sql);
  } catch (e) {
    console.error("[db]", e);
    return fallback;
  }
}
