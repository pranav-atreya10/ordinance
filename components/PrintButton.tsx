"use client";

import { Printer } from "./icons";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface px-4 text-[14.5px] font-medium text-ink transition hover:bg-paper"
    >
      <Printer size={16} /> Download as PDF
    </button>
  );
}
