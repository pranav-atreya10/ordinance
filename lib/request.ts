import { headers } from "next/headers";

/** A per-visitor key used only in memory for rate limiting. Never stored. */
export async function visitorKey() {
  const h = await headers();
  return (h.get("x-forwarded-for") || h.get("x-real-ip") || "anon").split(",")[0].trim();
}
