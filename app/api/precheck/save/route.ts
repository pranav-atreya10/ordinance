import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { dbEnabled, safe } from "@/lib/db";
import { ProjectSchema } from "@/lib/schemas";

const Ref = z.object({ section: z.string().max(40), title: z.string().max(120), url: z.string().url().max(300), lastChecked: z.string().max(20) });
const Result = z.object({
  mode: z.enum(["ai", "no-ai"]),
  summary: z.string().max(1500),
  items: z
    .array(z.object({ status: z.enum(["ok", "warn", "missing"]), title: z.string().max(200), detail: z.string().max(1000), source: Ref.nullable() }))
    .max(20),
  sources: z.array(Ref).max(10),
  notAddedYet: z.array(z.object({ section: z.string().max(40), title: z.string().max(120) })).max(10),
  checkedAt: z.string().max(40),
});
const Body = z.object({ project: ProjectSchema, result: Result, address: z.string().trim().max(200).optional() });

export async function POST(req: Request) {
  if (!dbEnabled()) return NextResponse.json({ error: "Saving isn't set up yet (no database connected)." }, { status: 503 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "That pre-check couldn't be saved." }, { status: 400 });
  const id = randomBytes(6).toString("base64url");
  const { project, result, address } = parsed.data;
  const ok = await safe(async (sql) => {
    await sql`insert into prechecks (id, project, result, address)
              values (${id}, ${sql.json(project)}, ${sql.json(result)}, ${address || null})`;
    return true;
  }, false);
  if (!ok) return NextResponse.json({ error: "Couldn't save right now. Please try again." }, { status: 500 });
  return NextResponse.json({ id });
}
