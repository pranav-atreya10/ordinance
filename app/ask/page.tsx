import type { Metadata } from "next";
import { AskExperience } from "@/components/AskExperience";

export const metadata: Metadata = { title: "Ask a question" };

export default async function AskPage({ searchParams }: PageProps<"/ask">) {
  const { q } = await searchParams;
  const initial = typeof q === "string" ? q.slice(0, 500) : "";
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 pb-8 sm:px-6 sm:pt-16">
      <p className="text-[12.5px] font-medium tracking-wider text-forest uppercase">Ask Ordinance</p>
      <h1 className="mt-3 font-serif text-[40px] leading-[1] tracking-[-0.02em] sm:text-[56px]">What do you want to build or do?</h1>
      <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
        Describe it like you&apos;d tell a neighbor. You&apos;ll get a plain-English answer with every rule linked to the Livingston code.
      </p>
      <div className="mt-9">
        <AskExperience key={initial} initialQuery={initial} />
      </div>
    </div>
  );
}
