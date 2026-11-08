import { SignIn } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/auth";

export default function SignInPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
      <h1 className="mb-8 text-center font-serif text-[40px] leading-none">Staff sign in</h1>
      {clerkEnabled() ? (
        <SignIn />
      ) : (
        <p className="text-center text-muted">Sign-in isn&apos;t set up yet. Add the Clerk keys to turn it on.</p>
      )}
    </div>
  );
}
