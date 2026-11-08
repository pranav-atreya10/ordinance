import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

const enabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
const isStaff = createRouteMatcher(["/staff(.*)"]);

const withClerk = clerkMiddleware(async (auth, req) => {
  if (isStaff(req)) await auth.protect();
});

// Clerk only runs once its keys are added. Until then /staff shows sample data only.
export default function proxy(req: NextRequest, ev: NextFetchEvent) {
  return enabled ? withClerk(req, ev) : NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt)).*)",
    "/(api|trpc)(.*)",
  ],
};
