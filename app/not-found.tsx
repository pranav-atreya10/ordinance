import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-serif text-[96px] leading-none text-line-strong">§ 404</p>
      <h1 className="mt-4 font-serif text-[36px]">This page isn&apos;t in the code.</h1>
      <p className="mt-3 text-muted">The link may be wrong, or a saved pre-check may have been removed.</p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-ink px-5 py-2.5 text-[15px] font-medium text-paper">Back home</Link>
    </div>
  );
}
