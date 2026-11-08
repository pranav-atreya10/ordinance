import type { Metadata } from "next";
import { PrecheckExperience } from "@/components/PrecheckExperience";

export const metadata: Metadata = { title: "Pre-check a project" };

export default function PrecheckPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 pb-8 sm:px-6 sm:pt-16">
      <div className="print:hidden">
        <p className="text-[12.5px] font-medium tracking-wider text-forest uppercase">Application pre-checker</p>
        <h1 className="mt-3 font-serif text-[40px] leading-[1] tracking-[-0.02em] sm:text-[56px]">Check your plan before you apply.</h1>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-muted">
          Describe your project and Ordinance checks it against the code sections it has. You&apos;ll see what looks OK, what might be
          a problem, and what info is missing.
        </p>
      </div>
      <div className="mt-9">
        <PrecheckExperience />
      </div>
    </div>
  );
}
