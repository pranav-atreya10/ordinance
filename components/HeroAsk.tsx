"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EXAMPLES } from "@/lib/site";
import { ArrowRight, Search } from "./icons";

export function HeroAsk() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const go = (text: string) => {
    if (text.trim().length < 3) return;
    router.push(`/ask?q=${encodeURIComponent(text.trim())}`);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(q);
        }}
        className="group relative flex items-center rounded-[20px] border border-line-strong bg-surface p-2 shadow-lift transition focus-within:border-forest/60 focus-within:ring-4 focus-within:ring-forest/10"
      >
        <Search size={20} className="ml-3 shrink-0 text-faint" />
        <label htmlFor="hero-q" className="sr-only">What do you want to build or do?</label>
        <input
          id="hero-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="What do you want to build or do?"
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-[16px] text-ink outline-none placeholder:text-faint sm:text-[17px]"
          maxLength={500}
          autoComplete="off"
        />
        <button
          type="submit"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-[14px] bg-forest px-4 py-3 text-[15px] font-medium text-paper transition hover:bg-forest-deep disabled:opacity-50 sm:px-5"
          disabled={q.trim().length < 3}
        >
          <span className="hidden sm:inline">Ask</span> <ArrowRight size={17} />
        </button>
      </form>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            type="button"
            onClick={() => go(ex.q)}
            className="rounded-full border border-line bg-surface/70 px-3.5 py-1.5 text-[13.5px] text-ink-2 transition hover:-translate-y-px hover:border-line-strong hover:bg-surface"
          >
            {ex.label}
          </button>
        ))}
      </div>
    </div>
  );
}
