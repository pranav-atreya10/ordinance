import { NextResponse } from "next/server";
import { z } from "zod";
import { answerQuestion } from "@/lib/answer";
import { checkLimit } from "@/lib/limit";
import { visitorKey } from "@/lib/request";
import { ZONES } from "@/lib/site";

const Body = z.object({
  question: z.string().trim().min(3).max(500),
  zone: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please type a question (3–500 characters)." }, { status: 400 });
  const zone = parsed.data.zone && ZONES.includes(parsed.data.zone) ? parsed.data.zone : undefined;
  const key = await visitorKey();
  try {
    const result = await answerQuestion(parsed.data.question, zone, () => checkLimit(key));
    if ("error" in result) return NextResponse.json(result, { status: 429 });
    return NextResponse.json(result);
  } catch (e) {
    console.error("[ask]", e);
    return NextResponse.json({ error: "Something went wrong on our side. Please try again." }, { status: 500 });
  }
}
