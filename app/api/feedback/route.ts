import { NextResponse } from "next/server";
import { z } from "zod";
import { safe } from "@/lib/db";

const Body = z.object({ questionId: z.number().int().positive().nullable(), helpful: z.boolean() });

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
  const { questionId, helpful } = parsed.data;
  const saved = await safe(async (sql) => {
    await sql`insert into feedback (question_id, helpful) values (${questionId}, ${helpful})`;
    return true;
  }, false);
  return NextResponse.json({ ok: true, saved });
}
