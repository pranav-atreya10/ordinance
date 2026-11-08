"use client";

import { useState } from "react";
import { ThumbDown, ThumbUp } from "./icons";

export function Feedback({ questionId }: { questionId: number | null }) {
  const [sent, setSent] = useState<null | boolean>(null);
  const send = async (helpful: boolean) => {
    setSent(helpful);
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ questionId, helpful }),
    }).catch(() => {});
  };
  if (sent !== null)
    return <p className="animate-rise text-[14px] text-muted">Thanks — that helps make Ordinance better.</p>;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[14px] whitespace-nowrap text-muted">Was this helpful?</span>
      {[
        { v: true, I: ThumbUp, label: "Yes, helpful" },
        { v: false, I: ThumbDown, label: "No, not helpful" },
      ].map(({ v, I, label }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          onClick={() => send(v)}
          className="grid size-9 place-items-center rounded-full border border-line bg-surface text-ink-2 transition hover:-translate-y-px hover:border-line-strong hover:text-forest"
        >
          <I size={16} />
        </button>
      ))}
    </div>
  );
}
