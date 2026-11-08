import { NextResponse } from "next/server";
import { checkLimit } from "@/lib/limit";
import { runPrecheck } from "@/lib/precheck";
import { ProjectSchema } from "@/lib/schemas";
import { visitorKey } from "@/lib/request";


export async function POST(req: Request) {
  const parsed = ProjectSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please pick a project type and check your answers." }, { status: 400 });
  const key = await visitorKey();
  try {
    const result = await runPrecheck(parsed.data, () => checkLimit(key));
    if ("error" in result) return NextResponse.json(result, { status: 429 });
    return NextResponse.json(result);
  } catch (e) {
    console.error("[precheck]", e);
    return NextResponse.json({ error: "Something went wrong on our side. Please try again." }, { status: 500 });
  }
}
